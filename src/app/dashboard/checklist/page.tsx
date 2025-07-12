'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  CheckIcon, 
  PlusIcon,
  XMarkIcon,
  HeartIcon,
  SparklesIcon,
  CalendarDaysIcon,
  GiftIcon,
  CameraIcon,
  MusicalNoteIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid'

interface ChecklistItem {
  id: string
  title: string
  category: string
  culture: string | null
  isCompleted: boolean
  completedAt: string | null
  notes: string | null
  createdAt: string
}

const categoryConfig = {
  'ENGAGEMENT': {
    name: 'Fiançailles',
    icon: HeartIcon,
    color: 'rose',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700'
  },
  'KHOTBA': {
    name: 'Khotba',
    icon: SparklesIcon,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  'RELIGIOUS_CEREMONY': {
    name: 'Cérémonie Religieuse',
    icon: SparklesIcon,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  'HENNA': {
    name: 'Soirée Henné',
    icon: PaintBrushIcon,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700'
  },
  'BACHELORETTE': {
    name: 'EVJF',
    icon: GiftIcon,
    color: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  'CIVIL_CEREMONY': {
    name: 'Mariage Civil',
    icon: CalendarDaysIcon,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700'
  },
  'RECEPTION': {
    name: 'Réception',
    icon: MusicalNoteIcon,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  'TROUSSEAU': {
    name: 'Trousseau',
    icon: GiftIcon,
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  'GENERAL': {
    name: 'Général',
    icon: CheckIcon,
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700'
  }
}

const cultureColors = {
  'MOROCCAN': { flag: '🇲🇦', color: 'bg-red-100 text-red-700' },
  'TUNISIAN': { flag: '🇹🇳', color: 'bg-red-100 text-red-700' },
  'ALGERIAN': { flag: '🇩🇿', color: 'bg-green-100 text-green-700' },
  'FRENCH': { flag: '🇫🇷', color: 'bg-blue-100 text-blue-700' },
  'SPANISH': { flag: '🇪🇸', color: 'bg-yellow-100 text-yellow-700' },
  'ITALIAN': { flag: '🇮🇹', color: 'bg-green-100 text-green-700' },
  'TURKISH': { flag: '🇹🇷', color: 'bg-red-100 text-red-700' },
  'LEBANESE': { flag: '🇱🇧', color: 'bg-red-100 text-red-700' },
  'MIXED': { flag: '🌍', color: 'bg-purple-100 text-purple-700' }
}

interface ChecklistSuggestion {
  title: string
  category: string
  culture?: string
  timeline: string
  priority: 'high' | 'medium' | 'low'
  description: string
}

const checklistSuggestions: ChecklistSuggestion[] = [
  // Engagement
  { title: 'Organiser la demande en mariage', category: 'ENGAGEMENT', timeline: '12-6 mois avant', priority: 'high', description: 'Planifier le moment et le lieu parfait pour la demande' },
  { title: 'Choisir les alliances', category: 'ENGAGEMENT', timeline: '6-4 mois avant', priority: 'high', description: 'Sélectionner et commander les bagues de fiançailles et mariage' },
  { title: 'Séance photo de fiançailles', category: 'ENGAGEMENT', timeline: '6-3 mois avant', priority: 'medium', description: 'Pour les faire-part et créer de beaux souvenirs' },
  
  // Khotba (Moroccan tradition)
  { title: 'Organiser la Khotba', category: 'KHOTBA', culture: 'MOROCCAN', timeline: '6-4 mois avant', priority: 'high', description: 'Cérémonie de demande officielle en mariage selon la tradition' },
  { title: 'Préparer les cadeaux traditionnels', category: 'KHOTBA', culture: 'MOROCCAN', timeline: '1 mois avant', priority: 'high', description: 'Henné, sucre, dattes, thé, corbeille de mariage' },
  { title: 'Choisir les tenues traditionnelles', category: 'KHOTBA', culture: 'MOROCCAN', timeline: '2 mois avant', priority: 'medium', description: 'Caftan ou takchita pour la future mariée et famille' },
  { title: 'Préparer la maison familiale', category: 'KHOTBA', culture: 'MOROCCAN', timeline: '2 semaines avant', priority: 'medium', description: 'Décoration traditionnelle pour recevoir la famille' },
  
  // Religious Ceremony
  { title: 'Réserver le lieu de culte', category: 'RELIGIOUS_CEREMONY', timeline: '6-4 mois avant', priority: 'high', description: 'Mosquée, église, synagogue selon votre foi' },
  { title: 'Contacter l\'officiant religieux', category: 'RELIGIOUS_CEREMONY', timeline: '4-3 mois avant', priority: 'high', description: 'Imam, prêtre, rabbin ou pasteur' },
  { title: 'Préparer les documents religieux', category: 'RELIGIOUS_CEREMONY', timeline: '2 mois avant', priority: 'high', description: 'Certificats de baptême, conversion, etc.' },
  { title: 'Choisir les chants/récitations', category: 'RELIGIOUS_CEREMONY', timeline: '1 mois avant', priority: 'medium', description: 'Musique sacrée pour la cérémonie' },
  
  // Henné
  { title: 'Réserver l\'artiste henné', category: 'HENNA', culture: 'MOROCCAN', timeline: '3-2 mois avant', priority: 'high', description: 'Neqqacha professionnelle pour motifs traditionnels' },
  { title: 'Organiser la soirée henné', category: 'HENNA', culture: 'MOROCCAN', timeline: '2 mois avant', priority: 'high', description: 'Lieu, décoration mauresque, invitations famille' },
  { title: 'Prévoir le menu traditionnel', category: 'HENNA', culture: 'MOROCCAN', timeline: '1 mois avant', priority: 'medium', description: 'Pastillas, couscous, pâtisseries orientales' },
  { title: 'Organiser les animations', category: 'HENNA', culture: 'MOROCCAN', timeline: '1 mois avant', priority: 'medium', description: 'Chants traditionnels, ululations, musique andalouse' },
  { title: 'Préparer les accessoires', category: 'HENNA', culture: 'MOROCCAN', timeline: '2 semaines avant', priority: 'medium', description: 'Bougies, plateaux en cuivre, coussins orientaux' },
  
  // EVJF/EVG
  { title: 'Planifier l\'EVJF', category: 'BACHELORETTE', timeline: '2-1 mois avant', priority: 'high', description: 'Enterrement de vie de jeune fille' },
  { title: 'Réserver les activités', category: 'BACHELORETTE', timeline: '2 mois avant', priority: 'medium', description: 'Spa, restaurant, activités fun' },
  { title: 'Organiser les déguisements', category: 'BACHELORETTE', timeline: '1 mois avant', priority: 'low', description: 'Thème et accessoires' },
  
  // Civil Ceremony
  { title: 'Prendre RDV en mairie', category: 'CIVIL_CEREMONY', timeline: '6-4 mois avant', priority: 'high', description: 'Réservation de la date' },
  { title: 'Constituer le dossier civil', category: 'CIVIL_CEREMONY', timeline: '3 mois avant', priority: 'high', description: 'Actes de naissance, CNI, etc.' },
  { title: 'Choisir les témoins civils', category: 'CIVIL_CEREMONY', timeline: '2 mois avant', priority: 'high', description: '2 témoins minimum' },
  { title: 'Préparer les vœux civils', category: 'CIVIL_CEREMONY', timeline: '1 mois avant', priority: 'medium', description: 'Discours personnalisés' },
  
  // Reception
  { title: 'Réserver le lieu de réception', category: 'RECEPTION', timeline: '12-8 mois avant', priority: 'high', description: 'Salle des fêtes, château, restaurant' },
  { title: 'Choisir le traiteur', category: 'RECEPTION', timeline: '6-4 mois avant', priority: 'high', description: 'Menu et dégustation' },
  { title: 'Réserver DJ ou orchestre', category: 'RECEPTION', timeline: '6-3 mois avant', priority: 'high', description: 'Animation musicale' },
  { title: 'Commander la décoration florale', category: 'RECEPTION', timeline: '3-2 mois avant', priority: 'medium', description: 'Centres de table, bouquets' },
  { title: 'Commander le gâteau de mariage', category: 'RECEPTION', timeline: '2-1 mois avant', priority: 'medium', description: 'Pièce montée ou wedding cake' },
  
  // Trousseau
  { title: 'Essayer et commander la robe', category: 'TROUSSEAU', timeline: '6-4 mois avant', priority: 'high', description: 'Robe de mariée principale' },
  { title: 'Choisir le costume du marié', category: 'TROUSSEAU', timeline: '4-3 mois avant', priority: 'high', description: 'Smoking, costume ou tenue traditionnelle' },
  { title: 'Acheter les chaussures', category: 'TROUSSEAU', timeline: '3-2 mois avant', priority: 'medium', description: 'Chaussures confortables pour toute la journée' },
  { title: 'Réserver maquillage/coiffure', category: 'TROUSSEAU', timeline: '3-2 mois avant', priority: 'high', description: 'Essai et réservation pour le jour J' },
  { title: 'Choisir les bijoux', category: 'TROUSSEAU', timeline: '2-1 mois avant', priority: 'medium', description: 'Collier, boucles d\'oreilles, bracelet' },
  
  // General
  { title: 'Envoyer les faire-part', category: 'GENERAL', timeline: '2-1.5 mois avant', priority: 'high', description: 'Invitations avec RSVP' },
  { title: 'Confirmer avec tous les prestataires', category: 'GENERAL', timeline: '1 semaine avant', priority: 'high', description: 'Dernière vérification' },
  { title: 'Répétition générale', category: 'GENERAL', timeline: '1-2 jours avant', priority: 'high', description: 'Timing et coordination' },
  { title: 'Préparer les affaires pour la lune de miel', category: 'GENERAL', timeline: '1 semaine avant', priority: 'medium', description: 'Valises et documents de voyage' },
  { title: 'Créer la liste de mariage', category: 'GENERAL', timeline: '4-3 mois avant', priority: 'medium', description: 'Registry pour les cadeaux' },
  { title: 'Réserver le photographe', category: 'GENERAL', timeline: '8-6 mois avant', priority: 'high', description: 'Photos du jour J' },
  { title: 'Réserver le vidéaste', category: 'GENERAL', timeline: '6-4 mois avant', priority: 'medium', description: 'Film souvenir du mariage' },
  { title: 'Organiser le transport', category: 'GENERAL', timeline: '3-2 mois avant', priority: 'medium', description: 'Voiture, calèche, ou autres' },
  { title: 'Réserver l\'hébergement', category: 'GENERAL', timeline: '4-3 mois avant', priority: 'medium', description: 'Pour les invités de loin' }
]

export default function ChecklistPage() {
  const { data: session } = useSession()
  const [checklists, setChecklists] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'GENERAL',
    culture: '',
    notes: ''
  })

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = async () => {
    try {
      const response = await fetch('/api/checklists')
      if (response.ok) {
        const data = await response.json()
        setChecklists(data)
      }
    } catch (error) {
      console.error('Error fetching checklists:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/checklists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setChecklists(checklists.map(item => 
          item.id === id ? { ...item, isCompleted: updatedItem.isCompleted, completedAt: updatedItem.completedAt } : item
        ))
      }
    } catch (error) {
      console.error('Error updating checklist:', error)
    }
  }

  const addNewItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/checklists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        const item = await response.json()
        setChecklists([...checklists, item])
        setNewItem({ title: '', category: 'GENERAL', culture: '', notes: '' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error adding checklist item:', error)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return

    try {
      const response = await fetch(`/api/checklists/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChecklists(checklists.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error)
    }
  }

  const addSuggestion = async (suggestion: ChecklistSuggestion) => {
    try {
      const response = await fetch('/api/checklists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: suggestion.title,
          category: suggestion.category,
          culture: suggestion.culture || '',
          notes: `${suggestion.description} | Timeline: ${suggestion.timeline}`
        }),
      })

      if (response.ok) {
        const item = await response.json()
        setChecklists([...checklists, item])
      }
    } catch (error) {
      console.error('Error adding suggestion:', error)
    }
  }

  const getFilteredSuggestions = () => {
    const existingTitles = new Set(checklists.map(item => item.title))
    return checklistSuggestions.filter(suggestion => !existingTitles.has(suggestion.title))
  }

  if (!session) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Group checklists by category
  const groupedChecklists = checklists.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const completedCount = checklists.filter(item => item.isCompleted).length
  const totalCount = checklists.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckIcon className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">TO DO LIST</h1>
                  <p className="text-purple-100 mt-1">
                    Suivez vos tâches personnalisées selon vos traditions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{completedCount}/{totalCount}</div>
                <div className="text-purple-100">tâches complétées</div>
                {progressPercentage === 100 && (
                  <div className="text-sm mt-1 animate-bounce">Parfait !</div>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-purple-400 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 text-white opacity-20 text-5xl">✓</div>
          <div className="absolute top-1/4 right-1/4 transform text-white opacity-20 text-4xl">✦</div>
        </div>

        {/* Add New Item Button and Suggestions */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Suggestions intelligentes</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter une tâche</span>
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nouvelle tâche</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={addNewItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre de la tâche
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Réserver la Negafa"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  placeholder="Détails ou remarques..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggestions intelligentes</h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Suggestions personnalisées basées sur vos traditions culturelles et l'organisation type d'un mariage
            </p>

            <div className="space-y-4">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const categorySuggestions = getFilteredSuggestions().filter(s => s.category === category)
                if (categorySuggestions.length === 0) return null

                const Icon = config.icon
                return (
                  <div key={category} className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={`h-5 w-5 ${config.textColor}`} />
                      <h4 className={`font-semibold ${config.textColor}`}>{config.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${config.textColor} bg-white dark:bg-gray-800`}>
                        {categorySuggestions.length} suggestions
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySuggestions.slice(0, 6).map((suggestion, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                              {suggestion.title}
                            </h5>
                            <div className="flex items-center space-x-2">
                              {suggestion.culture && cultureColors[suggestion.culture as keyof typeof cultureColors] && (
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                  cultureColors[suggestion.culture as keyof typeof cultureColors].color
                                }`}>
                                  {cultureColors[suggestion.culture as keyof typeof cultureColors].flag}
                                </span>
                              )}
                              <span className={`text-xs px-1 py-0.5 rounded ${
                                suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {suggestion.priority === 'high' ? 'Haute' : suggestion.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.timeline}
                            </span>
                            <button
                              onClick={() => addSuggestion(suggestion)}
                              className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {categorySuggestions.length > 6 && (
                      <div className="text-center mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{categorySuggestions.length - 6} autres suggestions disponibles
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {getFilteredSuggestions().length === 0 && (
              <div className="text-center py-8">
                <CheckIcon className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Excellent travail !</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous avez déjà ajouté toutes nos suggestions. Votre checklist est très complète !
                </p>
              </div>
            )}
          </div>
        )}

        {/* Checklist Categories */}
        <div className="space-y-6">
          {Object.entries(groupedChecklists).map(([category, items]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig]
            const Icon = config.icon
            const categoryCompleted = items.filter(item => item.isCompleted).length
            const categoryTotal = items.length
            const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100)

            return (
              <div key={category} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden`}>
                <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${config.textColor}`} />
                      <h3 className={`text-lg font-semibold ${config.textColor}`}>
                        {config.name}
                      </h3>
                    </div>
                    <div className={`text-sm font-medium ${config.textColor}`}>
                      {categoryCompleted}/{categoryTotal} complétées ({categoryProgress}%)
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                          item.isCompleted 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <button
                          onClick={() => toggleComplete(item.id, item.isCompleted)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {item.isCompleted && (
                            <CheckIconSolid className="h-4 w-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium ${
                              item.isCompleted ? 'text-green-800 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'
                            }`}>
                              {item.title}
                            </h4>
                            {item.culture && cultureColors[item.culture as keyof typeof cultureColors] && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                cultureColors[item.culture as keyof typeof cultureColors].color
                              }`}>
                                {cultureColors[item.culture as keyof typeof cultureColors].flag}
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.notes}</p>
                          )}
                          {item.completedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Complétée le {new Date(item.completedAt).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {checklists.length === 0 && (
          <div className="text-center py-12">
            <CheckIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune tâche pour le moment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Créez votre profil de couple pour générer automatiquement vos tâches culturelles
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Ajouter votre première tâche
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
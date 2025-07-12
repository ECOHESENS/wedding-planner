'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  SparklesIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  BeakerIcon,
  ScissorsIcon,
  HeartIcon,
  GiftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid'

interface BridalPrepItem {
  id: string
  title: string
  category: 'beauty' | 'dress' | 'accessories' | 'wellness' | 'planning'
  description: string
  date?: string
  time?: string
  location?: string
  contact?: string
  price?: number
  notes?: string
  isCompleted: boolean
  isImportant: boolean
  daysBeforeWedding?: number
}

interface Provider {
  id: string
  name: string
  type: 'makeup' | 'hair' | 'nails' | 'spa' | 'other'
  specialties: string[]
  rating: number
  contact: string
  location: string
  price: string
  notes: string
  recommended: boolean
}

interface Dress {
  id: string
  name: string
  type: 'ceremony' | 'reception' | 'civil' | 'other'
  designer: string
  store: string
  price: string
  size: string
  alterations: string
  status: 'searching' | 'found' | 'ordered' | 'alterations' | 'ready'
  notes: string
  fittingDates: string[]
}

const categoryConfig = {
  beauty: {
    name: 'Beauté & Soins',
    icon: BeakerIcon,
    color: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    darkBg: 'dark:bg-pink-900/20',
    darkText: 'dark:text-pink-300'
  },
  dress: {
    name: 'Robe & Retouches',
    icon: SparklesIcon,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    darkBg: 'dark:bg-purple-900/20',
    darkText: 'dark:text-purple-300'
  },
  accessories: {
    name: 'Accessoires & Bijoux',
    icon: GiftIcon,
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    darkBg: 'dark:bg-amber-900/20',
    darkText: 'dark:text-amber-300'
  },
  wellness: {
    name: 'Bien-être & Fitness',
    icon: HeartIcon,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    darkBg: 'dark:bg-green-900/20',
    darkText: 'dark:text-green-300'
  },
  planning: {
    name: 'Planning & Organisation',
    icon: CalendarDaysIcon,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    darkBg: 'dark:bg-blue-900/20',
    darkText: 'dark:text-blue-300'
  }
}

const defaultPrepItems: Omit<BridalPrepItem, 'id' | 'isCompleted'>[] = [
  // Beauty & Soins
  {
    title: '💄 Essai maquillage & coiffure',
    category: 'beauty',
    description: 'Test complet du look beauté pour le jour J',
    daysBeforeWedding: 30,
    isImportant: true
  },
  {
    title: '💅 Manucure & pédicure',
    category: 'beauty',
    description: 'Soins des ongles pour des mains parfaites',
    daysBeforeWedding: 3,
    isImportant: true
  },
  {
    title: '✨ Soin du visage éclat',
    category: 'beauty',
    description: 'Nettoyage de peau en profondeur et hydratation',
    daysBeforeWedding: 7,
    isImportant: false
  },
  {
    title: '🦷 Blanchiment dentaire',
    category: 'beauty',
    description: 'Pour un sourire éclatant sur les photos',
    daysBeforeWedding: 14,
    isImportant: false
  },
  {
    title: '👁️ Extension de cils',
    category: 'beauty',
    description: 'Regard intense sans maquillage forcé',
    daysBeforeWedding: 5,
    isImportant: false
  },

  // Robe & Retouches
  {
    title: '👗 Dernier essayage de la robe',
    category: 'dress',
    description: 'Vérification finale des retouches et ajustements',
    daysBeforeWedding: 7,
    isImportant: true
  },
  {
    title: '🪡 Retouches finales',
    category: 'dress',
    description: 'Derniers ajustements si nécessaire',
    daysBeforeWedding: 14,
    isImportant: true
  },
  {
    title: '👠 Rodage des chaussures',
    category: 'dress',
    description: 'Porter les chaussures pour éviter les ampoules',
    daysBeforeWedding: 10,
    isImportant: true
  },
  {
    title: '🩱 Essayage de la lingerie',
    category: 'dress',
    description: 'Vérifier que tout est invisible sous la robe',
    daysBeforeWedding: 7,
    isImportant: true
  },

  // Accessoires & Bijoux
  {
    title: '💎 Récupération des bijoux',
    category: 'accessories',
    description: 'Collier, boucles d\'oreilles, bracelet',
    daysBeforeWedding: 3,
    isImportant: true
  },
  {
    title: '🎀 Voile et accessoires cheveux',
    category: 'accessories',
    description: 'S\'assurer que tout s\'harmonise avec la coiffure',
    daysBeforeWedding: 7,
    isImportant: true
  },
  {
    title: '👛 Préparation du sac mariée',
    category: 'accessories',
    description: 'Kit de retouches, mouchoirs, parfum...',
    daysBeforeWedding: 2,
    isImportant: true
  },
  {
    title: '🌸 Commande du bouquet de mariée',
    category: 'accessories',
    description: 'Confirmation avec le fleuriste',
    daysBeforeWedding: 3,
    isImportant: true
  },

  // Bien-être & Fitness
  {
    title: '🧘‍♀️ Séance de relaxation',
    category: 'wellness',
    description: 'Massage ou méditation pour gérer le stress',
    daysBeforeWedding: 2,
    isImportant: false
  },
  {
    title: '💪 Dernière séance sport',
    category: 'wellness',
    description: 'Activité douce pour rester en forme',
    daysBeforeWedding: 5,
    isImportant: false
  },
  {
    title: '😴 Planning sommeil',
    category: 'wellness',
    description: 'Se coucher tôt pour être en forme',
    daysBeforeWedding: 3,
    isImportant: true
  },
  {
    title: '🥗 Alimentation équilibrée',
    category: 'wellness',
    description: 'Éviter les aliments qui gonflent',
    daysBeforeWedding: 7,
    isImportant: true
  },

  // Planning & Organisation
  {
    title: '📋 Check-list finale beauté',
    category: 'planning',
    description: 'Vérifier que tous les RDV sont pris',
    daysBeforeWedding: 30,
    isImportant: true
  },
  {
    title: '💼 Préparation kit urgence',
    category: 'planning',
    description: 'Épingles, aiguille, fil, détachant...',
    daysBeforeWedding: 2,
    isImportant: true
  },
  {
    title: '📱 Photos de référence',
    category: 'planning',
    description: 'Rassembler les inspirations coiffure/maquillage',
    daysBeforeWedding: 30,
    isImportant: false
  },
  {
    title: '👥 Brief équipe beauté',
    category: 'planning',
    description: 'Expliquer le timing et les attentes',
    daysBeforeWedding: 7,
    isImportant: true
  }
]

export default function BridalPrepPage() {
  const { data: session } = useSession()
  const [prepItems, setPrepItems] = useState<BridalPrepItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'beauty' as const,
    description: '',
    date: '',
    time: '',
    location: '',
    contact: '',
    price: '',
    notes: '',
    isImportant: false,
    daysBeforeWedding: ''
  })
  const [activeTab, setActiveTab] = useState<'tasks' | 'providers' | 'dresses' | 'tips'>('tasks')
  const [dresses, setDresses] = useState<Dress[]>([
    {
      id: '1',
      name: 'Robe de cérémonie',
      type: 'ceremony',
      designer: '',
      store: '',
      price: '',
      size: '',
      alterations: '',
      status: 'searching',
      notes: '',
      fittingDates: []
    }
  ])
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Exemple Salon',
      type: 'makeup',
      specialties: ['Maquillage mariée', 'Coiffure'],
      rating: 4.5,
      contact: '',
      location: '',
      price: '',
      notes: '',
      recommended: false
    }
  ])

  useEffect(() => {
    if (session) {
      fetchPrepItems()
    }
  }, [session])

  const fetchPrepItems = async () => {
    try {
      // For now, we'll use default items with generated IDs
      const itemsWithIds = defaultPrepItems.map((item, index) => ({
        ...item,
        id: `prep-${index}`,
        isCompleted: Math.random() > 0.7 // Some items randomly completed for demo
      }))
      setPrepItems(itemsWithIds)
    } catch (error) {
      console.error('Error fetching prep items:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string) => {
    setPrepItems(items => items.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ))
  }

  const addNewItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPrepItem: BridalPrepItem = {
      id: `prep-custom-${Date.now()}`,
      title: newItem.title,
      category: newItem.category,
      description: newItem.description,
      date: newItem.date || undefined,
      time: newItem.time || undefined,
      location: newItem.location || undefined,
      contact: newItem.contact || undefined,
      price: newItem.price ? parseFloat(newItem.price) : undefined,
      notes: newItem.notes || undefined,
      isCompleted: false,
      isImportant: newItem.isImportant,
      daysBeforeWedding: newItem.daysBeforeWedding ? parseInt(newItem.daysBeforeWedding) : undefined
    }

    setPrepItems(prev => [...prev, newPrepItem])
    setNewItem({
      title: '',
      category: 'beauty',
      description: '',
      date: '',
      time: '',
      location: '',
      contact: '',
      price: '',
      notes: '',
      isImportant: false,
      daysBeforeWedding: ''
    })
    setShowAddForm(false)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Êtes-vous sûre de vouloir supprimer cette tâche ?')) return
    setPrepItems(items => items.filter(item => item.id !== id))
  }

  const filteredItems = selectedCategory === 'all' 
    ? prepItems 
    : prepItems.filter(item => item.category === selectedCategory)

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, BridalPrepItem[]>)

  const completedCount = prepItems.filter(item => item.isCompleted).length
  const totalCount = prepItems.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (!session) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">✨ Ma Préparation de Mariée</h1>
                <p className="text-pink-100 mt-1">
                  Tout ce qu'il faut pour être parfaite le jour J
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{completedCount}/{totalCount}</div>
              <div className="text-pink-100">tâches complétées</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-pink-400 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const categoryItems = prepItems.filter(item => item.category === key)
            const completedItems = categoryItems.filter(item => item.isCompleted)
            const Icon = config.icon
            
            return (
              <div key={key} className={`${config.bgColor} ${config.darkBg} rounded-xl p-6 border ${config.borderColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-6 w-6 ${config.textColor} ${config.darkText}`} />
                  <span className={`text-sm font-medium ${config.textColor} ${config.darkText}`}>
                    {completedItems.length}/{categoryItems.length}
                  </span>
                </div>
                <h3 className={`font-semibold ${config.textColor} ${config.darkText} mb-1`}>
                  {config.name}
                </h3>
                <div className={`w-full bg-white dark:bg-gray-700 rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      config.color === 'pink' ? 'bg-pink-500' :
                      config.color === 'purple' ? 'bg-purple-500' :
                      config.color === 'amber' ? 'bg-amber-500' :
                      config.color === 'green' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${categoryItems.length > 0 ? (completedItems.length / categoryItems.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            📋 Tâches ({prepItems.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'providers'
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            💄 Prestataires ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab('dresses')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dresses'
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            👗 Robes ({dresses.length})
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tips'
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            💡 Conseils beauté
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <>
            {/* Actions */}
            <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Tout voir ({prepItems.length})
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = prepItems.filter(item => item.category === key).length
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === key
                      ? `${config.bgColor} ${config.textColor} ${config.darkBg} ${config.darkText}`
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {config.name} ({count})
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter une tâche</span>
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nouvelle tâche de préparation</h3>
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
                    Titre de la tâche *
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Essai maquillage"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={2}
                  placeholder="Détails de la tâche..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newItem.date}
                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heure
                  </label>
                  <input
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jours avant le mariage
                  </label>
                  <input
                    type="number"
                    value={newItem.daysBeforeWedding}
                    onChange={(e) => setNewItem({ ...newItem, daysBeforeWedding: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                    placeholder="Ex: 7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Institut, salon..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={newItem.contact}
                    onChange={(e) => setNewItem({ ...newItem, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Téléphone ou email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.isImportant}
                      onChange={(e) => setNewItem({ ...newItem, isImportant: e.target.checked })}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tâche importante
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={2}
                  placeholder="Notes supplémentaires..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Prep Items by Category */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig]
            const Icon = config.icon
            const categoryCompleted = items.filter(item => item.isCompleted).length
            const categoryTotal = items.length

            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className={`${config.bgColor} ${config.darkBg} ${config.borderColor} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${config.textColor} ${config.darkText}`} />
                      <h3 className={`text-lg font-semibold ${config.textColor} ${config.darkText}`}>
                        {config.name}
                      </h3>
                    </div>
                    <div className={`text-sm font-medium ${config.textColor} ${config.darkText}`}>
                      {categoryCompleted}/{categoryTotal} complétées
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {items
                      .sort((a, b) => {
                        // Sort by importance first, then by days before wedding
                        if (a.isImportant !== b.isImportant) {
                          return a.isImportant ? -1 : 1
                        }
                        if (a.daysBeforeWedding && b.daysBeforeWedding) {
                          return a.daysBeforeWedding - b.daysBeforeWedding
                        }
                        return 0
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-4 transition-all ${
                            item.isCompleted 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <button
                              onClick={() => toggleComplete(item.id)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                                item.isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                              }`}
                            >
                              {item.isCompleted && (
                                <CheckIconSolid className="h-4 w-4 text-white" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className={`font-medium ${
                                      item.isCompleted 
                                        ? 'text-green-800 dark:text-green-200 line-through' 
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {item.title}
                                    </h4>
                                    {item.isImportant && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        ⭐ Important
                                      </span>
                                    )}
                                    {item.daysBeforeWedding && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        J-{item.daysBeforeWedding}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {item.description}
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    {item.date && (
                                      <div className="flex items-center space-x-1">
                                        <CalendarDaysIcon className="h-3 w-3" />
                                        <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                                      </div>
                                    )}
                                    {item.time && (
                                      <div className="flex items-center space-x-1">
                                        <ClockIcon className="h-3 w-3" />
                                        <span>{item.time}</span>
                                      </div>
                                    )}
                                    {item.location && (
                                      <div className="flex items-center space-x-1">
                                        <MapPinIcon className="h-3 w-3" />
                                        <span>{item.location}</span>
                                      </div>
                                    )}
                                    {item.contact && (
                                      <div className="flex items-center space-x-1">
                                        <PhoneIcon className="h-3 w-3" />
                                        <span>{item.contact}</span>
                                      </div>
                                    )}
                                    {item.price && (
                                      <div className="flex items-center space-x-1">
                                        <CurrencyDollarIcon className="h-3 w-3" />
                                        <span>{item.price}€</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {item.notes && (
                                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                                      📝 {item.notes}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-4"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {selectedCategory === 'all' ? 'Commencez votre préparation' : 'Aucune tâche dans cette catégorie'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedCategory === 'all' 
                    ? 'Organisez tous les détails pour être parfaite le jour J'
                    : 'Ajoutez des tâches pour cette catégorie ou changez de filtre'
                  }
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Ajouter ma première tâche
                </button>
              </div>
            )}
          </>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                💄 Mes Prestataires Beauté
              </h3>
              <button
                onClick={() => {
                  const newProvider = {
                    id: `provider-${Date.now()}`,
                    name: 'Nouveau prestataire',
                    type: 'makeup',
                    specialties: [],
                    rating: 0,
                    contact: '',
                    location: '',
                    price: '',
                    notes: '',
                    recommended: false
                  }
                  setProviders([...providers, newProvider])
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Ajouter un prestataire</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h4>
                        {provider.recommended && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ⭐ Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {provider.type === 'makeup' ? '💄 Maquillage' : 
                         provider.type === 'hair' ? '💇‍♀️ Coiffure' : 
                         provider.type === 'nails' ? '💅 Ongles' : 
                         provider.type === 'spa' ? '🧘‍♀️ Spa & Bien-être' : 'Autre'}
                      </p>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${
                            i < provider.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                          }`}>
                            ⭐
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {provider.rating > 0 ? `${provider.rating}/5` : 'Non noté'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setProviders(providers.filter(p => p.id !== provider.id))}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {provider.specialties.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Spécialités:</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.map((specialty, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {provider.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                    )}
                    
                    {provider.contact && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{provider.contact}</span>
                      </div>
                    )}
                    
                    {provider.price && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{provider.price}</span>
                      </div>
                    )}
                    
                    {provider.notes && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                        📝 {provider.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {providers.length === 0 && (
              <div className="text-center py-12">
                <BeakerIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ajoutez vos prestataires beauté
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Organisez tous vos rendez-vous beauté pour le jour J
                </p>
                <button
                  onClick={() => {
                    const newProvider = {
                      id: `provider-${Date.now()}`,
                      name: 'Mon premier prestataire',
                      type: 'makeup',
                      specialties: ['Maquillage mariée'],
                      rating: 0,
                      contact: '',
                      location: '',
                      price: '',
                      notes: '',
                      recommended: false
                    }
                    setProviders([newProvider])
                  }}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Ajouter mon premier prestataire
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dresses Tab */}
        {activeTab === 'dresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                👗 Mes Robes de Mariée
              </h3>
              <button
                onClick={() => {
                  const newDress = {
                    id: `dress-${Date.now()}`,
                    name: 'Nouvelle robe',
                    type: 'ceremony',
                    designer: '',
                    store: '',
                    price: '',
                    size: '',
                    alterations: '',
                    status: 'searching',
                    notes: '',
                    fittingDates: []
                  }
                  setDresses([...dresses, newDress])
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Ajouter une robe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dresses.map((dress) => (
                <div key={dress.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{dress.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          dress.status === 'searching' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          dress.status === 'found' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          dress.status === 'ordered' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          dress.status === 'alterations' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {dress.status === 'searching' ? '🔍 Recherche' :
                           dress.status === 'found' ? '✅ Trouvée' :
                           dress.status === 'ordered' ? '📦 Commandée' :
                           dress.status === 'alterations' ? '✂️ Retouches' :
                           '🎉 Prête'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {dress.type === 'ceremony' ? '⛪ Cérémonie' : 
                         dress.type === 'reception' ? '🎉 Réception' : 
                         dress.type === 'civil' ? '🏛️ Mairie' : 'Autre'}
                      </p>
                    </div>
                    <button
                      onClick={() => setDresses(dresses.filter(d => d.id !== dress.id))}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {dress.designer && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <ScissorsIcon className="h-4 w-4" />
                        <span><strong>Créateur:</strong> {dress.designer}</span>
                      </div>
                    )}
                    
                    {dress.store && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4" />
                        <span><strong>Boutique:</strong> {dress.store}</span>
                      </div>
                    )}
                    
                    {dress.price && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span><strong>Prix:</strong> {dress.price}</span>
                      </div>
                    )}
                    
                    {dress.size && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-gray-500">📏</span>
                        <span><strong>Taille:</strong> {dress.size}</span>
                      </div>
                    )}
                    
                    {dress.alterations && (
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-sm text-orange-700 dark:text-orange-300">
                        ✂️ <strong>Retouches:</strong> {dress.alterations}
                      </div>
                    )}
                    
                    {dress.notes && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                        📝 {dress.notes}
                      </div>
                    )}
                    
                    {dress.fittingDates.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Essayages:</p>
                        <div className="space-y-1">
                          {dress.fittingDates.map((date, idx) => (
                            <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                              📅 {new Date(date).toLocaleDateString('fr-FR')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {dresses.length === 0 && (
              <div className="text-center py-12">
                <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ajoutez vos robes de mariée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Suivez le processus de recherche et d'achat de vos robes
                </p>
                <button
                  onClick={() => {
                    const newDress = {
                      id: `dress-${Date.now()}`,
                      name: 'Ma robe de rêve',
                      type: 'ceremony',
                      designer: '',
                      store: '',
                      price: '',
                      size: '',
                      alterations: '',
                      status: 'searching',
                      notes: '',
                      fittingDates: []
                    }
                    setDresses([newDress])
                  }}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Ajouter ma première robe
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                💡 Conseils Beauté Mariée
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tous les secrets pour être rayonnante le jour J
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skincare Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">✨</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Soins de la peau</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Commencez une routine beauté 3 mois avant</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Hydratez votre peau matin et soir</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Faites un gommage hebdomadaire</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Buvez beaucoup d'eau (1,5L/jour minimum)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Évitez les nouveaux produits 1 mois avant</span>
                  </div>
                </div>
              </div>

              {/* Makeup Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">💄</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Maquillage</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Testez votre maquillage 2 semaines avant</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Choisissez un maquillage longue tenue</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Prévoyez une trousse de retouches</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Optez pour des couleurs naturelles</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>N'oubliez pas l'apprêt pour une tenue parfaite</span>
                  </div>
                </div>
              </div>

              {/* Hair Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">💇‍♀️</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Coiffure</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Faites une coupe 1 mois avant maximum</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Testez votre coiffure avec le voile</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Prévoyez des épingles de rechange</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Utilisez un spray fixateur longue tenue</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Apportez des photos de référence</span>
                  </div>
                </div>
              </div>

              {/* Body Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🧘‍♀️</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Bien-être</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Dormez 8h par nuit la semaine précédente</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Évitez l'alcool 48h avant</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Mangez léger le matin du mariage</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Pratiquez la méditation anti-stress</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Planifiez un massage relaxant</span>
                  </div>
                </div>
              </div>

              {/* Cultural Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🌍</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Traditions beauté</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Henné: appliquez 1-2 jours avant</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Hammam: rituels purification corps</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Kohl traditionnel pour les yeux</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Huile d'argan pour cheveux brillants</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Masque au rhassoul purifiant</span>
                  </div>
                </div>
              </div>

              {/* Emergency Kit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🚨</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Kit urgence beauté</h4>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Rouge à lèvres pour retouches</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Poudre matifiante anti-brillance</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Épingles à cheveux supplémentaires</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Mouchoirs en papier</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Spray fixateur coiffure</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Démaquillant pour corrections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
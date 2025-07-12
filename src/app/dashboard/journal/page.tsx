'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  SparklesIcon,
  CalendarDaysIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { JournalEntry, JOURNAL_MOODS, JOURNAL_CATEGORIES, JOURNAL_TEMPLATES } from '@/types/journal'
import JournalEntryCard from '@/components/journal/JournalEntryCard'
import AddJournalModal from '@/components/journal/AddJournalModal'
import JournalStats from '@/components/journal/JournalStats'
import JournalTemplates from '@/components/journal/JournalTemplates'

export default function JournalPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'entries' | 'templates' | 'timeline'>('entries')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmails, setInviteEmails] = useState([''])
  const [inviteMessage, setInviteMessage] = useState('')

  useEffect(() => {
    if (session) {
      fetchEntries()
    }
  }, [session])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journal')
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })
      
      if (response.ok) {
        const newEntry = await response.json()
        setEntries(prev => [newEntry, ...prev])
        setShowAddModal(false)
        setSelectedTemplate(null)
      }
    } catch (error) {
      console.error('Error adding journal entry:', error)
    }
  }

  const handleUpdateEntry = async (entryData: JournalEntry) => {
    try {
      const response = await fetch(`/api/journal/${entryData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })
      
      if (response.ok) {
        const updatedEntry = await response.json()
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
        setEditingEntry(null)
      }
    } catch (error) {
      console.error('Error updating journal entry:', error)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/journal/${entryId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setEntries(prev => prev.filter(e => e.id !== entryId))
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    }
  }

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowAddModal(true)
  }

  const handleInviteParticipants = async () => {
    const validEmails = inviteEmails.filter(email => email.trim() !== '')
    if (validEmails.length === 0) return

    try {
      const response = await fetch('/api/journal/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: validEmails,
          message: inviteMessage
        }),
      })

      if (response.ok) {
        setShowInviteModal(false)
        setInviteEmails([''])
        setInviteMessage('')
        // Show success message
        alert('Invitations envoyées avec succès !')
      }
    } catch (error) {
      console.error('Error sending invitations:', error)
      alert('Erreur lors de l\'envoi des invitations')
    }
  }

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, ''])
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...inviteEmails]
    newEmails[index] = value
    setInviteEmails(newEmails)
  }

  const removeEmail = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index))
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood
    
    return matchesSearch && matchesCategory && matchesMood
  })

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <BookOpenIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">My wedding journal</h1>
            </div>
            <p className="text-pink-100 text-lg">
              Partagez votre histoire d'amour avec des photos et des souvenirs
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Stats */}
        <JournalStats entries={entries} />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('entries')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'entries'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              📱 Vue Cartes ({entries.length})
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              📸 Timeline Photos
            </button>
            <button
              onClick={() => setViewMode('templates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'templates'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              💡 Idées d'entrées
            </button>
          </div>

          {(viewMode === 'entries' || viewMode === 'timeline') && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <span>👥</span>
                <span>Inviter à collaborer</span>
              </button>
              <button
                onClick={() => {
                  const text = `🎊 Découvrez mon journal de mariage ! J'ai déjà ${entries.length} moments partagés dans ma timeline. Venez voir nos préparatifs et notre histoire d'amour ! 💕`
                  const url = `whatsapp://send?text=${encodeURIComponent(text)}`
                  window.open(url, '_blank')
                }}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <span>📱</span>
                <span>Partager sur WhatsApp</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>📝 Ajouter moment</span>
              </button>
            </div>
          )}
        </div>

        {viewMode === 'templates' ? (
          <JournalTemplates onUseTemplate={handleUseTemplate} />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans la timeline..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Toutes les catégories</option>
                  {Object.entries(JOURNAL_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                {/* Mood Filter */}
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Toutes les humeurs</option>
                  {Object.entries(JOURNAL_MOODS).map(([key, mood]) => (
                    <option key={key} value={key}>{mood.emoji} {mood.label}</option>
                  ))}
                </select>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {filteredEntries.length} moment{filteredEntries.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Journal Content */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement de la timeline...</span>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {entries.length === 0 ? '📸 Créez votre timeline de mariage' : 'Aucun moment trouvé'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {entries.length === 0 
                    ? 'Documentez votre histoire d\'amour avec des photos, vidéos et souvenirs à partager avec vos proches.'
                    : 'Essayez de modifier vos filtres pour trouver ce que vous cherchez.'
                  }
                </p>
                {entries.length === 0 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    📝 Créer mon premier moment
                  </button>
                )}
              </div>
            ) : viewMode === 'timeline' ? (
              /* Timeline View */
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500"></div>
                <div className="space-y-8">
                  {filteredEntries.map((entry, index) => {
                    const mood = JOURNAL_MOODS[entry.mood]
                    const category = JOURNAL_CATEGORIES[entry.category as keyof typeof JOURNAL_CATEGORIES]
                    const formatDate = (date: Date) => {
                      return new Intl.DateTimeFormat('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).format(new Date(date))
                    }
                    
                    return (
                      <div key={entry.id} className="relative flex items-start space-x-6">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {mood.emoji}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative">
                          {/* Arrow pointing to timeline */}
                          <div className="absolute left-0 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white dark:border-r-gray-800 -translate-x-2"></div>
                          
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                                  {mood.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{category}</span>
                                {entry.milestone && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded text-xs font-medium">
                                    {entry.milestone}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {entry.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                📅 {formatDate(entry.date)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  const text = `💕 ${entry.title}\n\n${entry.content}\n\n📅 ${formatDate(entry.date)}\n\n🎊 Découvrez plus de moments sur notre timeline de mariage !`
                                  const url = `whatsapp://send?text=${encodeURIComponent(text)}`
                                  window.open(url, '_blank')
                                }}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                title="Partager sur WhatsApp"
                              >
                                <span className="text-lg">📱</span>
                              </button>
                              <button
                                onClick={() => setEditingEntry(entry)}
                                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {entry.content}
                            </p>
                          </div>
                          
                          {/* Photos in timeline */}
                          {entry.images && entry.images.length > 0 && (
                            <div className="mb-4">
                              <div className={`grid gap-2 ${
                                entry.images.length === 1 ? 'grid-cols-1' :
                                entry.images.length === 2 ? 'grid-cols-2' :
                                entry.images.length === 3 ? 'grid-cols-3' :
                                'grid-cols-2'
                              }`}>
                                {entry.images.slice(0, 4).map((image, idx) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={image}
                                      alt={`${entry.title} - Photo ${idx + 1}`}
                                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => {
                                        // Open image in a modal or lightbox
                                        window.open(image, '_blank')
                                      }}
                                    />
                                    {idx === 3 && entry.images!.length > 4 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                          +{entry.images!.length - 4}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Tags */}
                          {entry.tags.length > 0 && (
                            <div className="flex items-center space-x-2 flex-wrap">
                              <TagIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              {entry.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={setEditingEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddJournalModal
            isOpen={showAddModal}
            onClose={() => {
              setShowAddModal(false)
              setSelectedTemplate(null)
            }}
            onSubmit={handleAddEntry}
            templateId={selectedTemplate}
          />
        )}

        {editingEntry && (
          <AddJournalModal
            isOpen={!!editingEntry}
            onClose={() => setEditingEntry(null)}
            onSubmit={handleUpdateEntry}
            entry={editingEntry}
          />
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    👥 Inviter à collaborer
                  </h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💌 Invitez vos proches à contribuer à votre journal de mariage. Ils pourront ajouter des photos, des commentaires et des souvenirs !
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📧 Adresses email
                    </label>
                    <div className="space-y-2">
                      {inviteEmails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            placeholder="exemple@email.com"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                          {inviteEmails.length > 1 && (
                            <button
                              onClick={() => removeEmail(index)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addEmailField}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Ajouter un email</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      💬 Message d'invitation (optionnel)
                    </label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      rows={3}
                      placeholder="Ajoutez un message personnel à votre invitation..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      🎯 <strong>Fonctionnalités collaboratives:</strong>
                      <br />• Ajout de photos et commentaires
                      <br />• Partage d'histoires et souvenirs
                      <br />• Suggestions de moments à documenter
                      <br />• Accès sécurisé par invitation uniquement
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleInviteParticipants}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📤 Envoyer invitations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
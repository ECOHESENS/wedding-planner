'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface ClientDetail {
  id: string
  bride: {
    id: string
    name: string
    email: string
    phone?: string
  }
  groom: {
    id: string
    name: string
    email: string
    phone?: string
  }
  weddingDate: string
  venue?: string
  culture: string
  totalBudget: number
  spentBudget: number
  guestCount?: number
  events: Array<{
    id: string
    name: string
    date: string
    status: string
  }>
  budgetItems: Array<{
    id: string
    name: string
    category: string
    estimatedCost: number
    actualCost?: number
    status: string
  }>
  checklists: Array<{
    id: string
    title: string
    completed: boolean
    dueDate?: string
  }>
  documents: Array<{
    id: string
    name: string
    type: string
    uploadDate: string
  }>
  createdAt: string
  updatedAt: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (session && params.id) {
      fetchClientDetail()
    }
  }, [session, params.id])

  const fetchClientDetail = async () => {
    try {
      const response = await fetch(`/api/planner/clients/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setClient(data)
      } else if (response.status === 404) {
        router.push('/dashboard/clients')
      }
    } catch (error) {
      console.error('Error fetching client details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClient = async (updatedData: Partial<ClientDetail>) => {
    try {
      const response = await fetch(`/api/planner/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      
      if (response.ok) {
        const updatedClient = await response.json()
        setClient(updatedClient)
        setEditMode(false)
      }
    } catch (error) {
      console.error('Error updating client:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCultureFlag = (culture: string) => {
    const flags: Record<string, string> = {
      'MOROCCAN': '🇲🇦',
      'TUNISIAN': '🇹🇳',
      'ALGERIAN': '🇩🇿',
      'LEBANESE': '🇱🇧',
      'EGYPTIAN': '🇪🇬',
      'FRENCH': '🇫🇷',
      'MIXED': '🌍'
    }
    return flags[culture] || '🌍'
  }

  const budgetPercentage = client ? (client.spentBudget / client.totalBudget) * 100 : 0
  const daysUntilWedding = client ? Math.ceil((new Date(client.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0

  if (!session || session.user.role !== 'PLANNER') {
    return null
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Client non trouvé
          </h2>
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Retour
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Retour aux clients</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                <PencilIcon className="h-4 w-4" />
                <span>{editMode ? 'Annuler' : 'Modifier'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Couple Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <HeartIconSolid className="h-12 w-12 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {client.bride.name} & {client.groom.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                    <span>{getCultureFlag(client.culture)}</span>
                    <span>Mariage {client.culture.toLowerCase()}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Mariée:</span>
                    <span className="text-gray-900 dark:text-white">{client.bride.email}</span>
                  </div>
                  {client.bride.phone && (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{client.bride.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Marié:</span>
                    <span className="text-gray-900 dark:text-white">{client.groom.email}</span>
                  </div>
                  {client.groom.phone && (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{client.groom.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="font-medium">Date du mariage</span>
                </div>
                <div className="text-xl font-bold">{formatDate(client.weddingDate)}</div>
                <div className="text-sm opacity-90">
                  {daysUntilWedding > 0 ? `Dans ${daysUntilWedding} jours` : 'Passé'}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-300">Budget</span>
                </div>
                <div className="text-xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(client.spentBudget)} / {formatCurrency(client.totalBudget)}
                </div>
                <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {budgetPercentage.toFixed(1)}% utilisé
                </div>
              </div>

              {client.venue && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPinIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">Lieu</span>
                  </div>
                  <div className="text-sm text-blue-900 dark:text-blue-100">{client.venue}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble' },
              { id: 'budget', label: '💰 Budget' },
              { id: 'timeline', label: '📅 Planning' },
              { id: 'documents', label: '📄 Documents' },
              { id: 'communication', label: '💬 Communication' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{client.events.length}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Événements</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{client.budgetItems.length}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Postes budgétaires</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {client.checklists.filter(c => c.completed).length}/{client.checklists.length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Tâches terminées</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{client.documents.length}</div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Documents</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📅 Prochains événements
                  </h3>
                  <div className="space-y-3">
                    {client.events.slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{event.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(event.date)}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ✅ Tâches prioritaires
                  </h3>
                  <div className="space-y-3">
                    {client.checklists.filter(c => !c.completed).slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                          {task.dueDate && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Échéance: {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gestion du budget détaillée à venir
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cette section permettra de gérer le budget complet du client
                </p>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Timeline détaillée à venir
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cette section permettra de gérer le planning complet du client
                </p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gestion des documents à venir
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cette section permettra de gérer tous les documents du client
                </p>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Historique de communication à venir
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cette section permettra de gérer la communication avec le client
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
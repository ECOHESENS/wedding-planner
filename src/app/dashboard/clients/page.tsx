'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  UserGroupIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Client {
  id: string
  brideName: string
  groomName: string
  culture: string
  weddingDate: string | null
  totalBudget: number | null
  bride: { name: string; email: string }
  groom: { name: string; email: string } | null
  stats: {
    totalBudget: number
    totalSpent: number
    totalPaid: number
    budgetUsagePercentage: number
    eventsProgress: number
    checklistProgress: number
    nextEvent: any
    daysToWedding: number | null
  }
}

interface ClientsSummary {
  totalClients: number
  upcomingWeddings: number
  totalRevenue: number
  averageBudget: number
}

const cultureConfig = {
  'MOROCCAN': { label: 'Marocaine', flag: '🇲🇦', color: '#ef4444' },
  'TUNISIAN': { label: 'Tunisienne', flag: '🇹🇳', color: '#f97316' },
  'ALGERIAN': { label: 'Algérienne', flag: '🇩🇿', color: '#22c55e' },
  'FRENCH': { label: 'Française', flag: '🇫🇷', color: '#3b82f6' },
  'MIXED': { label: 'Mixte', flag: '🌍', color: '#8b5cf6' }
}

export default function ClientsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [clientsData, setClientsData] = useState<{
    clients: Client[]
    summary: ClientsSummary
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('weddingDate')

  useEffect(() => {
    if (session?.user.role !== 'PLANNER') {
      router.push('/dashboard')
      return
    }
    fetchClients()
  }, [session, router])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/planner/clients')
      if (response.ok) {
        const data = await response.json()
        setClientsData(data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUrgencyColor = (daysToWedding: number | null) => {
    if (!daysToWedding) return 'text-gray-500'
    if (daysToWedding < 30) return 'text-red-600'
    if (daysToWedding < 90) return 'text-orange-600'
    return 'text-green-600'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!session) return null

  if (session.user.role !== 'PLANNER') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600">Cette page est réservée aux wedding planners.</p>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Filter and sort clients
  const filteredClients = clientsData?.clients.filter(client =>
    client.brideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.groomName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'weddingDate':
        if (!a.weddingDate && !b.weddingDate) return 0
        if (!a.weddingDate) return 1
        if (!b.weddingDate) return -1
        return new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime()
      case 'budget':
        return (b.stats.totalBudget || 0) - (a.stats.totalBudget || 0)
      case 'progress':
        return b.stats.eventsProgress - a.stats.eventsProgress
      default:
        return 0
    }
  }) || []

  // Prepare chart data
  const cultureData = Object.entries(
    filteredClients.reduce((acc, client) => {
      const culture = client.culture
      acc[culture] = (acc[culture] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([culture, count]) => ({
    name: cultureConfig[culture as keyof typeof cultureConfig]?.label || culture,
    value: count,
    color: cultureConfig[culture as keyof typeof cultureConfig]?.color || '#6b7280'
  }))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserGroupIcon className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Gestion des Clients</h1>
                <p className="text-blue-100 mt-1">
                  Suivez et gérez tous vos mariages en cours
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{clientsData?.summary.totalClients || 0}</div>
              <div className="text-blue-100">clients actifs</div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientsData?.summary.totalClients || 0}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mariages à venir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientsData?.summary.upcomingWeddings || 0}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientsData && formatCurrency(clientsData.summary.totalRevenue)}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientsData && formatCurrency(clientsData.summary.averageBudget)}
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Culture Distribution Chart */}
        {cultureData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Culturelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cultureData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cultureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rechercher un client..."
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weddingDate">Date de mariage</option>
              <option value="budget">Budget</option>
              <option value="progress">Progression</option>
            </select>
          </div>
        </div>

        {/* Clients List */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((client) => {
              const config = cultureConfig[client.culture as keyof typeof cultureConfig]
              return (
                <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  {/* Client Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {client.brideName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {client.brideName} & {client.groomName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <span className="text-lg mr-1">{config?.flag}</span>
                            {config?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Voir les détails"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Wedding Date & Countdown */}
                  {client.weddingDate && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Date du mariage</p>
                          <p className="font-medium text-gray-900">{formatDate(client.weddingDate)}</p>
                        </div>
                        {client.stats.daysToWedding !== null && (
                          <div className={`text-right ${getUrgencyColor(client.stats.daysToWedding)}`}>
                            <p className="text-2xl font-bold">{Math.abs(client.stats.daysToWedding)}</p>
                            <p className="text-sm">
                              {client.stats.daysToWedding >= 0 ? 'jours restants' : 'jours passés'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progress Bars */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Événements</span>
                        <span className="font-medium">{client.stats.eventsProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(client.stats.eventsProgress)}`}
                          style={{ width: `${client.stats.eventsProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Checklist</span>
                        <span className="font-medium">{client.stats.checklistProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(client.stats.checklistProgress)}`}
                          style={{ width: `${client.stats.checklistProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-medium">{client.stats.budgetUsagePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            client.stats.budgetUsagePercentage > 100 ? 'bg-red-500' : 
                            client.stats.budgetUsagePercentage > 80 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(client.stats.budgetUsagePercentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-600 font-medium">Budget Total</p>
                      <p className="text-xl font-bold text-blue-900">
                        {formatCurrency(client.stats.totalBudget)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-green-600 font-medium">Dépensé</p>
                      <p className="text-xl font-bold text-green-900">
                        {formatCurrency(client.stats.totalSpent)}
                      </p>
                    </div>
                  </div>

                  {/* Next Event */}
                  {client.stats.nextEvent && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">Prochain événement:</span>
                      </div>
                      <p className="text-sm text-orange-800 mt-1">{client.stats.nextEvent.title}</p>
                      {client.stats.nextEvent.date && (
                        <p className="text-xs text-orange-600">
                          {formatDate(client.stats.nextEvent.date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Essayez de modifier votre terme de recherche' 
                : 'Commencez à gérer vos premiers clients'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
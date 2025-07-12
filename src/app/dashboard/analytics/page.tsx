'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface AnalyticsData {
  overview: {
    totalClients: number
    activeProjects: number
    upcomingWeddings: number
    totalRevenue: number
  }
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
  weddingTypes: Record<string, number>
  upcomingDeadlines: Array<{
    id: string
    title: string
    date: string
    clientName: string
    coupleId: string
  }>
  urgentTasks: Array<{
    type: string
    id: string
    title: string
    clientName: string
    coupleId: string
    urgent: boolean
    date?: string
  }>
  budgetAnalysis: {
    totalRevenue: number
    averageBudget: number
    budgetUtilization: Array<{
      clientName: string
      percentage: number
      amount: number
      budget: number
    }>
  }
}

const cultureColors = {
  'MOROCCAN': '#ef4444',
  'TUNISIAN': '#f97316', 
  'ALGERIAN': '#22c55e',
  'FRENCH': '#3b82f6',
  'MIXED': '#8b5cf6'
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user.role !== 'PLANNER') {
      router.push('/dashboard')
      return
    }
    fetchAnalytics()
  }, [session, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/planner/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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
      month: 'short',
      day: 'numeric'
    })
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">Les analytics apparaîtront une fois que vous aurez des clients.</p>
        </div>
      </DashboardLayout>
    )
  }

  // Prepare chart data
  const weddingTypesData = Object.entries(analyticsData.weddingTypes).map(([type, count]) => ({
    name: type === 'MOROCCAN' ? 'Marocain' : 
          type === 'TUNISIAN' ? 'Tunisien' :
          type === 'ALGERIAN' ? 'Algérien' :
          type === 'FRENCH' ? 'Français' : 'Mixte',
    value: count,
    color: cultureColors[type as keyof typeof cultureColors] || '#6b7280'
  }))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-purple-100 mt-1">
                Tableau de bord analytique pour optimiser votre activité
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Total</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalClients}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  Actifs
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.activeProjects}</p>
                <p className="text-sm text-blue-600">En cours</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mariages Prochains</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.upcomingWeddings}</p>
                <p className="text-sm text-orange-600">60 prochains jours</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                <p className="text-sm text-green-600">Total géré</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du Chiffre d'Affaires</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis formatter={(value) => `${value}€`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wedding Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Culture</h3>
            {weddingTypesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={weddingTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {weddingTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-300 text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Urgent Tasks & Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-orange-500" />
              Échéances Prochaines
            </h3>
            {analyticsData.upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.upcomingDeadlines.slice(0, 5).map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                      <p className="text-sm text-gray-600">{deadline.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {formatDate(deadline.date)}
                      </p>
                    </div>
                  </div>
                ))}
                {analyticsData.upcomingDeadlines.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{analyticsData.upcomingDeadlines.length - 5} autres échéances
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ClockIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune échéance prochaine</p>
              </div>
            )}
          </div>

          {/* Urgent Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
              Tâches Urgentes
            </h3>
            {analyticsData.urgentTasks.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.urgentTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.clientName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {task.type === 'checklist' ? 'Tâche' : 'Événement'}
                      </span>
                    </div>
                  </div>
                ))}
                {analyticsData.urgentTasks.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{analyticsData.urgentTasks.length - 5} autres tâches urgentes
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Aucune tâche urgente</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Budgétaire</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 font-medium">Chiffre d'Affaires Total</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(analyticsData.budgetAnalysis.totalRevenue)}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Budget Moyen</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(analyticsData.budgetAnalysis.averageBudget)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-600 font-medium">Clients Actifs</p>
              <p className="text-2xl font-bold text-purple-900">
                {analyticsData.budgetAnalysis.budgetUtilization.length}
              </p>
            </div>
          </div>

          {/* Budget Utilization by Client */}
          {analyticsData.budgetAnalysis.budgetUtilization.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Utilisation Budget par Client</h4>
              <div className="space-y-3">
                {analyticsData.budgetAnalysis.budgetUtilization.slice(0, 8).map((client, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">{client.clientName}</span>
                        <span className={`font-medium ${
                          client.percentage > 100 ? 'text-red-600' : 
                          client.percentage > 80 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {client.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            client.percentage > 100 ? 'bg-red-500' : 
                            client.percentage > 80 ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(client.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(client.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        / {formatCurrency(client.budget)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
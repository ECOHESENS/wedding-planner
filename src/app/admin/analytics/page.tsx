'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

interface Analytics {
  overview: {
    totalUsers: number
    totalCouples: number
    userGrowth: number
    coupleGrowth: number
    usersLast30Days: number
    couplesLast30Days: number
  }
  usersByRole: Array<{ role: string; count: number }>
  couplesByStatus: Array<{ status: string; count: number }>
  budgetStats: {
    averageTotal: number
    averageSpent: number
    totalBudgets: number
    totalSpent: number
    budgetCount: number
  }
  eventStats: Array<{ status: string; count: number }>
  monthlyStats: Array<{ month: string; registrations: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500'
      case 'PLANNER': return 'bg-blue-500'
      case 'CLIENT': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-yellow-500'
      case 'READY': return 'bg-blue-500'
      case 'MARRIED': return 'bg-green-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'En préparation'
      case 'READY': return 'Prêt'
      case 'MARRIED': return 'Marié'
      case 'CANCELLED': return 'Annulé'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="text-red-800 dark:text-red-200">
          Erreur lors du chargement des analytiques: {error}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <ChartBarIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Analytiques avancées</h1>
        </div>
        <p className="text-green-100 text-lg">
          Insights détaillés sur l'utilisation et la performance de votre plateforme
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs totaux</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.totalUsers}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {analytics.overview.userGrowth >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${analytics.overview.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(analytics.overview.userGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">ce mois</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Couples inscrits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.totalCouples}</p>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/20 p-3 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {analytics.overview.coupleGrowth >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${analytics.overview.coupleGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(analytics.overview.coupleGrowth).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">ce mois</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget moyen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.budgetStats.averageTotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0
                })}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {analytics.budgetStats.budgetCount} budgets créés
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nouveaux (30j)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.usersLast30Days}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
              <CalendarDaysIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {analytics.overview.couplesLast30Days} nouveaux couples
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Répartition des utilisateurs par rôle
          </h3>
          <div className="space-y-4">
            {analytics.usersByRole.map((item) => {
              const percentage = (item.count / analytics.overview.totalUsers) * 100
              return (
                <div key={item.role} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {item.role.toLowerCase()}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getRoleColor(item.role)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Couples by Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Couples par statut
          </h3>
          <div className="space-y-4">
            {analytics.couplesByStatus.map((item) => {
              const percentage = (item.count / analytics.overview.totalCouples) * 100
              return (
                <div key={item.status} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600 dark:text-gray-400">
                    {getStatusLabel(item.status)}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Registration Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Tendances d'inscription (12 derniers mois)
        </h3>
        <div className="space-y-4">
          {analytics.monthlyStats.map((month) => {
            const maxRegistrations = Math.max(...analytics.monthlyStats.map(m => m.registrations))
            const percentage = maxRegistrations > 0 ? (month.registrations / maxRegistrations) * 100 : 0
            return (
              <div key={month.month} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">
                  {month.month}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-600"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {month.registrations}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Statistiques budget
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.budgetStats.totalBudgets.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total planifié</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.budgetStats.totalSpent.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total dépensé</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.budgetStats.averageSpent.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
              })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Dépense moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.budgetStats.budgetCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Budgets créés</div>
          </div>
        </div>
      </div>
    </div>
  )
}
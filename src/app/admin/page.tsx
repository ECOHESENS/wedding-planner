'use client'

import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
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
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
  recentCouples: Array<{
    id: string
    brideName: string
    groomName: string
    weddingDate: string
    status: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
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
      case 'ADMIN': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300'
      case 'PLANNER': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'CLIENT': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'READY': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'MARRIED': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'CANCELLED': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
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
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
        <p className="text-indigo-100">Vue d'ensemble de votre plateforme de mariage</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.overview.totalUsers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Utilisateurs totaux
              </div>
              <div className="flex items-center mt-1">
                {analytics.overview.userGrowth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  analytics.overview.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(analytics.overview.userGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.overview.totalCouples}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Couples inscrits
              </div>
              <div className="flex items-center mt-1">
                {analytics.overview.coupleGrowth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  analytics.overview.coupleGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(analytics.overview.coupleGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.budgetStats.averageTotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0
                })}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Budget moyen
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {analytics.budgetStats.budgetCount} budgets
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.overview.usersLast30Days}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Nouveaux utilisateurs (30j)
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {analytics.overview.couplesLast30Days} couples
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Utilisateurs par rôle
          </h3>
          <div className="space-y-3">
            {analytics.usersByRole.map((item) => (
              <div key={item.role} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(item.role)}`}>
                    {item.role}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Couples by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Couples par statut
          </h3>
          <div className="space-y-3">
            {analytics.couplesByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Utilisateurs récents
          </h3>
          <div className="space-y-3">
            {analytics.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Couples */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Couples récents
          </h3>
          <div className="space-y-3">
            {analytics.recentCouples.map((couple) => (
              <div key={couple.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {couple.brideName} & {couple.groomName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {couple.weddingDate && new Date(couple.weddingDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(couple.status)}`}>
                    {couple.status}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(couple.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
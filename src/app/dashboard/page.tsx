'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  UserGroupIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalEvents?: number
  totalClients?: number
  budgetUsagePercentage: number
  completedTasks: number
  totalTasks: number
  daysToWedding?: number | null
  upcomingWeddings?: number
  totalBudget: number
  totalSpent: number
  recentActivity: Array<{
    type: string
    message: string
    time: string
    color: string
  }>
}


export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  const clientFeatures = [
    {
      title: t('profile.title'),
      description: 'Créez votre profil avec vos traditions culturelles',
      href: '/dashboard/profile',
      icon: UserGroupIcon,
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      title: t('timeline.title'),
      description: 'Organisez votre timeline de mariage',
      href: '/dashboard/timeline',
      icon: CalendarDaysIcon,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: t('budget.title'),
      description: 'Suivez vos dépenses par poste',
      href: '/dashboard/budget',
      icon: CurrencyDollarIcon,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: t('checklist.title'),
      description: 'Tâches personnalisées par culture',
      href: '/dashboard/checklist',
      icon: CheckIcon,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      title: t('documents.title'),
      description: 'Gérez contrats et inspirations',
      href: '/dashboard/documents',
      icon: DocumentIcon,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      title: t('messages.title'),
      description: 'Communiquez avec votre wedding planner',
      href: '/dashboard/messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  const plannerFeatures = [
    {
      title: t('clients.title'),
      description: 'Gérez tous vos couples',
      href: '/dashboard/clients',
      icon: UserGroupIcon,
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      title: t('analytics.title'),
      description: 'Vue d\'ensemble de tous les mariages',
      href: '/dashboard/analytics',
      icon: ChartBarIcon,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: t('messages.title'),
      description: 'Communiquez avec vos clients',
      href: '/dashboard/messages',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const features = session.user.role === 'PLANNER' ? plannerFeatures : clientFeatures

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className={`bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <SparklesIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">
                {t('dashboard.welcome', { name: session.user.name })}
              </h1>
            </div>
            <p className="text-rose-100 text-lg">
              {session.user.role === 'PLANNER' 
                ? 'Gérez vos clients et créez des mariages de rêve' 
                : 'Organisez votre mariage parfait avec nos outils culturels'}
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {session.user.role === 'PLANNER' ? t('dashboard.stats.clients') : t('dashboard.stats.events')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : (session.user.role === 'PLANNER' ? stats?.totalClients : stats?.totalEvents) || 0}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.stats.budget')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : `${stats?.budgetUsagePercentage || 0}%`}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.stats.tasks')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : `${stats?.completedTasks || 0}/${stats?.totalTasks || 0}`}
                </p>
              </div>
              <CheckIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {session.user.role === 'PLANNER' ? t('dashboard.stats.upcomingWeddings') : t('dashboard.stats.daysLeft')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : (
                    session.user.role === 'PLANNER' 
                      ? stats?.upcomingWeddings || 0
                      : stats?.daysToWedding !== null && stats?.daysToWedding !== undefined 
                        ? Math.abs(stats.daysToWedding) 
                        : 'N/A'
                  )}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {feature.description}
                  </p>
                  <div className={`mt-3 text-sm font-medium text-${feature.color}-600 group-hover:text-${feature.color}-700`}>
                    {isRTL ? '← دخول' : 'Accéder →'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-theme">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.recentActivity')}</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              stats?.recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} p-3 bg-gray-50 dark:bg-gray-700 rounded-lg`}>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.color === 'green' ? 'bg-green-500' :
                    activity.color === 'blue' ? 'bg-blue-500' :
                    activity.color === 'purple' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.message}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
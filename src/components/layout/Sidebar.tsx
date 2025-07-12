'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import SettingsPanel from '@/components/ui/SettingsPanel'
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  GiftIcon,
  LightBulbIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  if (!session) return null

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: 'Planning', href: '/dashboard/planning', icon: ClipboardDocumentListIcon },
    { name: t('navigation.checklist'), href: '/dashboard/checklist', icon: CheckIcon },
    { name: t('navigation.budget'), href: '/dashboard/budget', icon: CurrencyDollarIcon },
    { name: 'Invités', href: '/dashboard/attendees', icon: UsersIcon },
    { name: 'Trousseau', href: '/dashboard/trousseau', icon: GiftIcon },
    { name: 'Journal', href: '/dashboard/journal', icon: BookOpenIcon },
    { name: 'Conseils', href: '/dashboard/advice', icon: LightBulbIcon },
    { name: t('navigation.profile'), href: '/dashboard/profile', icon: UserGroupIcon },
    { name: t('navigation.documents'), href: '/dashboard/documents', icon: DocumentIcon },
    { name: t('navigation.messages'), href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Abonnement', href: '/dashboard/subscription', icon: CreditCardIcon },
  ]

  const plannerNavigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('navigation.clients'), href: '/dashboard/clients', icon: UserGroupIcon },
    { name: t('navigation.analytics'), href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Prestataires', href: '/dashboard/vendors', icon: BuildingStorefrontIcon },
    { name: t('navigation.messages'), href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  ]

  const adminNavigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon },
    { name: t('navigation.clients'), href: '/dashboard/clients', icon: UserGroupIcon },
    { name: t('navigation.analytics'), href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: t('navigation.messages'), href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  ]

  const navItems = session.user.role === 'ADMIN' ? adminNavigation : 
                  session.user.role === 'PLANNER' ? plannerNavigation : navigation

  return (
    <>
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isRTL ? 'right-0' : 'left-0'}
        fixed top-0 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 ease-in-out z-40 flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/dashboard" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${isCollapsed ? 'justify-center' : ''}`}>
            <HeartIcon className="h-8 w-8 text-rose-600 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Wedding Planner
              </span>
            )}
          </Link>
          
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isCollapsed ? 'ml-0' : ''}`}
          >
            {isCollapsed ? (
              isRTL ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />
            ) : (
              isRTL ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md'
                  }
                  ${isCollapsed ? 'justify-center' : isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                
                {/* Active indicator for collapsed state */}
                {isCollapsed && isActive && (
                  <div className={`
                    absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2
                    w-1 h-6 bg-white rounded-full
                  `} />
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className={`
                    absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2
                    px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg
                    opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    whitespace-nowrap z-50 shadow-lg
                  `}>
                    {item.name}
                    <div className={`
                      absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-full border-l-gray-900 dark:border-l-gray-700' : 'right-full border-r-gray-900 dark:border-r-gray-700'}
                      border-4 border-transparent
                    `} />
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {!isCollapsed && (
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.role === 'PLANNER' ? t('auth.planner') : t('auth.client')}
                </p>
              </div>
            </div>
          )}

          <div className={`flex ${isCollapsed ? 'flex-col space-y-1' : 'flex-col space-y-1'}`}>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`
                flex items-center px-3 py-2.5 rounded-lg text-sm font-medium 
                text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center' : isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}
              `}
              title={isCollapsed ? t('navigation.settings') : undefined}
            >
              <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{t('navigation.settings')}</span>}
              
              {isCollapsed && (
                <div className={`
                  absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2
                  px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  whitespace-nowrap z-50
                `}>
                  {t('navigation.settings')}
                </div>
              )}
            </button>

            <button
              onClick={() => signOut()}
              className={`
                flex items-center px-3 py-2.5 rounded-lg text-sm font-medium 
                text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500
                transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center' : isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}
              `}
              title={isCollapsed ? t('auth.signOut') : undefined}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{t('auth.signOut')}</span>}
              
              {isCollapsed && (
                <div className={`
                  absolute ${isRTL ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2
                  px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  whitespace-nowrap z-50
                `}>
                  {t('auth.signOut')}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
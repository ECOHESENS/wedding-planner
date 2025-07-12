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
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  if (!session) return null

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('navigation.profile'), href: '/dashboard/profile', icon: UserGroupIcon },
    { name: t('navigation.timeline'), href: '/dashboard/timeline', icon: CalendarDaysIcon },
    { name: t('navigation.budget'), href: '/dashboard/budget', icon: CurrencyDollarIcon },
    { name: t('navigation.checklist'), href: '/dashboard/checklist', icon: CheckIcon },
    { name: t('navigation.documents'), href: '/dashboard/documents', icon: DocumentIcon },
    { name: t('navigation.messages'), href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  ]

  const plannerNavigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('navigation.clients'), href: '/dashboard/clients', icon: UserGroupIcon },
    { name: t('navigation.analytics'), href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: t('navigation.messages'), href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  ]

  const navItems = session.user.role === 'PLANNER' ? plannerNavigation : navigation

  return (
    <>
      <nav className={`bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-theme ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <HeartIcon className="h-8 w-8 text-rose-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Wedding Planner</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-white font-medium">{session.user.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {session.user.role === 'PLANNER' ? t('auth.planner') : t('auth.client')}
                  </p>
                </div>
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSettingsOpen(true)}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                title={t('navigation.settings')}
              >
                <Cog6ToothIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{t('navigation.settings')}</span>
              </button>

              <button
                onClick={() => signOut()}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="hidden md:inline">{t('auth.signOut')}</span>
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{session.user.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {session.user.role === 'PLANNER' ? t('auth.planner') : t('auth.client')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslations } from '@/hooks/useTranslations'
import { 
  SunIcon,
  MoonIcon,
  LanguageIcon,
  Cog6ToothIcon,
  XMarkIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, isRTL } = useLanguage()
  const { t } = useTranslations()
  const [activeTab, setActiveTab] = useState('appearance')

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ] as const

  const tabs = [
    { id: 'appearance', name: 'Apparence', icon: PaintBrushIcon },
    { id: 'language', name: 'Langue', icon: GlobeAltIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Confidentialité', icon: ShieldCheckIcon },
    { id: 'account', name: 'Compte', icon: UserIcon }
  ]

  if (!isOpen) return null

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thème</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  {theme === 'light' ? (
                    <SunIcon className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <MoonIcon className="h-6 w-6 text-blue-500" />
                  )}
                  <span className="text-gray-900 dark:text-white">
                    {theme === 'light' ? 'Mode clair' : 'Mode sombre'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )

      case 'language':
        return (
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Langue</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      language === lang.code
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span className="text-2xl">{lang.flag}</span>
                      <span className={`font-medium ${
                        language === lang.code
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.code && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* RTL Notice */}
            {language === 'ar' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <LanguageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    تم تفعيل الكتابة من اليمين إلى اليسار
                  </p>
                </div>
              </div>
            )}
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notifications email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir des emails pour les mises à jour importantes</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Notifications push</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir des notifications sur l'appareil</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confidentialité</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Données personnelles</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Gérez vos données personnelles et préférences de confidentialité</p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Gérer les données →
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Cookies</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Préférences des cookies et suivi</p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Paramètres cookies →
                </button>
              </div>
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compte</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Informations du compte</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Modifier votre profil et informations personnelles</p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Modifier le profil →
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white mb-2">Sécurité</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Changer le mot de passe et paramètres de sécurité</p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Paramètres sécurité →
                </button>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-medium text-red-900 dark:text-red-300 mb-2">Zone de danger</p>
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">Supprimer définitivement votre compte</p>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <Cog6ToothIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('navigation.settings')}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-96">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
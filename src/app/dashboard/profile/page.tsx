'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  UserGroupIcon, 
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckIcon,
  SparklesIcon,
  CreditCardIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { useTrialStatus } from '@/hooks/useTrialStatus'
import { TrialCountdown } from '@/components/trial/TrialComponents'
import { PRICING_TIERS, Subscription } from '@/types/payment'

const cultures = [
  { 
    value: 'MOROCCAN', 
    label: 'Marocaine', 
    flag: '🇲🇦',
    color: 'bg-red-500',
    description: 'Traditions marocaines authentiques'
  },
  { 
    value: 'TUNISIAN', 
    label: 'Tunisienne', 
    flag: '🇹🇳',
    color: 'bg-red-600',
    description: 'Héritage tunisien traditionnel'
  },
  { 
    value: 'ALGERIAN', 
    label: 'Algérienne', 
    flag: '🇩🇿',
    color: 'bg-green-600',
    description: 'Coutumes algériennes ancestrales'
  },
  { 
    value: 'FRENCH', 
    label: 'Française', 
    flag: '🇫🇷',
    color: 'bg-blue-600',
    description: 'Mariage à la française'
  },
  { 
    value: 'SPANISH', 
    label: 'Espagnole', 
    flag: '🇪🇸',
    color: 'bg-yellow-600',
    description: 'Traditions espagnoles'
  },
  { 
    value: 'ITALIAN', 
    label: 'Italienne', 
    flag: '🇮🇹',
    color: 'bg-green-700',
    description: 'Traditions italiennes'
  },
  { 
    value: 'TURKISH', 
    label: 'Turque', 
    flag: '🇹🇷',
    color: 'bg-red-700',
    description: 'Traditions turques'
  },
  { 
    value: 'LEBANESE', 
    label: 'Libanaise', 
    flag: '🇱🇧',
    color: 'bg-red-500',
    description: 'Traditions libanaises'
  },
  { 
    value: 'MIXED', 
    label: 'Mixte', 
    flag: '🌍',
    color: 'bg-purple-600',
    description: 'Mélange de traditions'
  }
]

interface CoupleData {
  id?: string
  brideName: string
  groomName: string
  groomEmail: string
  brideOrigin: string
  groomOrigin: string
  brideSecondaryOrigin?: string
  groomSecondaryOrigin?: string
  brideNationality: string
  groomNationality: string
  brideSecondaryNationality?: string
  groomSecondaryNationality?: string
  culture: string
  secondaryCulture: string
  weddingDate: string
  estimatedGuests: string
  totalBudget: string
  phone: string
  address: string
  notes: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const trialStatus = useTrialStatus()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile')
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState<CoupleData>({
    brideName: '',
    groomName: '',
    groomEmail: '',
    brideOrigin: '',
    groomOrigin: '',
    brideSecondaryOrigin: '',
    groomSecondaryOrigin: '',
    brideNationality: '',
    groomNationality: '',
    brideSecondaryNationality: '',
    groomSecondaryNationality: '',
    culture: 'MOROCCAN',
    secondaryCulture: '',
    weddingDate: '',
    estimatedGuests: '',
    totalBudget: '',
    phone: '',
    address: '',
    notes: ''
  })
  const [showMultipleOrigins, setShowMultipleOrigins] = useState(false)
  const [showMultipleNationalities, setShowMultipleNationalities] = useState(false)

  useEffect(() => {
    fetchCoupleData()
    if (session) {
      fetchSubscription()
    }
  }, [session])

  const fetchCoupleData = async () => {
    try {
      const response = await fetch('/api/couples')
      if (response.ok) {
        const couple = await response.json()
        if (couple) {
          setFormData({
            id: couple.id,
            brideName: couple.brideName || '',
            groomName: couple.groomName || '',
            groomEmail: couple.groom?.email || '',
            brideOrigin: couple.brideOrigin || '',
            groomOrigin: couple.groomOrigin || '',
            brideNationality: couple.brideNationality || '',
            groomNationality: couple.groomNationality || '',
            culture: couple.culture || 'MOROCCAN',
            secondaryCulture: couple.secondaryCulture || '',
            weddingDate: couple.weddingDate ? new Date(couple.weddingDate).toISOString().split('T')[0] : '',
            estimatedGuests: couple.estimatedGuests?.toString() || '',
            totalBudget: couple.totalBudget?.toString() || '',
            phone: couple.phone || '',
            address: couple.address || '',
            notes: couple.notes || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching couple data:', error)
    }
  }

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/couples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving couple data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateProfileCompletion = () => {
    const requiredFields = ['brideName', 'groomName', 'culture', 'weddingDate']
    const optionalFields = [
      'groomEmail', 'brideOrigin', 'groomOrigin', 'brideNationality', 
      'groomNationality', 'phone', 'address', 'estimatedGuests', 'totalBudget'
    ]
    
    const requiredCompleted = requiredFields.filter(field => formData[field as keyof CoupleData]).length
    const optionalCompleted = optionalFields.filter(field => formData[field as keyof CoupleData]).length
    
    const requiredPercentage = (requiredCompleted / requiredFields.length) * 70
    const optionalPercentage = (optionalCompleted / optionalFields.length) * 30
    
    return Math.round(requiredPercentage + optionalPercentage)
  }

  const getMissingFields = () => {
    const fieldNames: Record<string, string> = {
      brideName: 'Nom de la mariée',
      groomName: 'Nom du marié',
      culture: 'Culture principale',
      weddingDate: 'Date du mariage',
      groomEmail: 'Email du marié',
      brideOrigin: 'Origine de la mariée',
      groomOrigin: 'Origine du marié',
      brideNationality: 'Nationalité de la mariée',
      groomNationality: 'Nationalité du marié',
      phone: 'Téléphone',
      address: 'Adresse',
      estimatedGuests: 'Nombre d\'invités',
      totalBudget: 'Budget total'
    }
    
    return Object.entries(fieldNames)
      .filter(([field]) => !formData[field as keyof CoupleData])
      .map(([, name]) => name)
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with profile completion indicator */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold">Notre profil mariés</h1>
                  <p className="text-rose-100 mt-1">
                    🌍 Créez votre profil personnalisé avec vos traditions culturelles
                  </p>
                </div>
              </div>
              {/* Profile completion indicator */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-medium">Profil complété à</p>
                <p className="text-2xl font-bold">{calculateProfileCompletion()}%</p>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 text-white opacity-20 text-4xl">💕</div>
        </div>

        {/* Trial Status */}
        <TrialCountdown />

        {/* Success Message & Profile Completion Alert */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center space-x-3">
            <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-300">✅ Profil sauvegardé avec succès!</p>
          </div>
        )}
        
        {calculateProfileCompletion() < 100 && activeTab === 'profile' && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SparklesIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 dark:text-amber-300 font-medium">Complétez votre profil pour une meilleure expérience</p>
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">Les champs manquants: {getMissingFields().join(', ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'profile'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <UserGroupIcon className="h-4 w-4" />
              <span>👫 Profil du couple</span>
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'subscription'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>💳 Abonnement & Essai</span>
              {trialStatus.isTrialing && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  J-{trialStatus.daysRemaining}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <HeartIcon className="h-6 w-6 text-rose-500 dark:text-rose-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">❤️ Informations de base</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  👰 Nom de la mariée
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Prénom et nom de famille"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🤵 Nom du marié
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Prénom et nom de famille"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email du marié (optionnel)
                </label>
                <input
                  type="email"
                  name="groomEmail"
                  value={formData.groomEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <PhoneIcon className="inline h-4 w-4 mr-1" />
                  📱 Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              {/* Origins Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🌍 Origines
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMultipleOrigins(!showMultipleOrigins)}
                    className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
                  >
                    {showMultipleOrigins ? 'Masquer les origines multiples' : '+ Ajouter des origines multiples'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Origine principale de la mariée
                    </label>
                    <input
                      type="text"
                      name="brideOrigin"
                      value={formData.brideOrigin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Ville, Région d'origine"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Origine principale du marié
                    </label>
                    <input
                      type="text"
                      name="groomOrigin"
                      value={formData.groomOrigin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Ville, Région d'origine"
                    />
                  </div>
                </div>
                
                {showMultipleOrigins && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Origine secondaire de la mariée
                      </label>
                      <input
                        type="text"
                        name="brideSecondaryOrigin"
                        value={formData.brideSecondaryOrigin || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Autre origine (optionnel)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Origine secondaire du marié
                      </label>
                      <input
                        type="text"
                        name="groomSecondaryOrigin"
                        value={formData.groomSecondaryOrigin || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Autre origine (optionnel)"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Nationalities Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🇫🇷 Nationalités
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMultipleNationalities(!showMultipleNationalities)}
                    className="text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
                  >
                    {showMultipleNationalities ? 'Masquer les nationalités multiples' : '+ Ajouter des nationalités multiples'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Nationalité principale de la mariée
                    </label>
                    <input
                      type="text"
                      name="brideNationality"
                      value={formData.brideNationality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Française, Marocaine, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Nationalité principale du marié
                    </label>
                    <input
                      type="text"
                      name="groomNationality"
                      value={formData.groomNationality}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Française, Tunisienne, etc."
                    />
                  </div>
                </div>
                
                {showMultipleNationalities && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Nationalité secondaire de la mariée
                      </label>
                      <input
                        type="text"
                        name="brideSecondaryNationality"
                        value={formData.brideSecondaryNationality || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Autre nationalité (optionnel)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Nationalité secondaire du marié
                      </label>
                      <input
                        type="text"
                        name="groomSecondaryNationality"
                        value={formData.groomSecondaryNationality || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                        placeholder="Autre nationalité (optionnel)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPinIcon className="inline h-4 w-4 mr-1" />
                📍 Adresse actuelle
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Ville, Région, Pays de résidence"
              />
            </div>
          </div>

          {/* Cultural Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <SparklesIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🌟 Préférences Culturelles</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎭 Culture principale
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {cultures.map((culture) => (
                    <label
                      key={culture.value}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.culture === culture.value
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="culture"
                        value={culture.value}
                        checked={formData.culture === culture.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-3xl mb-2">{culture.flag}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{culture.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                        {culture.description}
                      </div>
                      {formData.culture === culture.value && (
                        <CheckIcon className="absolute top-2 right-2 h-5 w-5 text-rose-500" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎭 Culture secondaire (optionnel)
                </label>
                <select
                  name="secondaryCulture"
                  value={formData.secondaryCulture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Aucune culture secondaire</option>
                  {cultures.map((culture) => (
                    <option key={culture.value} value={culture.value}>
                      {culture.flag} {culture.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Wedding Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <CalendarDaysIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">💒 Détails du Mariage</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarDaysIcon className="inline h-4 w-4 mr-1" />
                  📅 Date du mariage
                </label>
                <input
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UsersIcon className="inline h-4 w-4 mr-1" />
                  👥 Nombre d'invités estimé
                </label>
                <input
                  type="number"
                  name="estimatedGuests"
                  value={formData.estimatedGuests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="200"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  💰 Budget total (€)
                </label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="25000"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-orange-500 dark:text-orange-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">📝 Notes et Souhaits</h2>
            </div>
            
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="💭 Partagez vos souhaits, traditions spécifiques, ou toute information importante pour votre mariage..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
            >
              {loading ? '⏳ Sauvegarde...' : '💾 Sauvegarder le profil'}
            </button>
          </div>
        </form>
        ) : (
          /* Subscription Tab */
          <div className="space-y-6">
            {/* Trial Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CogIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ⏰ Statut de votre essai gratuit
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Jours restants</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                    {trialStatus.daysRemaining}
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Statut</p>
                  </div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100 mt-1">
                    {trialStatus.trialExpired ? '❌ Expiré' : 
                     trialStatus.isTrialing ? '🔄 En cours' : 
                     trialStatus.hasActiveSubscription ? '✅ Abonné' : '⏳ Attente'}
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Fin d'essai</p>
                  </div>
                  <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mt-1">
                    {trialStatus.trialEndDate ? 
                      new Date(trialStatus.trialEndDate).toLocaleDateString('fr-FR') 
                      : 'Non défini'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trial Features */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📋 Fonctionnalités de l'essai gratuit (15 jours)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700 dark:text-green-300">✅ Inclus pendant l'essai:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Planning personnalisé</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Budget basique</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Checklist interactive</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Journal de préparation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Gestion des invités</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-orange-700 dark:text-orange-300">⏳ Disponible après l'essai:</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                      <span>Export des données</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                      <span>Analyses avancées</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                      <span>Templates premium</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                      <span>Opérations en masse</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current Subscription */}
            {currentSubscription && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Abonnement actuel
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-indigo-600">
                      {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Période: {new Date(currentSubscription.currentPeriodStart).toLocaleDateString('fr-FR')} - {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.price}€
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.billingCycle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💳 Gestion de l'abonnement
              </h3>
              
              <div className="space-y-4">
                {trialStatus.trialExpired && !trialStatus.hasActiveSubscription && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      ⚠️ Votre essai gratuit a expiré
                    </p>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                      Souscrivez à un abonnement pour continuer à utiliser toutes les fonctionnalités.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/dashboard/subscription"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 text-center"
                  >
                    {trialStatus.hasActiveSubscription ? '📊 Gérer mon abonnement' : '🚀 Choisir un plan'}
                  </a>
                  
                  {trialStatus.hasActiveSubscription && (
                    <a
                      href="/dashboard/subscription?tab=billing"
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-center"
                    >
                      📄 Voir les factures
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Trial Restrictions */}
            {trialStatus.restrictions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔒 Restrictions actuelles
                </h3>
                <div className="space-y-2">
                  {trialStatus.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>{restriction.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
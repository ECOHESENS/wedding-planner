'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  LightBulbIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { AdviceItem, ADVICE_CATEGORIES, ADVICE_TYPES, SAMPLE_ADVICE } from '@/types/advice'
import AdviceCard from '@/components/advice/AdviceCard'
import AdviceFilters from '@/components/advice/AdviceFilters'
import FeaturedAdvice from '@/components/advice/FeaturedAdvice'

export default function AdvicePage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [advice, setAdvice] = useState<AdviceItem[]>(SAMPLE_ADVICE)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCulture, setSelectedCulture] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'likes'>('popular')

  const filteredAdvice = advice.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesType = selectedType === 'all' || item.type === selectedType
    const matchesCulture = selectedCulture === 'all' || item.culture === selectedCulture || !item.culture
    
    return matchesSearch && matchesCategory && matchesType && matchesCulture
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return Number(b.isPopular) - Number(a.isPopular)
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'likes':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const featuredAdvice = advice.filter(item => item.isPopular).slice(0, 3)
  const cultureStats = {
    moroccan: advice.filter(item => item.culture === 'moroccan').length,
    tunisian: advice.filter(item => item.culture === 'tunisian').length,
    algerian: advice.filter(item => item.culture === 'algerian').length,
    general: advice.filter(item => !item.culture || item.culture === 'general').length
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <LightBulbIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Tips de wedding planner</h1>
            </div>
            <p className="text-amber-100 text-lg">
              Découvrez tous nos conseils d'experts pour organiser votre mariage parfait
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conseils</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{advice.length}</p>
              </div>
              <LightBulbIcon className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Traditions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {cultureStats.moroccan + cultureStats.tunisian + cultureStats.algerian}
                </p>
              </div>
              <HeartIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Populaires</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredAdvice.length}</p>
              </div>
              <StarIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Catégories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(ADVICE_CATEGORIES).length}
                </p>
              </div>
              <TagIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Featured Advice */}
        {featuredAdvice.length > 0 && (
          <FeaturedAdvice advice={featuredAdvice} />
        )}

        {/* Filters */}
        <AdviceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCulture={selectedCulture}
          onCultureChange={setSelectedCulture}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredAdvice.length}
        />

        {/* Advice Grid */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des conseils...</span>
            </div>
          </div>
        ) : filteredAdvice.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
            <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun conseil trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Essayez de modifier vos filtres pour trouver les conseils que vous cherchez.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedType('all')
                setSelectedCulture('all')
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvice.map((adviceItem) => (
              <AdviceCard
                key={adviceItem.id}
                advice={adviceItem}
                onLike={(id) => {
                  setAdvice(prev => prev.map(item => 
                    item.id === id 
                      ? { ...item, likes: item.likes + 1 }
                      : item
                  ))
                }}
              />
            ))}
          </div>
        )}

        {/* Cultural Tips Section */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800">
          <div className="flex items-start space-x-4">
            <HeartIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-3">
                Traditions du Maghreb
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-800 dark:text-red-400">
                <div>
                  <h4 className="font-semibold mb-2">🇲🇦 Maroc ({cultureStats.moroccan} conseils)</h4>
                  <p>Découvrez les traditions du mariage marocain : henné, takchita, musique chaâbi...</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🇹🇳 Tunisie ({cultureStats.tunisian} conseils)</h4>
                  <p>Explorez les coutumes tunisiennes : malouf, keswa, traditions familiiales...</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🇩🇿 Algérie ({cultureStats.algerian} conseils)</h4>
                  <p>Apprenez les traditions algériennes : raï, tenues berbères, cérémonies...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
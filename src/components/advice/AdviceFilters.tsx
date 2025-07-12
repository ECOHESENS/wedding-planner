'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { ADVICE_CATEGORIES, ADVICE_TYPES } from '@/types/advice'

interface AdviceFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  selectedCulture: string
  onCultureChange: (culture: string) => void
  sortBy: 'popular' | 'recent' | 'likes'
  onSortChange: (sort: 'popular' | 'recent' | 'likes') => void
  resultCount: number
  className?: string
}

export default function AdviceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  selectedCulture,
  onCultureChange,
  sortBy,
  onSortChange,
  resultCount,
  className = ''
}: AdviceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const cultures = [
    { id: 'all', label: 'Toutes cultures', icon: '🌍' },
    { id: 'moroccan', label: 'Maroc', icon: '🇲🇦' },
    { id: 'tunisian', label: 'Tunisie', icon: '🇹🇳' },
    { id: 'algerian', label: 'Algérie', icon: '🇩🇿' },
    { id: 'general', label: 'Général', icon: '🌍' }
  ]

  const sortOptions = [
    { id: 'popular', label: 'Plus populaires', icon: '⭐' },
    { id: 'recent', label: 'Plus récents', icon: '🕐' },
    { id: 'likes', label: 'Plus aimés', icon: '❤️' }
  ]

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || selectedCulture !== 'all' || searchTerm !== ''

  const clearAllFilters = () => {
    onSearchChange('')
    onCategoryChange('all')
    onTypeChange('all')
    onCultureChange('all')
    onSortChange('popular')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher dans les conseils..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
            hasActiveFilters
              ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
              {[selectedCategory !== 'all', selectedType !== 'all', selectedCulture !== 'all', searchTerm !== ''].filter(Boolean).length}
            </span>
          )}
          {showFilters ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {resultCount} conseil{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
        </p>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Effacer tout</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                {Object.entries(ADVICE_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les types</option>
                {Object.entries(ADVICE_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Culture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Culture
              </label>
              <select
                value={selectedCulture}
                onChange={(e) => onCultureChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {cultures.map((culture) => (
                  <option key={culture.id} value={culture.id}>
                    {culture.icon} {culture.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as 'popular' | 'recent' | 'likes')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filtres rapides
              </h4>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Popular categories */}
              {[
                { key: 'traditions_moroccan', label: '🇲🇦 Traditions marocaines' },
                { key: 'budget_tips', label: '💰 Budget' },
                { key: 'ceremonies', label: '💒 Cérémonies' },
                { key: 'planning_timeline', label: '📅 Planification' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => onCategoryChange(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === filter.key
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              
              {/* Popular types */}
              {[
                { key: 'tradition', label: '🏺 Traditions' },
                { key: 'tip', label: '💡 Conseils' },
                { key: 'cultural', label: '🌍 Culturel' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => onTypeChange(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedType === filter.key
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
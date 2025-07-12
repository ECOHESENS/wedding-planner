'use client'

import { useState } from 'react'
import { 
  PlusIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { TROUSSEAU_CATEGORIES, TROUSSEAU_SUGGESTIONS } from '@/types/trousseau'

interface TrousseauSuggestionsProps {
  onAddSuggestion: (suggestion: string, category: string) => Promise<void>
}

export default function TrousseauSuggestions({ onAddSuggestion }: TrousseauSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())

  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(TROUSSEAU_SUGGESTIONS)
    : [[selectedCategory, TROUSSEAU_SUGGESTIONS[selectedCategory as keyof typeof TROUSSEAU_SUGGESTIONS]]]

  const filterSuggestions = (suggestions: string[]) => {
    if (!searchTerm) return suggestions
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Idées pour votre trousseau
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez des suggestions d'articles pour votre nouvelle vie de couple
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Toutes les catégories</option>
              {Object.entries(TROUSSEAU_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map(([categoryKey, suggestions]) => {
          const category = TROUSSEAU_CATEGORIES[categoryKey as keyof typeof TROUSSEAU_CATEGORIES]
          const filteredItems = filterSuggestions(suggestions)
          
          if (filteredItems.length === 0 && searchTerm) return null

          return (
            <div
              key={categoryKey}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{category.label}</h3>
                    <p className="text-sm opacity-90">
                      {filteredItems.length} article{filteredItems.length !== 1 ? 's' : ''} suggéré{filteredItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {filteredItems.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {suggestion}
                      </span>
                      <button
                        onClick={async () => {
                          const itemKey = `${categoryKey}-${suggestion}`
                          setAddingItems(prev => new Set([...prev, itemKey]))
                          
                          try {
                            await onAddSuggestion(suggestion, categoryKey)
                            setTimeout(() => {
                              setAddingItems(prev => {
                                const newSet = new Set(prev)
                                newSet.delete(itemKey)
                                return newSet
                              })
                            }, 1000)
                          } catch (error) {
                            setAddingItems(prev => {
                              const newSet = new Set(prev)
                              newSet.delete(itemKey)
                              return newSet
                            })
                          }
                        }}
                        disabled={addingItems.has(`${categoryKey}-${suggestion}`)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          addingItems.has(`${categoryKey}-${suggestion}`)
                            ? 'bg-green-600 text-white cursor-default'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {addingItems.has(`${categoryKey}-${suggestion}`) ? (
                          <>
                            <CheckIcon className="h-3 w-3" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-3 w-3" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
        <div className="flex items-start space-x-4">
          <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3">
              Conseils pour constituer votre trousseau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800 dark:text-purple-400">
              <div className="space-y-2">
                <p>
                  <strong>Commencez par l'essentiel:</strong> Priorisez les articles dont vous aurez besoin immédiatement.
                </p>
                <p>
                  <strong>Fixez un budget:</strong> Établissez une fourchette de prix pour chaque catégorie.
                </p>
                <p>
                  <strong>Pensez qualité:</strong> Investissez dans des articles durables pour votre quotidien.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Traditions familiales:</strong> N'oubliez pas les articles traditionnels importants pour votre culture.
                </p>
                <p>
                  <strong>Liste de mariage:</strong> Certains articles peuvent être suggérés comme cadeaux.
                </p>
                <p>
                  <strong>Organisez-vous:</strong> Utilisez cette liste pour suivre vos achats et éviter les doublons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800">
        <div className="flex items-start space-x-4">
          <HeartIcon className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-3">
              Traditions du trousseau
            </h3>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-400">
              <p>
                <strong>Tradition marocaine:</strong> Le trousseau inclut souvent des tapis berbères, 
                des plateaux en cuivre, de la lingerie fine et des parfums traditionnels.
              </p>
              <p>
                <strong>Tradition tunisienne:</strong> Les draps brodés, les couvertures en laine, 
                et les bijoux en or font partie des essentiels du trousseau.
              </p>
              <p>
                <strong>Tradition algérienne:</strong> Les ustensiles de cuisine traditionnels, 
                les tissus brodés et les articles en argent sont très appréciés.
              </p>
              <p>
                <strong>Conseil:</strong> Mélangez tradition et modernité selon vos goûts et votre mode de vie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
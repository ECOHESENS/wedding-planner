'use client'

import { useState } from 'react'
import { 
  PlusIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { BUDGET_CATEGORIES, BUDGET_SUGGESTIONS } from '@/types/budget'

interface BudgetSuggestion {
  name: string
  description: string
  estimatedAmount: number
  isRequired: boolean
}

interface BudgetSuggestionsProps {
  onAddSuggestion: (suggestion: BudgetSuggestion, category: string) => Promise<void>
}

export default function BudgetSuggestions({ onAddSuggestion }: BudgetSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())

  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(BUDGET_SUGGESTIONS)
    : [[selectedCategory, BUDGET_SUGGESTIONS[selectedCategory as keyof typeof BUDGET_SUGGESTIONS]]]

  const filterSuggestions = (suggestions: BudgetSuggestion[]) => {
    if (!searchTerm) return suggestions
    return suggestions.filter(suggestion => 
      suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const handleAddSuggestion = async (suggestion: BudgetSuggestion, categoryKey: string) => {
    const itemKey = `${categoryKey}-${suggestion.name}`
    setAddedItems(prev => new Set([...prev, itemKey]))
    
    try {
      await onAddSuggestion(suggestion, categoryKey)
      
      // Remove from added items after 2 seconds to allow re-adding
      setTimeout(() => {
        setAddedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemKey)
          return newSet
        })
      }, 2000)
    } catch (error) {
      // Remove from added items immediately if there was an error
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }
  }

  const isItemAdded = (suggestion: BudgetSuggestion, categoryKey: string) => {
    return addedItems.has(`${categoryKey}-${suggestion.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Suggestions de budget
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Ajoutez rapidement les éléments essentiels à votre budget avec des estimations réalistes
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Toutes les catégories</option>
              {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => (
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
              placeholder="Rechercher un élément..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCategories.map(([categoryKey, suggestions]) => {
          const category = BUDGET_CATEGORIES[categoryKey as keyof typeof BUDGET_CATEGORIES]
          const filteredItems = filterSuggestions(suggestions)
          
          if (filteredItems.length === 0 && searchTerm) return null

          const categoryTotal = filteredItems.reduce((sum, item) => sum + item.estimatedAmount, 0)
          const essentialItems = filteredItems.filter(item => item.isRequired)

          return (
            <div
              key={categoryKey}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{category.label}</h3>
                      <p className="text-sm opacity-90">
                        {filteredItems.length} élément{filteredItems.length !== 1 ? 's' : ''} • 
                        Budget moyen: {category.typical}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{categoryTotal.toLocaleString()}€</div>
                    <div className="text-sm opacity-90">{essentialItems.length} essentiel{essentialItems.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="p-6">
                <div className="space-y-3">
                  {filteredItems.map((suggestion, index) => {
                    const isAdded = isItemAdded(suggestion, categoryKey)
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isAdded 
                            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {suggestion.name}
                            </h4>
                            {suggestion.isRequired && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                Essentiel
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <CurrencyDollarIcon className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-600">
                              {suggestion.estimatedAmount.toLocaleString()}€
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddSuggestion(suggestion, categoryKey)}
                          disabled={isAdded}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isAdded
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4" />
                              <span>Ajouté</span>
                            </>
                          ) : (
                            <>
                              <PlusIcon className="h-4 w-4" />
                              <span>Ajouter</span>
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
        <div className="flex items-start space-x-4">
          <LightBulbIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-3">
              Conseils pour votre budget mariage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800 dark:text-emerald-400">
              <div className="space-y-2">
                <p>
                  <strong>Règle des 50/30/20:</strong> 50% pour le lieu et traiteur, 30% pour le reste, 20% d'urgence.
                </p>
                <p>
                  <strong>Négociation:</strong> N'hésitez pas à négocier avec les prestataires, surtout en basse saison.
                </p>
                <p>
                  <strong>Priorités:</strong> Définissez vos priorités absolues avant de commencer les achats.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Comparaison:</strong> Demandez au moins 3 devis pour chaque prestataire important.
                </p>
                <p>
                  <strong>Urgences:</strong> Gardez toujours 10-15% de votre budget pour les imprévus.
                </p>
                <p>
                  <strong>Paiements:</strong> Étalez les paiements dans le temps pour mieux gérer votre trésorerie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { BudgetItem, BUDGET_CATEGORIES, BUDGET_SUGGESTIONS, BUDGET_STATUS } from '@/types/budget'
import BudgetStats from '@/components/budget/BudgetStats'
import BudgetTable from '@/components/budget/BudgetTable'
import BudgetSuggestions from '@/components/budget/BudgetSuggestions'
import { TrialWarning, TrialCountdown } from '@/components/trial/TrialComponents'

export default function BudgetPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBudget, setTotalBudget] = useState(15000) // Default budget
  const [viewMode, setViewMode] = useState<'table' | 'suggestions'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (session) {
      fetchBudgetItems()
    }
  }, [session])

  const fetchBudgetItems = async () => {
    try {
      const response = await fetch('/api/budget')
      if (response.ok) {
        const data = await response.json()
        setBudgetItems(data.items || [])
        setTotalBudget(data.totalBudget || 15000)
      }
    } catch (error) {
      console.error('Error fetching budget items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (itemData: Omit<BudgetItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setBudgetItems(prev => [...prev, newItem])
      }
    } catch (error) {
      console.error('Error adding budget item:', error)
    }
  }

  const handleUpdateItem = async (itemData: BudgetItem) => {
    try {
      const response = await fetch(`/api/budget/${itemData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (response.ok) {
        const updatedItem = await response.json()
        setBudgetItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
      }
    } catch (error) {
      console.error('Error updating budget item:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/budget/${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setBudgetItems(prev => prev.filter(item => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error deleting budget item:', error)
    }
  }

  const handleAddSuggestion = async (suggestion: { name: string; description: string; estimatedAmount: number; isRequired: boolean }, category: string) => {
    try {
      const quickItem = {
        title: suggestion.name,
        category: category,
        estimatedCost: suggestion.estimatedAmount,
        actualCost: null,
        paidAmount: null,
        vendor: null,
        notes: suggestion.description,
        isPaid: false
      }
      
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quickItem),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setBudgetItems(prev => [...prev, newItem])
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert('Erreur lors de l\'ajout de l\'élément. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error adding budget suggestion:', error)
      alert('Erreur lors de l\'ajout de l\'élément. Veuillez réessayer.')
    }
  }

  const handleUpdateBudget = async (newBudget: number) => {
    try {
      const response = await fetch('/api/budget/total', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalBudget: newBudget }),
      })
      
      if (response.ok) {
        setTotalBudget(newBudget)
      }
    } catch (error) {
      console.error('Error updating total budget:', error)
    }
  }

  const filteredItems = budgetItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <CurrencyDollarIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Budget de mon mariage</h1>
            </div>
            <p className="text-emerald-100 text-lg">
              Gérez votre budget avec une vue d'ensemble claire et des modifications en temps réel
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Trial Status */}
        <TrialCountdown />

        {/* Stats */}
        <BudgetStats 
          budgetItems={budgetItems} 
          totalBudget={totalBudget}
          onUpdateBudget={handleUpdateBudget}
        />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <ChartBarIcon className="h-4 w-4 inline mr-2" />
              Budget ({budgetItems.length})
            </button>
            <button
              onClick={() => setViewMode('suggestions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'suggestions'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <LightBulbIcon className="h-4 w-4 inline mr-2" />
              Suggestions
            </button>
          </div>
        </div>

        {viewMode === 'suggestions' ? (
          <BudgetSuggestions onAddSuggestion={handleAddSuggestion} />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans le budget..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Toutes les catégories</option>
                  {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.label}</option>
                  ))}
                </select>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {filteredItems.length} élément{filteredItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Table */}
            <TrialWarning feature="budget_add">
              <BudgetTable
                budgetItems={filteredItems}
                loading={loading}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
              />
            </TrialWarning>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
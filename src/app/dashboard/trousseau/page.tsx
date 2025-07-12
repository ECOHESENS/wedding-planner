'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  GiftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { TrousseauItem, TROUSSEAU_CATEGORIES, PRIORITY_LEVELS, TROUSSEAU_SUGGESTIONS } from '@/types/trousseau'
import TrousseauStats from '@/components/trousseau/TrousseauStats'
import TrousseauItemCard from '@/components/trousseau/TrousseauItemCard'
import AddTrousseauModal from '@/components/trousseau/AddTrousseauModal'
import TrousseauSuggestions from '@/components/trousseau/TrousseauSuggestions'
import { TrialWarning, TrialCountdown } from '@/components/trial/TrialComponents'

export default function TrousseauPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [items, setItems] = useState<TrousseauItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [showPurchased, setShowPurchased] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<TrousseauItem | null>(null)
  const [viewMode, setViewMode] = useState<'items' | 'suggestions' | 'excel'>('items')
  const [sectionFilter, setSectionFilter] = useState<'all' | 'mariee' | 'mari' | 'mariage'>('all')

  useEffect(() => {
    if (session) {
      fetchItems()
    }
  }, [session])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/trousseau')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching trousseau items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (itemData: Omit<TrousseauItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/trousseau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setItems(prev => [...prev, newItem])
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding trousseau item:', error)
    }
  }

  const handleUpdateItem = async (itemData: TrousseauItem) => {
    try {
      const response = await fetch(`/api/trousseau/${itemData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (response.ok) {
        const updatedItem = await response.json()
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error updating trousseau item:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/trousseau/${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error deleting trousseau item:', error)
    }
  }

  const handleTogglePurchased = async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const updatedItem = {
      ...item,
      purchased: !item.purchased,
      purchaseDate: !item.purchased ? new Date() : undefined
    }

    await handleUpdateItem(updatedItem)
  }

  const handleAddSuggestion = async (suggestion: string, category: string) => {
    try {
      console.log('Adding suggestion:', suggestion, 'Category:', category)
      const quickItem = {
        name: suggestion,
        category: category as any,
        priority: 'important' as any,
        quantity: 1,
        quantityObtained: 0,
        purchased: false,
        isGift: false
      }
      
      const response = await fetch('/api/trousseau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quickItem),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setItems(prev => [...prev, newItem])
        console.log('Item added successfully')
        
        // Show success feedback (optional)
        // You could add a toast notification here
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert('Erreur lors de l\'ajout de l\'article. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Error adding suggestion:', error)
      alert('Erreur lors de l\'ajout de l\'article. Veuillez réessayer.')
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority
    const matchesPurchased = showPurchased || !item.purchased
    
    // Section filtering
    const matchesSection = sectionFilter === 'all' || (
      sectionFilter === 'mariee' && ['robe_mariee', 'lingerie', 'chaussures', 'bijoux', 'beaute', 'parfum', 'traditionnels'].includes(item.category) ||
      sectionFilter === 'mari' && item.category === 'marie_homme' ||
      sectionFilter === 'mariage' && ['maison', 'cuisine', 'electromenager', 'decoration', 'voyage_noces', 'cadeaux_mariage', 'autres'].includes(item.category)
    )
    
    return matchesSearch && matchesCategory && matchesPriority && matchesPurchased && matchesSection
  })

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <GiftIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Mon trousseau de mariée et gestion cadeaux</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Gérez vos achats mariée, marié et tous vos cadeaux de mariage
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Trial Status */}
        <TrialCountdown />

        {/* Stats */}
        <TrousseauStats items={items} />

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('items')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'items'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              📋 Vue cartes ({items.length})
            </button>
            <button
              onClick={() => setViewMode('excel')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'excel'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              📊 Vue Excel
            </button>
            <button
              onClick={() => setViewMode('suggestions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'suggestions'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              💡 Idées d'articles
            </button>
          </div>

          {(viewMode === 'items' || viewMode === 'excel') && (
            <TrialWarning feature="trousseau_add">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>➕ Ajouter un article</span>
              </button>
            </TrialWarning>
          )}
        </div>

        {/* Section Filter (for items and excel view) */}
        {(viewMode === 'items' || viewMode === 'excel') && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <button
              onClick={() => setSectionFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sectionFilter === 'all'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              🎁 Tout voir ({items.length})
            </button>
            <button
              onClick={() => setSectionFilter('mariee')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sectionFilter === 'mariee'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              👰 Mon trousseau ({items.filter(item => ['robe_mariee', 'lingerie', 'chaussures', 'bijoux', 'beaute', 'parfum', 'traditionnels'].includes(item.category)).length})
            </button>
            <button
              onClick={() => setSectionFilter('mari')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sectionFilter === 'mari'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              🤵 Trousseau mari ({items.filter(item => item.category === 'marie_homme').length})
            </button>
            <button
              onClick={() => setSectionFilter('mariage')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sectionFilter === 'mariage'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              🏠 Liste mariage ({items.filter(item => ['maison', 'cuisine', 'electromenager', 'decoration', 'voyage_noces', 'cadeaux_mariage', 'autres'].includes(item.category)).length})
            </button>
          </div>
        )}

        {viewMode === 'suggestions' ? (
          <TrousseauSuggestions onAddSuggestion={handleAddSuggestion} />
        ) : viewMode === 'excel' ? (
          <>
            {/* Excel View */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  📊 Vue Excel - {
                    sectionFilter === 'all' ? 'Tout le trousseau' :
                    sectionFilter === 'mariee' ? 'Mon trousseau' :
                    sectionFilter === 'mari' ? 'Trousseau mari' :
                    'Liste mariage'
                  } ({filteredItems.length} articles)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ✅ Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        🏷️ Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        📂 Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ⭐ Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        📦 Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        💰 Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        🏪 Magasin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        🔗 Lien
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        item.purchased ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePurchased(item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.purchased
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                            }`}
                          >
                            {item.purchased && <CheckIcon className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                              <span className="text-sm">{TROUSSEAU_CATEGORIES[item.category]?.icon || '📦'}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              {item.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {TROUSSEAU_CATEGORIES[item.category]?.icon} {TROUSSEAU_CATEGORIES[item.category]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.priority === 'essentiel' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            item.priority === 'important' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            item.priority === 'souhaite' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}>
                            {PRIORITY_LEVELS[item.priority]?.icon} {PRIORITY_LEVELS[item.priority]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.quantityObtained}/{item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.actualPrice ? `${item.actualPrice}€` : 
                           item.estimatedPrice ? `~${item.estimatedPrice}€` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.store || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                            >
                              {item.url.includes('amazon') ? (
                                <span className="text-orange-500">📦</span>
                              ) : (
                                <span>🔗</span>
                              )}
                              <span>Voir</span>
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredItems.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucun article dans cette section
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ajoutez des articles à votre trousseau pour commencer
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher mariée, marié, cadeau..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Toutes les catégories</option>
                  {Object.entries(TROUSSEAU_CATEGORIES).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.label}</option>
                  ))}
                </select>

                {/* Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Toutes les priorités</option>
                  {Object.entries(PRIORITY_LEVELS).map(([key, priority]) => (
                    <option key={key} value={key}>{priority.label}</option>
                  ))}
                </select>

                {/* Show Purchased Toggle */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showPurchased"
                    checked={showPurchased}
                    onChange={(e) => setShowPurchased(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showPurchased" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Afficher achetés
                  </label>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {filteredItems.length} article{filteredItems.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement du trousseau...</span>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {items.length === 0 ? '🎁 Créez votre trousseau de couple' : 'Aucun article trouvé'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {items.length === 0 
                    ? 'Organisez vos achats mariée, marié et la gestion de tous vos cadeaux de mariage.'
                    : 'Essayez de modifier vos filtres pour trouver ce que vous cherchez.'
                  }
                </p>
                {items.length === 0 && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      ➕ Ajouter mon premier article
                    </button>
                    <button
                      onClick={() => setViewMode('suggestions')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      💡 Voir les suggestions
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <TrousseauItemCard
                    key={item.id}
                    item={item}
                    onEdit={setEditingItem}
                    onDelete={handleDeleteItem}
                    onTogglePurchased={handleTogglePurchased}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddTrousseauModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddItem}
          />
        )}

        {editingItem && (
          <AddTrousseauModal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onSubmit={handleUpdateItem}
            item={editingItem}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
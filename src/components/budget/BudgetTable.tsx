'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { BudgetItem, BUDGET_CATEGORIES, BUDGET_STATUS } from '@/types/budget'
import { useTrialStatus } from '@/hooks/useTrialStatus'

interface BudgetTableProps {
  budgetItems: BudgetItem[]
  loading: boolean
  onUpdateItem: (item: BudgetItem) => void
  onDeleteItem: (itemId: string) => void
  onAddItem: (item: Omit<BudgetItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
}

interface EditingCell {
  itemId: string
  field: string
}

export default function BudgetTable({ budgetItems, loading, onUpdateItem, onDeleteItem, onAddItem }: BudgetTableProps) {
  const trialStatus = useTrialStatus()
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showNewRow, setShowNewRow] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'lieu_reception',
    estimatedAmount: 0,
    status: 'prevu',
    isRequired: false
  })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (editingCell) {
      if (inputRef.current) inputRef.current.focus()
      if (textareaRef.current) textareaRef.current.focus()
      if (selectRef.current) selectRef.current.focus()
    }
  }, [editingCell])

  const handleCellClick = (itemId: string, field: string, currentValue: any) => {
    setEditingCell({ itemId, field })
    setEditValue(currentValue?.toString() || '')
  }

  const handleSaveEdit = () => {
    if (!editingCell) return
    
    const item = budgetItems.find(i => i.id === editingCell.itemId)
    if (!item) return

    let newValue: any = editValue
    
    // Convert value based on field type
    if (editingCell.field === 'estimatedCost' || editingCell.field === 'actualCost' || editingCell.field === 'paidAmount') {
      newValue = parseFloat(editValue) || 0
    } else if (editingCell.field === 'isPaid') {
      newValue = editValue === 'true'
    }

    const updatedItem = {
      ...item,
      [editingCell.field]: newValue
    }

    onUpdateItem(updatedItem)
    setEditingCell(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleAddNewItem = () => {
    if (!newItem.name.trim()) return
    
    const itemToAdd = {
      title: newItem.name,
      category: newItem.category,
      estimatedCost: newItem.estimatedAmount,
      actualCost: 0,
      paidAmount: 0,
      vendor: '',
      notes: '',
      isPaid: false
    }
    
    onAddItem(itemToAdd)
    setNewItem({
      name: '',
      category: 'lieu_reception',
      estimatedAmount: 0,
      status: 'prevu',
      isRequired: false
    })
    setShowNewRow(false)
  }

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
    setShowQuickActions(newSelected.size > 0)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === budgetItems.length) {
      setSelectedItems(new Set())
      setShowQuickActions(false)
    } else {
      setSelectedItems(new Set(budgetItems.map(item => item.id)))
      setShowQuickActions(true)
    }
  }

  const handleBulkStatusUpdate = (status: string) => {
    selectedItems.forEach(itemId => {
      const item = budgetItems.find(i => i.id === itemId)
      if (item) {
        onUpdateItem({ ...item, status: status as any })
      }
    })
    setSelectedItems(new Set())
    setShowQuickActions(false)
  }

  const handleBulkDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.size} élément(s) ?`)) {
      selectedItems.forEach(itemId => {
        onDeleteItem(itemId)
      })
      setSelectedItems(new Set())
      setShowQuickActions(false)
    }
  }

  const handleDuplicateItem = (item: BudgetItem) => {
    const duplicatedItem = {
      title: `${item.title} (copie)`,
      category: item.category,
      estimatedCost: item.estimatedCost || 0,
      actualCost: item.actualCost || 0,
      paidAmount: item.paidAmount || 0,
      vendor: item.vendor || '',
      notes: item.notes || '',
      isPaid: false
    }
    onAddItem(duplicatedItem)
  }

  const handleQuickSetActualAmount = (itemId: string) => {
    const item = budgetItems.find(i => i.id === itemId)
    if (item && item.estimatedCost) {
      onUpdateItem({ ...item, actualCost: item.estimatedCost })
    }
  }

  const formatCurrency = (amount?: number) => {
    return amount ? `${amount.toLocaleString()}€` : '0€'
  }

  const getCategoryIcon = (category: string) => {
    return BUDGET_CATEGORIES[category as keyof typeof BUDGET_CATEGORIES]?.icon || '📋'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      prevu: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      confirme: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      paye: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      annule: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[status as keyof typeof colors] || colors.prevu
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement du budget...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Budget détaillé
            {selectedItems.size > 0 && (
              <span className="ml-2 text-sm text-emerald-600 font-normal">
                ({selectedItems.size} sélectionné{selectedItems.size > 1 ? 's' : ''})
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            {budgetItems.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {selectedItems.size === budgetItems.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            )}
            <button
              onClick={() => setShowNewRow(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter une ligne</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      {showQuickActions && trialStatus.canAccess('bulk_operations') && (
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Actions rapides pour {selectedItems.size} élément{selectedItems.size > 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('confirme')}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
              >
                Marquer confirmé
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('paye')}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
              >
                Marquer payé
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operations Trial Warning */}
      {showQuickActions && !trialStatus.canAccess('bulk_operations') && (
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Actions groupées disponibles avec un abonnement premium
              </span>
            </div>
            <a
              href="/dashboard/subscription"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs rounded-md font-medium transition-colors"
            >
              Voir les plans
            </a>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={budgetItems.length > 0 && selectedItems.size === budgetItems.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Budget estimé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Coût réel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prestataire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {/* New Row */}
            {showNewRow && (
              <tr className="bg-emerald-50 dark:bg-emerald-900/20">
                <td className="px-6 py-4">
                  <div className="w-4 h-4"></div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-2 py-1 border border-emerald-300 rounded text-sm dark:bg-gray-700 dark:border-emerald-600"
                  >
                    {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom de l'article..."
                    className="w-full px-2 py-1 border border-emerald-300 rounded text-sm dark:bg-gray-700 dark:border-emerald-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={newItem.estimatedAmount}
                    onChange={(e) => setNewItem(prev => ({ ...prev, estimatedAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-2 py-1 border border-emerald-300 rounded text-sm dark:bg-gray-700 dark:border-emerald-600"
                  />
                </td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-2 py-1 border border-emerald-300 rounded text-sm dark:bg-gray-700 dark:border-emerald-600"
                  >
                    {Object.entries(BUDGET_STATUS).map(([key, status]) => (
                      <option key={key} value={key}>{status.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddNewItem}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowNewRow(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing Items */}
            {budgetItems.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedItems.has(item.id) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                {/* Checkbox */}
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                </td>
                
                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.itemId === item.id && editingCell?.field === 'category' ? (
                    <select
                      ref={selectRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    >
                      {Object.entries(BUDGET_CATEGORIES).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'category', item.category)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                      <span className="text-sm font-medium">
                        {BUDGET_CATEGORIES[item.category as keyof typeof BUDGET_CATEGORIES]?.label}
                      </span>
                    </div>
                  )}
                </td>

                {/* Title */}
                <td className="px-6 py-4">
                  {editingCell?.itemId === item.id && editingCell?.field === 'title' ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'title', item.title)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                      {item.notes && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.notes}</div>
                      )}
                    </div>
                  )}
                </td>

                {/* Estimated Cost */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.itemId === item.id && editingCell?.field === 'estimatedCost' ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'estimatedCost', item.estimatedCost)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded text-sm font-medium"
                    >
                      {formatCurrency(item.estimatedCost)}
                    </div>
                  )}
                </td>

                {/* Actual Cost */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.itemId === item.id && editingCell?.field === 'actualCost' ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'actualCost', item.actualCost)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded text-sm font-medium"
                    >
                      {formatCurrency(item.actualCost)}
                    </div>
                  )}
                </td>

                {/* Paid Amount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.itemId === item.id && editingCell?.field === 'paidAmount' ? (
                    <input
                      ref={inputRef}
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'paidAmount', item.paidAmount)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded text-sm font-medium"
                    >
                      {formatCurrency(item.paidAmount)}
                    </div>
                  )}
                </td>

                {/* Vendor */}
                <td className="px-6 py-4">
                  {editingCell?.itemId === item.id && editingCell?.field === 'vendor' ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'vendor', item.vendor)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded text-sm"
                    >
                      {item.vendor || 'Cliquer pour ajouter'}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCell?.itemId === item.id && editingCell?.field === 'status' ? (
                    <select
                      ref={selectRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm dark:bg-gray-700"
                    >
                      {Object.entries(BUDGET_STATUS).map(([key, status]) => (
                        <option key={key} value={key}>{status.label}</option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => handleCellClick(item.id, 'status', item.status)}
                      className="cursor-pointer"
                    >
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {BUDGET_STATUS[item.status as keyof typeof BUDGET_STATUS]?.label}
                      </span>
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDuplicateItem(item)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Dupliquer"
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleQuickSetActualAmount(item.id)}
                      className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                      title="Copier le budget estimé vers coût réel"
                    >
                      <CurrencyDollarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {budgetItems.length === 0 && !showNewRow && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Votre budget est vide
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Commencez par ajouter des éléments à votre budget ou utilisez nos suggestions.
          </p>
          <button
            onClick={() => setShowNewRow(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Ajouter un premier élément
          </button>
        </div>
      )}
    </div>
  )
}
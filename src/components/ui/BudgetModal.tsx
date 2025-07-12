'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CurrencyDollarIcon, TagIcon, UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface BudgetItem {
  id?: string
  category: string
  title: string
  estimatedCost: string
  actualCost: string
  paidAmount: string
  vendor: string
  notes: string
  isPaid: boolean
}

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: BudgetItem) => void
  item?: BudgetItem | null
  mode: 'create' | 'edit'
}

const budgetCategories = [
  { value: 'VENUE', label: 'Lieu / Salle', emoji: '🏛️', description: 'Salle de réception, décoration' },
  { value: 'CATERING', label: 'Traiteur', emoji: '🍽️', description: 'Repas, boissons, service' },
  { value: 'PHOTOGRAPHY', label: 'Photographe', emoji: '📸', description: 'Photos de mariage' },
  { value: 'VIDEOGRAPHY', label: 'Vidéaste', emoji: '🎥', description: 'Vidéo de mariage' },
  { value: 'DECORATIONS', label: 'Décoration', emoji: '🎨', description: 'Déco salle, fleurs' },
  { value: 'FLOWERS', label: 'Fleurs', emoji: '💐', description: 'Bouquets, compositions' },
  { value: 'MUSIC_DJ', label: 'Animation / DJ', emoji: '🎵', description: 'Musique, animation' },
  { value: 'BRIDE_ATTIRE', label: 'Tenues Mariée', emoji: '👰', description: 'Robes, accessoires' },
  { value: 'GROOM_ATTIRE', label: 'Tenues Marié', emoji: '🤵', description: 'Costumes, accessoires' },
  { value: 'JEWELRY', label: 'Bijoux', emoji: '💎', description: 'Alliances, bijoux' },
  { value: 'MAKEUP_HAIR', label: 'Beauté', emoji: '💄', description: 'Maquillage, coiffure' },
  { value: 'TRANSPORTATION', label: 'Transport', emoji: '🚗', description: 'Voiture, limousine' },
  { value: 'GIFTS', label: 'Cadeaux', emoji: '🎁', description: 'Cadeaux invités' },
  { value: 'INVITATIONS', label: 'Invitations', emoji: '💌', description: 'Faire-parts, papeterie' },
  { value: 'TROUSSEAU', label: 'Trousseau', emoji: '🏠', description: 'Linge, vaisselle' },
  { value: 'HENNA_SUPPLIES', label: 'Henné', emoji: '🎨', description: 'Matériel henné, negafa' },
  { value: 'NEGAFA', label: 'Negafa', emoji: '👸', description: 'Services negafa' },
  { value: 'OTHER', label: 'Autre', emoji: '📋', description: 'Autres dépenses' }
]

export default function BudgetModal({ isOpen, onClose, onSave, item, mode }: BudgetModalProps) {
  const [formData, setFormData] = useState<BudgetItem>({
    category: 'OTHER',
    title: '',
    estimatedCost: '',
    actualCost: '',
    paidAmount: '',
    vendor: '',
    notes: '',
    isPaid: false
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        ...item,
        estimatedCost: item.estimatedCost?.toString() || '',
        actualCost: item.actualCost?.toString() || '',
        paidAmount: item.paidAmount?.toString() || ''
      })
    } else {
      setFormData({
        category: 'OTHER',
        title: '',
        estimatedCost: '',
        actualCost: '',
        paidAmount: '',
        vendor: '',
        notes: '',
        isPaid: false
      })
    }
  }, [item, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving budget item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  if (!isOpen) return null

  const selectedCategory = budgetCategories.find(cat => cat.value === formData.category)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Nouvelle Dépense' : 'Modifier la Dépense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TagIcon className="inline h-4 w-4 mr-1" />
              Catégorie de dépense
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {budgetCategories.map((category) => (
                <label
                  key={category.value}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.category === category.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={formData.category === category.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <div className="text-xs font-medium text-gray-900 text-center">{category.label}</div>
                  <div className="text-xs text-gray-500 text-center">{category.description}</div>
                </label>
              ))}
            </div>
            {selectedCategory && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{selectedCategory.emoji}</span>
                  <span className="font-medium text-green-800">{selectedCategory.label}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">{selectedCategory.description}</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la dépense
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={selectedCategory ? `Ex: ${selectedCategory.description}` : "Nom de la dépense"}
              required
            />
          </div>

          {/* Costs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                Coût estimé (€)
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                Coût réel (€)
              </label>
              <input
                type="number"
                name="actualCost"
                value={formData.actualCost}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                Montant payé (€)
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="inline h-4 w-4 mr-1" />
              Prestataire / Vendeur
            </label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom du prestataire ou magasin"
            />
          </div>

          {/* Payment Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
              Paiement terminé
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="inline h-4 w-4 mr-1" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Notes, détails du contrat, conditions..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sauvegarde...' : mode === 'create' ? 'Ajouter la dépense' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
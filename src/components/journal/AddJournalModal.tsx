'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { JournalEntry, JOURNAL_MOODS, JOURNAL_CATEGORIES, JOURNAL_TEMPLATES } from '@/types/journal'

interface AddJournalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | JournalEntry) => void
  entry?: JournalEntry | null
  templateId?: string | null
}

export default function AddJournalModal({ isOpen, onClose, onSubmit, entry, templateId }: AddJournalModalProps) {
  const template = templateId ? JOURNAL_TEMPLATES.find(t => t.id === templateId) : null
  
  const [formData, setFormData] = useState({
    title: entry?.title || template?.title || '',
    content: entry?.content || '',
    mood: entry?.mood || 'happy' as keyof typeof JOURNAL_MOODS,
    category: entry?.category || template?.category || 'emotions',
    tags: entry?.tags?.join(', ') || '',
    milestone: entry?.milestone || '',
    isPrivate: entry?.isPrivate ?? false,
    date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const entryData = {
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(s => s.trim()).filter(s => s)
        : [],
      date: new Date(formData.date),
      milestone: formData.milestone || undefined,
      ...(entry && { 
        id: entry.id, 
        userId: entry.userId,
        createdAt: entry.createdAt, 
        updatedAt: new Date(),
        images: entry.images
      })
    }

    onSubmit(entryData as any)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {entry ? 'Modifier l\'entrée' : template ? `Nouvelle entrée: ${template.title}` : 'Nouvelle entrée'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Template Info */}
        {template && (
          <div className="p-6 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-pink-800 dark:text-pink-300 mb-2">
              Suggestions d'écriture:
            </h3>
            <div className="space-y-1">
              {template.prompts.map((prompt, index) => (
                <p key={index} className="text-sm text-pink-700 dark:text-pink-400">
                  • {prompt}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Donnez un titre à votre entrée..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Mood and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Humeur *
              </label>
              <select
                required
                value={formData.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {Object.entries(JOURNAL_MOODS).map(([key, mood]) => (
                  <option key={key} value={key}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {Object.entries(JOURNAL_CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Milestone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Étape importante (optionnel)
            </label>
            <input
              type="text"
              value={formData.milestone}
              onChange={(e) => handleChange('milestone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Essayage de robe, Choix du traiteur..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenu *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Racontez votre expérience, vos émotions, vos découvertes..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (séparés par virgules)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="robe, émotion, famille, stress..."
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => handleChange('isPrivate', e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Entrée privée (visible uniquement par moi)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
            >
              {entry ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
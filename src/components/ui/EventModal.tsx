'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CalendarDaysIcon, ClockIcon, MapPinIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Event {
  id?: string
  title: string
  type: string
  date: string
  time: string
  location: string
  description: string
  isCompleted: boolean
}

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  event?: Event | null
  mode: 'create' | 'edit'
}

const eventTypes = [
  { value: 'ENGAGEMENT', label: 'Fiançailles', emoji: '💍', color: 'bg-rose-100 text-rose-800' },
  { value: 'KHOTBA', label: 'Khotba', emoji: '🤝', color: 'bg-purple-100 text-purple-800' },
  { value: 'RELIGIOUS_CEREMONY', label: 'Cérémonie Religieuse', emoji: '🕌', color: 'bg-blue-100 text-blue-800' },
  { value: 'HENNA', label: 'Soirée Henné', emoji: '🎨', color: 'bg-orange-100 text-orange-800' },
  { value: 'BACHELORETTE', label: 'EVJF', emoji: '🎉', color: 'bg-pink-100 text-pink-800' },
  { value: 'CIVIL_CEREMONY', label: 'Mariage Civil', emoji: '📋', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'RECEPTION', label: 'Réception', emoji: '🎊', color: 'bg-green-100 text-green-800' },
  { value: 'TROUSSEAU_PREP', label: 'Préparation Trousseau', emoji: '👗', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'OTHER', label: 'Autre', emoji: '📅', color: 'bg-gray-100 text-gray-800' }
]

export default function EventModal({ isOpen, onClose, onSave, event, mode }: EventModalProps) {
  const [formData, setFormData] = useState<Event>({
    title: '',
    type: 'OTHER',
    date: '',
    time: '',
    location: '',
    description: '',
    isCompleted: false
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (event && mode === 'edit') {
      setFormData({
        ...event,
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
      })
    } else {
      setFormData({
        title: '',
        type: 'OTHER',
        date: '',
        time: '',
        location: '',
        description: '',
        isCompleted: false
      })
    }
  }, [event, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
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

  if (!isOpen) return null

  const selectedEventType = eventTypes.find(type => type.value === formData.type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Nouvel Événement' : 'Modifier l\'Événement'}
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
          {/* Event Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type d'événement
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {eventTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium text-gray-900 text-center">{type.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'événement
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={selectedEventType ? `Ex: ${selectedEventType.label}` : "Nom de l'événement"}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDaysIcon className="inline h-4 w-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="inline h-4 w-4 mr-1" />
                Heure
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="inline h-4 w-4 mr-1" />
              Lieu
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adresse ou nom du lieu"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="inline h-4 w-4 mr-1" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Détails, notes, ou instructions spéciales..."
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sauvegarde...' : mode === 'create' ? 'Créer l\'événement' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
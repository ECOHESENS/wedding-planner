'use client'

import { useState, useEffect } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  TableCellsIcon,
  Squares2X2Icon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Attendee, ATTENDEE_CATEGORIES, AttendeeCategory } from '@/types/attendees'
import { useLanguage } from '@/contexts/LanguageContext'

interface AttendeesListProps {
  attendees: Attendee[]
  loading: boolean
  onEdit: (attendee: Attendee) => void
  onDelete: (attendeeId: string) => void
  onUpdate?: (attendee: Attendee) => void
}

export default function AttendeesList({ attendees, loading, onEdit, onDelete, onUpdate }: AttendeesListProps) {
  const { isRTL } = useLanguage()
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'excel'>('excel')
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [localAttendees, setLocalAttendees] = useState<Attendee[]>(attendees)

  useEffect(() => {
    setLocalAttendees(attendees)
  }, [attendees])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des invités...</span>
        </div>
      </div>
    )
  }

  if (attendees.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun invité trouvé
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Commencez par ajouter vos premiers invités à votre liste.
        </p>
      </div>
    )
  }

  const getSideLabel = (side: string) => {
    switch (side) {
      case 'MARIE': return 'Marié'
      case 'MARIEE': return 'Mariée'
      case 'COMMUN': return 'Commun'
      default: return side
    }
  }

  const getSideBadgeColor = (side: string) => {
    switch (side) {
      case 'MARIE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'MARIEE': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'COMMUN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleCellEdit = (id: string, field: string, currentValue: any) => {
    setEditingCell({ id, field })
    setEditValue(String(currentValue || ''))
  }

  const handleCellSave = async () => {
    if (!editingCell) return
    
    const attendee = localAttendees.find(a => a.id === editingCell.id)
    if (!attendee) return

    let updatedValue: any = editValue
    
    // Handle boolean fields
    if (editingCell.field === 'confirmed' || editingCell.field === 'invitationSent' || editingCell.field === 'plusOne') {
      updatedValue = editValue === 'true'
    }
    
    const updatedAttendee = {
      ...attendee,
      [editingCell.field]: updatedValue
    }
    
    // Update local state immediately for responsive UI
    setLocalAttendees(prev => 
      prev.map(a => a.id === editingCell.id ? updatedAttendee : a)
    )
    
    // Call parent update function if provided
    if (onUpdate) {
      onUpdate(updatedAttendee)
    }
    
    setEditingCell(null)
    setEditValue('')
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const renderEditableCell = (attendee: Attendee, field: string, value: any, type: 'text' | 'select' | 'boolean' = 'text', options?: { value: string; label: string }[]) => {
    const isEditing = editingCell?.id === attendee.id && editingCell?.field === field
    
    if (isEditing) {
      if (type === 'select') {
        return (
          <div className="flex items-center space-x-1">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-xs border border-purple-300 rounded px-1 py-0.5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white min-w-0 flex-1"
              autoFocus
              onBlur={handleCellSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCellSave()
                if (e.key === 'Escape') handleCellCancel()
              }}
            >
              {options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )
      }
      
      if (type === 'boolean') {
        return (
          <div className="flex items-center space-x-1">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-xs border border-purple-300 rounded px-1 py-0.5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
              onBlur={handleCellSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCellSave()
                if (e.key === 'Escape') handleCellCancel()
              }}
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        )
      }
      
      return (
        <div className="flex items-center space-x-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs border border-purple-300 rounded px-1 py-0.5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white min-w-0 flex-1"
            autoFocus
            onBlur={handleCellSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCellSave()
              if (e.key === 'Escape') handleCellCancel()
            }}
          />
        </div>
      )
    }
    
    return (
      <div 
        className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 px-1 py-0.5 rounded text-xs min-h-[20px] flex items-center"
        onClick={() => handleCellEdit(attendee.id, field, value)}
        title="Cliquer pour modifier"
      >
        {type === 'boolean' ? (value ? 'Oui' : 'Non') : (value || '-')}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            📊 Liste des invités ({localAttendees.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('excel')}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1 ${
                viewMode === 'excel'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <TableCellsIcon className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === 'table'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Tableau
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center space-x-1 ${
                viewMode === 'grid'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Squares2X2Icon className="h-4 w-4" />
              <span>Grille</span>
            </button>
          </div>
        </div>
        
        {viewMode === 'excel' && (
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center space-x-1">
              <span>💡</span>
              <span><strong>Mode Excel :</strong> Cliquez sur n'importe quelle case pour l'éditer directement, comme sur Notion ou Excel !</span>
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === 'excel' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="sticky left-0 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[120px]">
                  Prénom
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[120px]">
                  Nom
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[140px]">
                  Catégorie
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[80px]">
                  Côté
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[180px]">
                  Email
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[120px]">
                  Téléphone
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[80px]">
                  Confirmé
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[80px]">
                  Invitation
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[80px]">
                  +1
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[120px]">
                  Nom +1
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {localAttendees.map((attendee, index) => (
                <tr key={attendee.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-750'}`}>
                  <td className="sticky left-0 bg-inherit px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'firstName', attendee.firstName)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'lastName', attendee.lastName)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(
                      attendee, 
                      'category', 
                      attendee.category, 
                      'select', 
                      Object.entries(ATTENDEE_CATEGORIES).map(([key, label]) => ({ value: key, label }))
                    )}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(
                      attendee, 
                      'side', 
                      attendee.side, 
                      'select', 
                      [
                        { value: 'MARIE', label: 'Marié' },
                        { value: 'MARIEE', label: 'Mariée' },
                        { value: 'COMMUN', label: 'Commun' }
                      ]
                    )}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'email', attendee.email)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'phone', attendee.phone)}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'confirmed', attendee.confirmed, 'boolean')}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'invitationSent', attendee.invitationSent, 'boolean')}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'plusOne', attendee.plusOne, 'boolean')}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                    {renderEditableCell(attendee, 'plusOneName', attendee.plusOneName)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(attendee)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                        title="Éditer"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDelete(attendee.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Côté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
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
              {localAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {attendee.firstName} {attendee.lastName}
                      </div>
                      {attendee.plusOne && attendee.plusOneName && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          + {attendee.plusOneName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {ATTENDEE_CATEGORIES[attendee.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSideBadgeColor(attendee.side)}`}>
                      {getSideLabel(attendee.side)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="space-y-1">
                      {attendee.email && (
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="h-4 w-4" />
                          <span>{attendee.email}</span>
                        </div>
                      )}
                      {attendee.phone && (
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{attendee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {attendee.confirmed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-orange-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        attendee.confirmed 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-orange-700 dark:text-orange-400'
                      }`}>
                        {attendee.confirmed ? 'Confirmé' : 'En attente'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(attendee)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(attendee.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {localAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {attendee.firstName} {attendee.lastName}
                  </h4>
                  {attendee.plusOne && attendee.plusOneName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      + {attendee.plusOneName}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(attendee)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(attendee.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSideBadgeColor(attendee.side)}`}>
                  {getSideLabel(attendee.side)}
                </span>
                
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {ATTENDEE_CATEGORIES[attendee.category]}
                </div>
                
                <div className="flex items-center space-x-1">
                  {attendee.confirmed ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-orange-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    attendee.confirmed 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-orange-700 dark:text-orange-400'
                  }`}>
                    {attendee.confirmed ? 'Confirmé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
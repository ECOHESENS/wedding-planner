'use client'

import { useState } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Attendee, Table, TableShape, TABLE_SHAPES } from '@/types/attendees'

interface TablePlanModalProps {
  isOpen: boolean
  onClose: () => void
  attendees: Attendee[]
}

export default function TablePlanModal({ isOpen, onClose, attendees }: TablePlanModalProps) {
  const [venueWidth, setVenueWidth] = useState(20)
  const [venueHeight, setVenueHeight] = useState(15)
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [showAddTable, setShowAddTable] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const [newTable, setNewTable] = useState({
    number: 1,
    shape: 'round' as TableShape,
    seats: 8,
    x: 5,
    y: 5
  })

  // Calculate optimal scale factor based on venue size and container
  const getScaleFactor = () => {
    const maxWidth = 800 // Maximum container width
    const maxHeight = 600 // Maximum container height
    const scaleX = maxWidth / venueWidth
    const scaleY = maxHeight / venueHeight
    return Math.min(scaleX, scaleY, 30) * zoomLevel // Cap at 30px per meter
  }

  const scaleFactor = getScaleFactor()

  const handleAddTable = () => {
    // Ensure table is within venue bounds
    const maxX = Math.max(0, venueWidth - 3)
    const maxY = Math.max(0, venueHeight - 3)
    
    const table: Table = {
      id: `table-${Date.now()}`,
      number: newTable.number,
      shape: newTable.shape,
      seats: Math.max(2, Math.min(20, newTable.seats)),
      x: Math.max(0, Math.min(maxX, newTable.x)),
      y: Math.max(0, Math.min(maxY, newTable.y)),
      attendees: []
    }
    
    setTables(prev => [...prev, table])
    setNewTable(prev => ({ 
      ...prev, 
      number: prev.number + 1,
      x: Math.min(prev.x + 1, maxX),
      y: Math.min(prev.y + 1, maxY)
    }))
    setShowAddTable(false)
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
  }

  const assignAttendeeToTable = (attendeeId: string, tableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        if (table.attendees.length < table.seats && !table.attendees.includes(attendeeId)) {
          return { ...table, attendees: [...table.attendees, attendeeId] }
        }
      }
      return table
    }))
  }

  const removeAttendeeFromTable = (attendeeId: string, tableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return { ...table, attendees: table.attendees.filter(id => id !== attendeeId) }
      }
      return table
    }))
  }

  const unassignedAttendees = attendees.filter(attendee => 
    !tables.some(table => table.attendees.includes(attendee.id))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Plan de Table
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Left Panel - Controls */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {/* Venue Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Dimensions du lieu
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📏 Largeur (m)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={venueWidth}
                    onChange={(e) => setVenueWidth(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📐 Longueur (m)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={venueHeight}
                    onChange={(e) => setVenueHeight(Math.max(5, parseInt(e.target.value) || 5))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🔍 Zoom
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>50%</span>
                    <span>{Math.round(zoomLevel * 100)}%</span>
                    <span>200%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tables ({tables.length})
                </h3>
                <button
                  onClick={() => setShowAddTable(!showAddTable)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>

              {showAddTable && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        🏷️ Numéro
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={newTable.number}
                        onChange={(e) => setNewTable(prev => ({ ...prev, number: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        👥 Places
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        value={newTable.seats}
                        onChange={(e) => setNewTable(prev => ({ ...prev, seats: Math.max(2, Math.min(20, parseInt(e.target.value) || 8)) }))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        📐 Position X (m)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={Math.max(0, venueWidth - 3)}
                        value={newTable.x}
                        onChange={(e) => setNewTable(prev => ({ ...prev, x: Math.max(0, Math.min(venueWidth - 3, parseInt(e.target.value) || 0)) }))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        📐 Position Y (m)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={Math.max(0, venueHeight - 3)}
                        value={newTable.y}
                        onChange={(e) => setNewTable(prev => ({ ...prev, y: Math.max(0, Math.min(venueHeight - 3, parseInt(e.target.value) || 0)) }))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      🔸 Forme
                    </label>
                    <select
                      value={newTable.shape}
                      onChange={(e) => setNewTable(prev => ({ ...prev, shape: e.target.value as TableShape }))}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {Object.entries(TABLE_SHAPES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddTable}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    ➕ Ajouter la table
                  </button>
                </div>
              )}
            </div>

            {/* Unassigned Attendees */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👥 Invités non assignés ({unassignedAttendees.length})
              </h3>
              {unassignedAttendees.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-sm">Tous les invités sont assignés !</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {unassignedAttendees.map(attendee => (
                    <div
                      key={attendee.id}
                      className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-l-4 border-orange-400"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('attendeeId', attendee.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate flex-1">
                          {attendee.firstName} {attendee.lastName}
                          {attendee.plusOne && <span className="text-purple-600 dark:text-purple-400 ml-1">+1</span>}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                          attendee.side === 'marie' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          attendee.side === 'mariee' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {attendee.side === 'marie' ? '🤵' : attendee.side === 'mariee' ? '👰' : '👥'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                💡 Glissez-déposez les invités sur les tables pour les assigner
              </div>
            </div>
          </div>

          {/* Right Panel - Visual Plan */}
          <div className="flex-1 p-6 relative overflow-auto">
            <div
              className="relative bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 mx-auto rounded-lg"
              style={{
                width: `${venueWidth * scaleFactor}px`,
                height: `${venueHeight * scaleFactor}px`,
                minWidth: '300px',
                minHeight: '200px',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {/* Tables */}
              {tables.map(table => (
                <div
                  key={table.id}
                  className={`absolute cursor-pointer border-2 flex flex-col items-center justify-center text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl ${
                    selectedTable?.id === table.id
                      ? 'border-purple-500 bg-purple-600 ring-2 ring-purple-300'
                      : table.attendees.length === table.seats
                      ? 'border-green-500 bg-green-600 hover:bg-green-700'
                      : table.attendees.length > 0
                      ? 'border-yellow-500 bg-yellow-600 hover:bg-yellow-700'
                      : 'border-gray-400 bg-gray-500 hover:bg-gray-600 hover:border-gray-300'
                  }`}
                  style={{
                    left: `${table.x * scaleFactor}px`,
                    top: `${table.y * scaleFactor}px`,
                    width: table.shape === 'round' ? `${Math.max(50, scaleFactor * 3)}px` : table.shape === 'square' ? `${Math.max(50, scaleFactor * 3)}px` : `${Math.max(60, scaleFactor * 4)}px`,
                    height: table.shape === 'round' ? `${Math.max(50, scaleFactor * 3)}px` : table.shape === 'square' ? `${Math.max(50, scaleFactor * 3)}px` : `${Math.max(40, scaleFactor * 2)}px`,
                    borderRadius: table.shape === 'round' ? '50%' : table.shape === 'square' ? '8px' : '8px'
                  }}
                  onClick={() => handleTableClick(table)}
                  onDrop={(e) => {
                    e.preventDefault()
                    const attendeeId = e.dataTransfer.getData('attendeeId')
                    if (attendeeId) {
                      assignAttendeeToTable(attendeeId, table.id)
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <span className="font-bold" style={{ fontSize: `${Math.max(10, scaleFactor * 0.6)}px` }}>
                    {table.number}
                  </span>
                  <span className="text-xs opacity-75" style={{ fontSize: `${Math.max(8, scaleFactor * 0.4)}px` }}>
                    {table.attendees.length}/{table.seats}
                  </span>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">📋 Légende</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <span className="text-gray-700 dark:text-gray-300">Table vide</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-700 dark:text-gray-300">Table partiellement occupée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700 dark:text-gray-300">Table complète</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                    <span className="text-gray-700 dark:text-gray-300">Table sélectionnée</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                  📐 Dimensions: {venueWidth}m × {venueHeight}m<br/>
                  🔍 Zoom: {Math.round(zoomLevel * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Table Details */}
        {selectedTable && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                🪑 Table {selectedTable.number} - {TABLE_SHAPES[selectedTable.shape]}
              </h3>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTable.attendees.length === selectedTable.seats
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : selectedTable.attendees.length > selectedTable.seats * 0.8
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {selectedTable.attendees.length}/{selectedTable.seats} places
                </span>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  👥 Invités assignés ({selectedTable.attendees.length})
                </h4>
                {selectedTable.attendees.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <div className="text-2xl mb-1">🪑</div>
                    <p className="text-sm">Table vide</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedTable.attendees.map(attendeeId => {
                      const attendee = attendees.find(a => a.id === attendeeId)
                      return attendee ? (
                        <div key={attendeeId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          <div className="flex items-center space-x-2 flex-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              attendee.side === 'marie' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              attendee.side === 'mariee' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {attendee.side === 'marie' ? '🤵' : attendee.side === 'mariee' ? '👰' : '👥'}
                            </span>
                            <span className="truncate">
                              {attendee.firstName} {attendee.lastName}
                              {attendee.plusOne && <span className="text-purple-600 dark:text-purple-400 ml-1">+1</span>}
                            </span>
                          </div>
                          <button
                            onClick={() => removeAttendeeFromTable(attendeeId, selectedTable.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs flex-shrink-0 ml-2 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            ❌
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  📊 Statistiques
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Occupation:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTable.attendees.length}/{selectedTable.seats}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Forme:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {TABLE_SHAPES[selectedTable.shape]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Position:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedTable.x}m, {selectedTable.y}m
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        selectedTable.attendees.length === selectedTable.seats ? 'bg-green-500' :
                        selectedTable.attendees.length > selectedTable.seats * 0.8 ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, (selectedTable.attendees.length / selectedTable.seats) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
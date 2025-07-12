'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { Attendee, AttendeeCategory, ATTENDEE_CATEGORIES } from '@/types/attendees'
import AttendeesList from '@/components/attendees/AttendeesList'
import AddAttendeeModal from '@/components/attendees/AddAttendeeModal'
import TablePlanModal from '@/components/attendees/TablePlanModal'
import AttendeesStats from '@/components/attendees/AttendeesStats'

export default function AttendeesPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AttendeeCategory | 'all'>('all')
  const [selectedSide, setSelectedSide] = useState<'MARIE' | 'MARIEE' | 'COMMUN' | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTablePlan, setShowTablePlan] = useState(false)
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null)

  useEffect(() => {
    if (session) {
      fetchAttendees()
    }
  }, [session])

  const fetchAttendees = async () => {
    try {
      const response = await fetch('/api/attendees')
      if (response.ok) {
        const data = await response.json()
        setAttendees(data)
      }
    } catch (error) {
      console.error('Error fetching attendees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAttendee = async (attendeeData: Omit<Attendee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendeeData),
      })
      
      if (response.ok) {
        const newAttendee = await response.json()
        setAttendees(prev => [...prev, newAttendee])
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding attendee:', error)
    }
  }

  const handleUpdateAttendee = async (attendeeData: Attendee) => {
    try {
      const response = await fetch(`/api/attendees/${attendeeData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendeeData),
      })
      
      if (response.ok) {
        const updatedAttendee = await response.json()
        setAttendees(prev => prev.map(a => a.id === updatedAttendee.id ? updatedAttendee : a))
        setEditingAttendee(null)
      }
    } catch (error) {
      console.error('Error updating attendee:', error)
    }
  }

  const handleDeleteAttendee = async (attendeeId: string) => {
    try {
      const response = await fetch(`/api/attendees/${attendeeId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setAttendees(prev => prev.filter(a => a.id !== attendeeId))
      }
    } catch (error) {
      console.error('Error deleting attendee:', error)
    }
  }

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = searchTerm === '' || 
      attendee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || attendee.category === selectedCategory
    const matchesSide = selectedSide === 'all' || attendee.side === selectedSide
    
    return matchesSearch && matchesCategory && matchesSide
  })

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <UsersIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Gestion des Invités</h1>
            </div>
            <p className="text-purple-100 text-lg">
              Gérez votre liste d'invités et organisez vos plans de table
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Stats */}
        <AttendeesStats attendees={attendees} />

        {/* Action Buttons */}
        <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter un invité</span>
          </button>
          
          <button
            onClick={() => setShowTablePlan(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <TableCellsIcon className="h-5 w-5" />
            <span>Plan de table</span>
          </button>
        </div>

        {/* Quick Add Family Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UsersIcon className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ajout rapide - Famille</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* Bride Side */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Côté Mariée</h4>
              <div className="space-y-1">
                {[
                  { name: 'Maman', category: 'FAMILLE_PROCHE', side: 'MARIEE' },
                  { name: 'Papa', category: 'FAMILLE_PROCHE', side: 'MARIEE' },
                  { name: 'Sœur', category: 'FAMILLE_PROCHE', side: 'MARIEE' },
                  { name: 'Frère', category: 'FAMILLE_PROCHE', side: 'MARIEE' },
                  { name: 'Grand-mère', category: 'FAMILLE_PROCHE', side: 'MARIEE' },
                  { name: 'Grand-père', category: 'FAMILLE_PROCHE', side: 'MARIEE' }
                ].map((member) => (
                  <button
                    key={`mariee-${member.name}`}
                    onClick={() => {
                      const attendeeData = {
                        firstName: member.name,
                        lastName: 'À définir',
                        category: member.category as AttendeeCategory,
                        side: member.side as 'MARIE' | 'MARIEE' | 'COMMUN',
                        confirmed: false,
                        invitationSent: false
                      }
                      handleAddAttendee(attendeeData)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Groom Side */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Côté Marié</h4>
              <div className="space-y-1">
                {[
                  { name: 'Maman', category: 'FAMILLE_PROCHE', side: 'MARIE' },
                  { name: 'Papa', category: 'FAMILLE_PROCHE', side: 'MARIE' },
                  { name: 'Sœur', category: 'FAMILLE_PROCHE', side: 'MARIE' },
                  { name: 'Frère', category: 'FAMILLE_PROCHE', side: 'MARIE' },
                  { name: 'Grand-mère', category: 'FAMILLE_PROCHE', side: 'MARIE' },
                  { name: 'Grand-père', category: 'FAMILLE_PROCHE', side: 'MARIE' }
                ].map((member) => (
                  <button
                    key={`marie-${member.name}`}
                    onClick={() => {
                      const attendeeData = {
                        firstName: member.name,
                        lastName: 'À définir',
                        category: member.category as AttendeeCategory,
                        side: member.side as 'MARIE' | 'MARIEE' | 'COMMUN',
                        confirmed: false,
                        invitationSent: false
                      }
                      handleAddAttendee(attendeeData)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Wedding Party */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-pink-600 dark:text-pink-400">Cortège</h4>
              <div className="space-y-1">
                {[
                  { name: 'Témoin (F)', category: 'TEMOINS', side: 'MARIEE' },
                  { name: 'Témoin (H)', category: 'TEMOINS', side: 'MARIE' },
                  { name: 'Demoiselle d\'honneur', category: 'DEMOISELLES_HONNEUR', side: 'MARIEE' },
                  { name: 'Garçon d\'honneur', category: 'GARCONS_HONNEUR', side: 'MARIE' },
                  { name: 'Bouquetière', category: 'ENFANTS', side: 'COMMUN' },
                  { name: 'Porteur d\'alliances', category: 'ENFANTS', side: 'COMMUN' }
                ].map((member) => (
                  <button
                    key={`cortege-${member.name}`}
                    onClick={() => {
                      const attendeeData = {
                        firstName: member.name,
                        lastName: 'À définir',
                        category: member.category as AttendeeCategory,
                        side: member.side as 'MARIE' | 'MARIEE' | 'COMMUN',
                        confirmed: false,
                        invitationSent: false
                      }
                      handleAddAttendee(attendeeData)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Extended Family */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Famille étendue</h4>
              <div className="space-y-1">
                {[
                  { name: 'Oncle & Tante', category: 'FAMILLE_ETENDUE', side: 'COMMUN' },
                  { name: 'Cousins', category: 'FAMILLE_ETENDUE', side: 'COMMUN' },
                  { name: 'Beaux-parents', category: 'FAMILLE_PROCHE', side: 'COMMUN' },
                  { name: 'Neveu/Nièce', category: 'ENFANTS', side: 'COMMUN' },
                  { name: 'Famille proche', category: 'FAMILLE_PROCHE', side: 'COMMUN' },
                  { name: 'Amis proches', category: 'AMIS_PROCHES', side: 'COMMUN' }
                ].map((member) => (
                  <button
                    key={`family-${member.name}`}
                    onClick={() => {
                      const attendeeData = {
                        firstName: member.name,
                        lastName: 'À définir',
                        category: member.category as AttendeeCategory,
                        side: member.side as 'MARIE' | 'MARIEE' | 'COMMUN',
                        confirmed: false,
                        invitationSent: false
                      }
                      handleAddAttendee(attendeeData)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Astuce:</strong> Cliquez sur un rôle pour ajouter rapidement un invité. Vous pourrez modifier les détails dans la liste ci-dessous.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un invité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AttendeeCategory | 'all')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Toutes les catégories</option>
              {Object.entries(ATTENDEE_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Side Filter */}
            <select
              value={selectedSide}
              onChange={(e) => setSelectedSide(e.target.value as 'MARIE' | 'MARIEE' | 'COMMUN' | 'all')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tous les côtés</option>
              <option value="MARIE">Côté marié</option>
              <option value="MARIEE">Côté mariée</option>
              <option value="COMMUN">Commun</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {filteredAttendees.length} invité{filteredAttendees.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Attendees List */}
        <AttendeesList
          attendees={filteredAttendees}
          loading={loading}
          onEdit={setEditingAttendee}
          onDelete={handleDeleteAttendee}
          onUpdate={handleUpdateAttendee}
        />

        {/* Modals */}
        {showAddModal && (
          <AddAttendeeModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddAttendee}
          />
        )}

        {editingAttendee && (
          <AddAttendeeModal
            isOpen={!!editingAttendee}
            onClose={() => setEditingAttendee(null)}
            onSubmit={handleUpdateAttendee}
            attendee={editingAttendee}
          />
        )}

        {showTablePlan && (
          <TablePlanModal
            isOpen={showTablePlan}
            onClose={() => setShowTablePlan(false)}
            attendees={attendees}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
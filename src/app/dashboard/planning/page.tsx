'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import EventModal from '@/components/ui/EventModal'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  ClipboardDocumentListIcon,
  PlusIcon,
  CheckIcon,
  ClockIcon,
  StarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon,
  BanknotesIcon,
  SparklesIcon,
  ChartBarIcon,
  ViewColumnsIcon,
  CalendarIcon,
  RocketLaunchIcon,
  HeartIcon,
  FireIcon,
  CameraIcon,
  MusicalNoteIcon,
  GiftIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid'

// Types
interface WeddingDay {
  id: string
  name: string
  date: string
  location?: string
  description?: string
  estimatedGuests?: number
  budget?: number
  isMainDay: boolean
  order: number
  attendees: any[]
  events: any[]
  budgetItems: any[]
  createdAt: string
  updatedAt: string
}

interface Event {
  id: string
  title: string
  type: string
  date: string | null
  time: string | null
  location: string | null
  description: string | null
  isCompleted: boolean
  createdAt: string
  weddingDayId?: string
}

interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'done'
  dueDate?: string
  assignee?: string
  estimatedBudget?: number
  completedAt?: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  progress: number
  totalTasks: number
  completedTasks: number
  urgentTasks: number
  budget: number
}

// Constants
const QUICK_SUGGESTIONS = [
  {
    title: "Réserver le lieu de réception",
    description: "Finaliser la réservation de votre salle de mariage",
    category: "venue",
    estimatedBudget: 3000,
    priority: "high" as const,
    emoji: "🏛️"
  },
  {
    title: "Choisir le traiteur",
    description: "Sélectionner et réserver votre traiteur",
    category: "catering",
    estimatedBudget: 4500,
    priority: "high" as const,
    emoji: "🍽️"
  },
  {
    title: "Robe de mariée",
    description: "Choisir et commander votre robe de rêve",
    category: "attire",
    estimatedBudget: 1200,
    priority: "high" as const,
    emoji: "👗"
  },
  {
    title: "Photographe professionnel",
    description: "Réserver votre photographe de mariage",
    category: "photography",
    estimatedBudget: 1500,
    priority: "high" as const,
    emoji: "📸"
  },
  {
    title: "DJ ou orchestre",
    description: "Animation musicale pour votre réception",
    category: "music",
    estimatedBudget: 800,
    priority: "medium" as const,
    emoji: "🎵"
  },
  {
    title: "Fleurs et décoration",
    description: "Bouquet, centres de table et décoration florale",
    category: "flowers",
    estimatedBudget: 600,
    priority: "medium" as const,
    emoji: "💐"
  },
  {
    title: "Alliances",
    description: "Choisir vos alliances de mariage",
    category: "jewelry",
    estimatedBudget: 800,
    priority: "high" as const,
    emoji: "💍"
  },
  {
    title: "Faire-parts",
    description: "Créer et envoyer vos invitations",
    category: "invitations",
    estimatedBudget: 200,
    priority: "medium" as const,
    emoji: "💌"
  }
]

const CATEGORIES: Record<string, Category> = {
  venue: {
    id: 'venue',
    name: 'Lieu & Réception',
    emoji: '🏛️',
    color: 'blue',
    description: 'Réservation du lieu, décoration, plan de table',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 3000
  },
  catering: {
    id: 'catering',
    name: 'Traiteur & Menu',
    emoji: '🍽️',
    color: 'orange',
    description: 'Menu, dégustation, service, boissons',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 4500
  },
  attire: {
    id: 'attire',
    name: 'Tenues & Beauté',
    emoji: '👗',
    color: 'pink',
    description: 'Robe, costume, coiffure, maquillage',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 1500
  },
  photography: {
    id: 'photography',
    name: 'Photo & Vidéo',
    emoji: '📸',
    color: 'purple',
    description: 'Photographe, vidéaste, séances photo',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 1500
  },
  music: {
    id: 'music',
    name: 'Musique & Animation',
    emoji: '🎵',
    color: 'indigo',
    description: 'DJ, orchestre, playlist, matériel son',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 800
  },
  flowers: {
    id: 'flowers',
    name: 'Fleurs & Décoration',
    emoji: '💐',
    color: 'green',
    description: 'Bouquets, centres de table, décoration florale',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 600
  },
  guests: {
    id: 'guests',
    name: 'Invités & Faire-part',
    emoji: '👥',
    color: 'teal',
    description: 'Liste d\'invités, invitations, confirmations',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 200
  },
  transport: {
    id: 'transport',
    name: 'Transport & Logistique',
    emoji: '🚗',
    color: 'gray',
    description: 'Transport mariés, invités, hébergement',
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    urgentTasks: 0,
    budget: 500
  }
}

const EVENT_TYPES = {
  'ENGAGEMENT': { label: '💍 Fiançailles', emoji: '💍', color: 'bg-rose-500', lightColor: 'bg-rose-50 border-rose-200 text-rose-700' },
  'KHOTBA': { label: '🤝 Khotba', emoji: '🤝', color: 'bg-purple-500', lightColor: 'bg-purple-50 border-purple-200 text-purple-700' },
  'RELIGIOUS_CEREMONY': { label: '🕌 Cérémonie Religieuse', emoji: '🕌', color: 'bg-blue-500', lightColor: 'bg-blue-50 border-blue-200 text-blue-700' },
  'HENNA': { label: '🎨 Soirée Henné', emoji: '🎨', color: 'bg-orange-500', lightColor: 'bg-orange-50 border-orange-200 text-orange-700' },
  'BACHELORETTE': { label: '🎉 EVJF', emoji: '🎉', color: 'bg-pink-500', lightColor: 'bg-pink-50 border-pink-200 text-pink-700' },
  'BACHELOR': { label: '🍻 EVG', emoji: '🍻', color: 'bg-amber-500', lightColor: 'bg-amber-50 border-amber-200 text-amber-700' },
  'CIVIL_CEREMONY': { label: '📋 Mariage Civil', emoji: '📋', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  'RECEPTION': { label: '🎊 Réception', emoji: '🎊', color: 'bg-green-500', lightColor: 'bg-green-50 border-green-200 text-green-700' },
  'PHOTO_SHOOT': { label: '📸 Séance Photo', emoji: '📸', color: 'bg-purple-500', lightColor: 'bg-purple-50 border-purple-200 text-purple-700' },
  'HONEYMOON': { label: '✈️ Voyage de Noces', emoji: '✈️', color: 'bg-teal-500', lightColor: 'bg-teal-50 border-teal-200 text-teal-700' },
  'OTHER': { label: '📅 Autre', emoji: '📅', color: 'bg-gray-500', lightColor: 'bg-gray-50 border-gray-200 text-gray-700' }
}

export default function PlanningPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const router = useRouter()
  
  // State
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'calendar' | 'kanban' | 'days' | 'suggestions'>('overview')
  const [weddingDays, setWeddingDays] = useState<WeddingDay[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingDay, setEditingDay] = useState<WeddingDay | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    estimatedGuests: '',
    budget: '',
    isMainDay: false
  })

  // Load data
  useEffect(() => {
    if (session) {
      fetchAllData()
    }
  }, [session])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchWeddingDays(),
        fetchEvents(),
        fetchTasks()
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchWeddingDays = async () => {
    try {
      const response = await fetch('/api/wedding-days')
      if (response.ok) {
        const data = await response.json()
        setWeddingDays(data.sort((a: WeddingDay, b: WeddingDay) => a.order - b.order))
      }
    } catch (error) {
      console.error('Error fetching wedding days:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchTasks = async () => {
    // Simulated tasks for now
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Confirmer le lieu de réception',
        category: 'venue',
        priority: 'urgent',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignee: 'Les deux',
        estimatedBudget: 3000,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Dégustation traiteur',
        description: 'Tester les menus proposés',
        category: 'catering',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assignee: 'Les deux',
        estimatedBudget: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Essayage robe de mariée',
        category: 'attire',
        priority: 'medium',
        status: 'done',
        completedAt: new Date().toISOString(),
        assignee: 'Mariée',
        estimatedBudget: 1200,
        createdAt: new Date().toISOString()
      }
    ]
    setTasks(sampleTasks)
  }

  // Handlers for wedding days
  const handleSubmitDay = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingDay ? `/api/wedding-days/${editingDay.id}` : '/api/wedding-days'
      const method = editingDay ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedGuests: formData.estimatedGuests ? parseInt(formData.estimatedGuests) : 0,
          budget: formData.budget ? parseFloat(formData.budget) : 0
        }),
      })

      if (response.ok) {
        await fetchWeddingDays()
        handleCloseModal()
      }
    } catch (error) {
      console.error('Error saving wedding day:', error)
    }
  }

  const handleDeleteDay = async (dayId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette journée de mariage ?')) return

    try {
      const response = await fetch(`/api/wedding-days/${dayId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWeddingDays(weddingDays.filter(day => day.id !== dayId))
      }
    } catch (error) {
      console.error('Error deleting wedding day:', error)
    }
  }

  const handleEditDay = (day: WeddingDay) => {
    setEditingDay(day)
    setFormData({
      name: day.name,
      date: day.date.split('T')[0],
      location: day.location || '',
      description: day.description || '',
      estimatedGuests: day.estimatedGuests?.toString() || '',
      budget: day.budget?.toString() || '',
      isMainDay: day.isMainDay
    })
    setShowAddModal(true)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingDay(null)
    setFormData({
      name: '',
      date: '',
      location: '',
      description: '',
      estimatedGuests: '',
      budget: '',
      isMainDay: false
    })
  }

  // Handlers for events
  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setModalMode('create')
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setModalMode('edit')
    setShowEventModal(true)
  }

  const handleSaveEvent = async (eventData: any) => {
    try {
      const url = modalMode === 'create' ? '/api/events' : `/api/events/${selectedEvent?.id}`
      const method = modalMode === 'create' ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        await fetchEvents()
        setShowEventModal(false)
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const toggleEventCompletion = async (event: Event) => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, isCompleted: !event.isCompleted }),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setEvents(events.map(e => e.id === event.id ? updatedEvent : e))
      }
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  // Handlers for tasks
  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : undefined }
        : task
    ))
  }

  // Add to budget handler
  const handleAddToBudget = async (suggestion: any, dayId?: string) => {
    try {
      const budgetItem = {
        title: suggestion.title,
        category: suggestion.category,
        estimatedCost: suggestion.estimatedBudget,
        actualCost: null,
        paidAmount: null,
        vendor: null,
        notes: suggestion.description,
        isPaid: false,
        weddingDayId: dayId || null
      }
      
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetItem),
      })
      
      if (response.ok) {
        router.push('/dashboard/budget')
      }
    } catch (error) {
      console.error('Error adding suggestion to budget:', error)
    }
  }

  // Utils
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}€`
  }

  const getTimeUntilWedding = () => {
    const mainDay = weddingDays.find(day => day.isMainDay)
    if (!mainDay) return null
    
    const weddingDate = new Date(mainDay.date)
    const now = new Date()
    const diffTime = weddingDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: 'Marié(e) !', emoji: '🎊', color: 'text-green-500' }
    if (diffDays === 0) return { text: 'Aujourd\'hui !', emoji: '💒', color: 'text-red-500' }
    if (diffDays === 1) return { text: 'Demain !', emoji: '💍', color: 'text-orange-500' }
    if (diffDays < 7) return { text: `Dans ${diffDays} jours !`, emoji: '🎯', color: 'text-yellow-500' }
    if (diffDays < 30) return { text: `Dans ${diffDays} jours`, emoji: '📅', color: 'text-blue-500' }
    if (diffDays < 365) return { text: `Dans ${Math.round(diffDays/30)} mois`, emoji: '🗓️', color: 'text-purple-500' }
    return { text: `Dans ${Math.round(diffDays/365)} an(s)`, emoji: '📆', color: 'text-gray-500' }
  }

  // Calculate stats
  const calculateStats = () => {
    const totalBudget = weddingDays.reduce((sum, day) => sum + (day.budget || 0), 0)
    const totalGuests = weddingDays.reduce((sum, day) => sum + (day.estimatedGuests || 0), 0)
    const completedEvents = events.filter(e => e.isCompleted).length
    const totalEvents = events.length
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const totalTasks = tasks.length
    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length

    const categoriesWithStats = Object.values(CATEGORIES).map(cat => {
      const categoryTasks = tasks.filter(t => t.category === cat.id)
      const completed = categoryTasks.filter(t => t.status === 'done').length
      const urgent = categoryTasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length
      return {
        ...cat,
        totalTasks: categoryTasks.length,
        completedTasks: completed,
        urgentTasks: urgent,
        progress: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
      }
    })

    return {
      totalBudget,
      totalGuests,
      completedEvents,
      totalEvents,
      completedTasks,
      totalTasks,
      urgentTasks,
      eventProgress: totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0,
      taskProgress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      categories: categoriesWithStats
    }
  }

  const stats = calculateStats()
  const countdown = getTimeUntilWedding()

  if (!session) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">Chargement de votre planning de mariage...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Epic Header */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ClipboardDocumentListIcon className="h-8 w-8" />
                  </div>
                  <h1 className="text-4xl font-bold">Planning de Mariage</h1>
                  <SparklesIcon className="h-8 w-8 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-purple-100 text-lg max-w-2xl">
                  Organisez votre mariage de rêve avec notre système de planning intelligent et créatif
                </p>
              </div>
              
              {countdown && (
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                    <div className="text-5xl mb-2">{countdown.emoji}</div>
                    <div className={`text-3xl font-bold ${countdown.color}`}>{countdown.text}</div>
                    {weddingDays.find(day => day.isMainDay) && (
                      <div className="text-sm opacity-90 mt-2">
                        {formatDate(weddingDays.find(day => day.isMainDay)!.date)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{stats.totalEvents}</div>
                    <div className="text-sm opacity-90">Événements</div>
                  </div>
                  <CalendarDaysIcon className="h-8 w-8 opacity-70" />
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div 
                    className="h-2 bg-white rounded-full transition-all duration-500"
                    style={{ width: `${stats.eventProgress}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{stats.totalTasks}</div>
                    <div className="text-sm opacity-90">Tâches</div>
                  </div>
                  <CheckIcon className="h-8 w-8 opacity-70" />
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div 
                    className="h-2 bg-white rounded-full transition-all duration-500"
                    style={{ width: `${stats.taskProgress}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{formatCurrency(stats.totalBudget)}</div>
                    <div className="text-sm opacity-90">Budget total</div>
                  </div>
                  <CurrencyDollarIcon className="h-8 w-8 opacity-70" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{stats.totalGuests}</div>
                    <div className="text-sm opacity-90">Invités</div>
                  </div>
                  <UserGroupIcon className="h-8 w-8 opacity-70" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 text-white opacity-10 text-[200px] rotate-12">💒</div>
          <div className="absolute top-20 right-20 text-white opacity-20 text-6xl animate-pulse">💍</div>
          <div className="absolute bottom-10 right-1/3 text-white opacity-20 text-4xl animate-bounce">🎊</div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'overview'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Vue d'ensemble</span>
            </button>

            <button
              onClick={() => setActiveView('timeline')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'timeline'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ClockIcon className="h-5 w-5" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'calendar'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Calendrier</span>
            </button>

            <button
              onClick={() => setActiveView('kanban')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'kanban'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setActiveView('days')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'days'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <CalendarDaysIcon className="h-5 w-5" />
              <span>Multi-jours ({weddingDays.length})</span>
            </button>

            <button
              onClick={() => setActiveView('suggestions')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeView === 'suggestions'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <LightBulbIcon className="h-5 w-5" />
              <span>Suggestions</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {activeView === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleCreateEvent}
                className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-semibold mb-2">Nouvel événement</div>
                    <div className="text-sm opacity-90">Ajouter un événement à votre timeline</div>
                  </div>
                  <CalendarDaysIcon className="h-10 w-10 opacity-80" />
                </div>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-semibold mb-2">Nouvelle journée</div>
                    <div className="text-sm opacity-90">Organiser un jour de célébration</div>
                  </div>
                  <PlusIcon className="h-10 w-10 opacity-80" />
                </div>
              </button>

              <button
                onClick={() => router.push('/dashboard/budget')}
                className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg font-semibold mb-2">Gérer le budget</div>
                    <div className="text-sm opacity-90">Suivre vos dépenses en détail</div>
                  </div>
                  <CurrencyDollarIcon className="h-10 w-10 opacity-80" />
                </div>
              </button>
            </div>

            {/* Categories Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <DocumentCheckIcon className="h-6 w-6 text-purple-500 mr-2" />
                Progression par catégorie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{category.emoji}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                      </div>
                      {category.urgentTasks > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {category.urgentTasks} urgent
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{category.completedTasks}/{category.totalTasks} tâches</span>
                        <span>{category.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 bg-${category.color}-500`}
                          style={{ width: `${category.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Tasks */}
            {stats.urgentTasks > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 flex items-center">
                    <FireIcon className="h-6 w-6 mr-2" />
                    Tâches urgentes ({stats.urgentTasks})
                  </h3>
                  <button
                    onClick={() => setActiveView('kanban')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Voir toutes →
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{CATEGORIES[task.category]?.emoji}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                          {task.dueDate && (
                            <div className="text-sm text-gray-500">
                              Échéance: {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                      >
                        Commencer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Events */}
            {events.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Prochains événements
                  </h3>
                  <button
                    onClick={() => setActiveView('timeline')}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {events
                    .filter(e => !e.isCompleted && e.date)
                    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
                    .slice(0, 5)
                    .map(event => {
                      const eventType = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.OTHER
                      return (
                        <div key={event.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{eventType.emoji}</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                              <div className="text-sm text-gray-500">
                                {event.date && formatDate(event.date)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleEventCompletion(event)}
                            className="p-2 text-gray-400 hover:text-green-500"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timeline des événements</h2>
              <button
                onClick={handleCreateEvent}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Nouvel événement</span>
              </button>
            </div>

            {/* Events Timeline */}
            <div className="space-y-8">
              {/* Today's Events */}
              {events.filter(e => e.date && new Date(e.date).toDateString() === new Date().toDateString()).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Aujourd'hui - C'est le Jour J !
                  </h3>
                  <div className="space-y-4">
                    {events
                      .filter(e => e.date && new Date(e.date).toDateString() === new Date().toDateString())
                      .map(event => {
                        const eventType = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.OTHER
                        return (
                          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${eventType.color} text-white`}>
                                  <span className="text-2xl">{eventType.emoji}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {event.time && (
                                      <span className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {event.time.slice(0, 5)}
                                      </span>
                                    )}
                                    {event.location && (
                                      <span className="flex items-center">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleEventCompletion(event)}
                                  className="p-2 text-gray-400 hover:text-green-500"
                                >
                                  <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="p-2 text-gray-400 hover:text-blue-500"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2 text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {events.filter(e => !e.isCompleted && e.date && new Date(e.date) > new Date()).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Événements à venir
                  </h3>
                  <div className="space-y-4">
                    {events
                      .filter(e => !e.isCompleted && e.date && new Date(e.date) > new Date())
                      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
                      .map(event => {
                        const eventType = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.OTHER
                        return (
                          <div key={event.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => toggleEventCompletion(event)}
                                  className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center"
                                >
                                  {event.isCompleted && (
                                    <CheckIconSolid className="h-4 w-4 text-green-500" />
                                  )}
                                </button>
                                <div className={`p-2 rounded-lg ${eventType.color} text-white`}>
                                  <span className="text-lg">{eventType.emoji}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {event.date && (
                                      <span className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        {formatDate(event.date)}
                                      </span>
                                    )}
                                    {event.time && (
                                      <span className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {event.time.slice(0, 5)}
                                      </span>
                                    )}
                                    {event.location && (
                                      <span className="flex items-center">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {event.location}
                                      </span>
                                    )}
                                  </div>
                                  {event.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{event.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="p-2 text-gray-400 hover:text-blue-500"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2 text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Completed Events */}
              {events.filter(e => e.isCompleted).length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                    Événements terminés
                  </h3>
                  <div className="space-y-3">
                    {events
                      .filter(e => e.isCompleted)
                      .map(event => {
                        const eventType = EVENT_TYPES[event.type as keyof typeof EVENT_TYPES] || EVENT_TYPES.OTHER
                        return (
                          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 opacity-75">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <CheckIconSolid className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-lg">{eventType.emoji}</span>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white line-through">{event.title}</h4>
                                  {event.date && (
                                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => toggleEventCompletion(event)}
                                className="p-1 text-gray-400 hover:text-blue-500"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucun événement planifié
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Commencez à organiser votre mariage en ajoutant vos premiers événements !
                  </p>
                  <button
                    onClick={handleCreateEvent}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600"
                  >
                    Créer votre premier événement
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vue Calendrier</h2>
              <div className="text-center py-20 text-gray-500">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>La vue calendrier arrive bientôt !</p>
                <p className="text-sm mt-2">En attendant, utilisez la timeline pour voir vos événements</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'kanban' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tableau des tâches</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">À faire</h3>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                    {tasks.filter(t => t.status === 'todo').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'todo').map(task => (
                    <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xl">{CATEGORIES[task.category]?.emoji}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority === 'urgent' ? 'Urgent' :
                           task.priority === 'high' ? 'Haute' :
                           task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatDate(task.dueDate)}
                        </p>
                      )}
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                        className="mt-3 w-full py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Commencer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">En cours</h3>
                  <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'in_progress').map(task => (
                    <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xl">{CATEGORIES[task.category]?.emoji}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority === 'urgent' ? 'Urgent' :
                           task.priority === 'high' ? 'Haute' :
                           task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                      )}
                      {task.assignee && (
                        <p className="text-xs text-gray-500 mb-2">Assigné à: {task.assignee}</p>
                      )}
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'done')}
                        className="mt-3 w-full py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Terminer
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done Column */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Terminé</h3>
                  <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">
                    {tasks.filter(t => t.status === 'done').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(t => t.status === 'done').map(task => (
                    <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm opacity-75">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xl opacity-50">{CATEGORIES[task.category]?.emoji}</span>
                        <CheckIconSolid className="h-5 w-5 text-green-500" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-through">{task.title}</h4>
                      {task.completedAt && (
                        <p className="text-xs text-gray-500">
                          Terminé le {formatDate(task.completedAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'days' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Journées de mariage</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Ajouter une journée</span>
              </button>
            </div>

            {weddingDays.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                <CalendarDaysIcon className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Aucune journée planifiée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Créez votre première journée de mariage pour commencer l'organisation !
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600"
                >
                  Créer votre première journée
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {weddingDays.map((day) => (
                  <div
                    key={day.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-lg ${
                      day.isMainDay ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' : 'border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {day.isMainDay && <StarIcon className="h-6 w-6 text-purple-500" />}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {day.name}
                            {day.isMainDay && <span className="ml-2 text-sm text-purple-600 dark:text-purple-400">Principal</span>}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(day.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDay(day)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDay(day.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {day.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{day.location}</span>
                      </div>
                    )}

                    {day.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {day.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {day.estimatedGuests || 0} invités
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(day.budget || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/dashboard/budget?weddingDay=${day.id}`)}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <BanknotesIcon className="h-4 w-4" />
                      <span>Gérer le budget</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'suggestions' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Suggestions rapides
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ajoutez rapidement les éléments essentiels à votre budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-lg ${
                    suggestion.priority === 'high' ? 'border-red-200' :
                    suggestion.priority === 'medium' ? 'border-yellow-200' :
                    'border-green-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{suggestion.emoji}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {suggestion.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {suggestion.priority === 'high' ? 'Priorité haute' :
                           suggestion.priority === 'medium' ? 'Priorité moyenne' :
                           'Priorité basse'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {suggestion.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium text-green-600">
                        Budget estimé: {formatCurrency(suggestion.estimatedBudget)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToBudget(suggestion)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Ajouter au budget général</span>
                    </button>
                    
                    {weddingDays.length > 0 && (
                      <select
                        onChange={(e) => e.target.value && handleAddToBudget(suggestion, e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
                        defaultValue=""
                      >
                        <option value="">Ou ajouter à une journée spécifique...</option>
                        {weddingDays.map((day) => (
                          <option key={day.id} value={day.id}>
                            {day.name} - {formatDate(day.date)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
              <div className="flex items-start space-x-4">
                <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3">
                    Conseils pour votre planning
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800 dark:text-purple-400">
                    <div className="space-y-2">
                      <p>
                        <strong>12-18 mois avant:</strong> Réservez le lieu et les prestataires principaux
                      </p>
                      <p>
                        <strong>6-9 mois avant:</strong> Choisissez vos tenues et envoyez les faire-parts
                      </p>
                      <p>
                        <strong>3-6 mois avant:</strong> Finalisez les détails (menu, décoration, musique)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>1-3 mois avant:</strong> Essayages finaux et confirmations
                      </p>
                      <p>
                        <strong>1 mois avant:</strong> Derniers ajustements et répétitions
                      </p>
                      <p>
                        <strong>Jour J:</strong> Profitez de votre journée magique !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Day Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingDay ? 'Modifier la journée' : 'Nouvelle journée'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitDay} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de la journée
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="ex: Cérémonie Religieuse, Henné, Réception..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lieu (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nom du lieu, adresse..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nb invités
                      </label>
                      <input
                        type="number"
                        value={formData.estimatedGuests}
                        onChange={(e) => setFormData({ ...formData, estimatedGuests: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Budget (€)
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Détails sur cette journée..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isMainDay"
                      checked={formData.isMainDay}
                      onChange={(e) => setFormData({ ...formData, isMainDay: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isMainDay" className="ml-2 block text-sm text-gray-900 dark:text-white">
                      Journée principale du mariage
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                    >
                      {editingDay ? 'Modifier' : 'Créer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Event Modal */}
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={handleSaveEvent}
          event={selectedEvent}
          mode={modalMode}
        />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </DashboardLayout>
  )
}
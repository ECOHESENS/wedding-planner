'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import MessageThread from '@/components/ui/MessageThread'
import { 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Conversation {
  couple: {
    id: string
    brideName: string
    groomName: string
    bride: { name: string }
    planner: { name: string } | null
  }
  messages: any[]
  lastMessage: {
    content: string
    createdAt: string
    isFromPlanner: boolean
    sender: { name: string }
  } | null
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Record<string, Conversation>>({})
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        
        if (session?.user.role === 'PLANNER' && data.messagesByCouple) {
          setConversations(data.messagesByCouple)
          // Auto-select first conversation if none selected
          const firstConversationId = Object.keys(data.messagesByCouple)[0]
          if (firstConversationId && !selectedConversation) {
            setSelectedConversation(firstConversationId)
          }
        } else if (session?.user.role === 'CLIENT') {
          // For clients, create a single conversation with their planner
          const messages = data.messages
          if (messages.length > 0) {
            const coupleId = messages[0].coupleId
            const conversation = {
              couple: messages[0].couple,
              messages,
              lastMessage: messages[messages.length - 1],
              unreadCount: 0
            }
            setConversations({ [coupleId]: conversation })
            setSelectedConversation(coupleId)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInDays === 1) {
      return 'Hier'
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  }

  const getConversationName = (conversation: Conversation) => {
    if (session?.user.role === 'PLANNER') {
      return `${conversation.couple.brideName} & ${conversation.couple.groomName}`
    } else {
      return conversation.couple.planner?.name || 'Wedding Planner'
    }
  }

  if (!session) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  const conversationEntries = Object.entries(conversations)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-blue-100 mt-1">
                {session.user.role === 'PLANNER' 
                  ? 'Communiquez avec vos clients'
                  : 'Échangez avec votre wedding planner'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        {conversationEntries.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              {/* Conversations List (for planner) */}
              {session.user.role === 'PLANNER' && conversationEntries.length > 1 && (
                <div className="w-80 border-r border-gray-200 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Conversations</h3>
                    <p className="text-sm text-gray-600">{conversationEntries.length} clients</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {conversationEntries.map(([coupleId, conversation]) => (
                      <button
                        key={coupleId}
                        onClick={() => setSelectedConversation(coupleId)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedConversation === coupleId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {conversation.couple.brideName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {getConversationName(conversation)}
                            </h4>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.isFromPlanner ? 'Vous: ' : ''}
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Thread */}
              <div className="flex-1 flex flex-col">
                {selectedConversation && conversations[selectedConversation] ? (
                  <MessageThread
                    coupleId={selectedConversation}
                    coupleName={session.user.role === 'PLANNER' ? getConversationName(conversations[selectedConversation]) : undefined}
                    onNewMessage={fetchConversations}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
            <div className="space-y-4">
              {session.user.role === 'PLANNER' ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Vos conversations avec vos clients apparaîtront ici une fois qu'ils vous auront été assignés.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex">
                      <ClockIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Comment recevoir des messages ?</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Les couples doivent d'abord créer leur profil et vous être assignés comme wedding planner.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Vous pourrez échanger avec votre wedding planner une fois qu'il vous aura été assigné.
                  </p>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex">
                      <UserCircleIcon className="h-5 w-5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-rose-900">Pas encore de wedding planner ?</h4>
                        <p className="text-sm text-rose-700 mt-1">
                          Complétez votre profil de couple pour pouvoir être assigné à un wedding planner.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
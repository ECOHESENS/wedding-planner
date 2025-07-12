'use client'

import { useState } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  TagIcon,
  EyeIcon,
  EyeSlashIcon,
  ShareIcon,
  HeartIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { JournalEntry, JOURNAL_MOODS, JOURNAL_CATEGORIES } from '@/types/journal'
import { useLanguage } from '@/contexts/LanguageContext'

interface JournalEntryCardProps {
  entry: JournalEntry
  onEdit: (entry: JournalEntry) => void
  onDelete: (entryId: string) => void
}

export default function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryCardProps) {
  const { isRTL } = useLanguage()
  const [showFullContent, setShowFullContent] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 20) + 1)

  const mood = JOURNAL_MOODS[entry.mood]
  const category = JOURNAL_CATEGORIES[entry.category as keyof typeof JOURNAL_CATEGORIES]
  
  const truncatedContent = entry.content.length > 150 
    ? entry.content.substring(0, 150) + '...'
    : entry.content

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûre de vouloir supprimer ce moment ?')) {
      onDelete(entry.id)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                {mood.label}
              </span>
              {entry.isPrivate ? (
                <EyeSlashIcon className="h-4 w-4 text-gray-400" title="Moment privé" />
              ) : (
                <div className="flex items-center space-x-1">
                  <ShareIcon className="h-4 w-4 text-green-500" title="Partageable" />
                  <span className="text-xs text-green-600">Public</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {entry.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onEdit(entry)}
              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Date and Milestone */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{formatDate(entry.date)}</span>
          </div>
          {entry.milestone && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded text-xs font-medium">
              {entry.milestone}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {showFullContent ? entry.content : truncatedContent}
          </p>
          {entry.content.length > 150 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 text-sm font-medium mt-2"
            >
              {showFullContent ? 'Voir moins' : 'Lire la suite'}
            </button>
          )}
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 flex-wrap">
              <TagIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {entry.images && entry.images.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              {entry.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  {index === 3 && entry.images!.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        +{entry.images!.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsLiked(!isLiked)
                setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
              }}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-4 w-4" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button
              onClick={() => {
                const text = `💕 ${entry.title}\n\n${entry.content}\n\n📅 ${formatDate(entry.date)}\n\n🎊 Découvrez plus de moments sur notre timeline de mariage !`
                const url = `whatsapp://send?text=${encodeURIComponent(text)}`
                window.open(url, '_blank')
              }}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
              title="Partager sur WhatsApp"
            >
              <span className="text-sm">📱</span>
              <span className="text-sm">WhatsApp</span>
            </button>
            
            {entry.images && entry.images.length > 0 && (
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <PhotoIcon className="h-4 w-4" />
                <span className="text-sm">{entry.images.length} photo{entry.images.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>
              {new Date(entry.updatedAt).getTime() !== new Date(entry.createdAt).getTime() 
                ? `Modifié le ${new Intl.DateTimeFormat('fr-FR').format(new Date(entry.updatedAt))}`
                : `Créé le ${new Intl.DateTimeFormat('fr-FR').format(new Date(entry.createdAt))}`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
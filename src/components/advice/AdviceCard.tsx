'use client'

import { useState } from 'react'
import { 
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid 
} from '@heroicons/react/24/solid'
import { AdviceItem, ADVICE_CATEGORIES, ADVICE_TYPES } from '@/types/advice'

interface AdviceCardProps {
  advice: AdviceItem
  onLike: (id: string) => void
  onBookmark?: (id: string) => void
  onShare?: (id: string) => void
  className?: string
}

export default function AdviceCard({ 
  advice, 
  onLike, 
  onBookmark, 
  onShare, 
  className = '' 
}: AdviceCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(advice.likes)

  const handleLike = () => {
    if (!isLiked) {
      setCurrentLikes(prev => prev + 1)
      onLike(advice.id)
    }
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(advice.id)
  }

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && 'share' in navigator) {
        await navigator.share({
          title: advice.title,
          text: advice.summary,
          url: window.location.href
        })
      } else if (typeof window !== 'undefined' && 'clipboard' in navigator) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`${advice.title}\n\n${advice.summary}\n\n${window.location.href}`)
      } else {
        // Final fallback - create a text selection
        const textArea = document.createElement('textarea')
        textArea.value = `${advice.title}\n\n${advice.summary}\n\n${window.location.href}`
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
    onShare?.(advice.id)
  }

  const getCategoryInfo = () => {
    return ADVICE_CATEGORIES[advice.category]
  }

  const getTypeInfo = () => {
    return ADVICE_TYPES[advice.type]
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Débutant'
      case 'intermediate':
        return 'Intermédiaire'
      case 'advanced':
        return 'Avancé'
      default:
        return 'Tous niveaux'
    }
  }

  const getCultureFlag = (culture?: string) => {
    switch (culture) {
      case 'moroccan':
        return '🇲🇦'
      case 'tunisian':
        return '🇹🇳'
      case 'algerian':
        return '🇩🇿'
      default:
        return '🌍'
    }
  }

  const getCultureLabel = (culture?: string) => {
    switch (culture) {
      case 'moroccan':
        return 'Maroc'
      case 'tunisian':
        return 'Tunisie'
      case 'algerian':
        return 'Algérie'
      default:
        return 'Général'
    }
  }

  const categoryInfo = getCategoryInfo()
  const typeInfo = getTypeInfo()

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{categoryInfo.icon}</span>
              <span className="text-lg">{typeInfo.icon}</span>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                categoryInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                categoryInfo.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                categoryInfo.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                categoryInfo.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                categoryInfo.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                categoryInfo.color === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                categoryInfo.color === 'pink' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {categoryInfo.label}
              </span>
            </div>
          </div>
          
          {advice.isPopular && (
            <div className="flex items-center space-x-1 text-yellow-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium">Populaire</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {advice.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {advice.summary}
        </p>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          {advice.timeline && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-3 w-3" />
              <span>{advice.timeline}</span>
            </div>
          )}
          
          {advice.estimatedTime && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3" />
              <span>{advice.estimatedTime}</span>
            </div>
          )}
          
          {advice.difficulty && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(advice.difficulty)}`}>
              {getDifficultyLabel(advice.difficulty)}
            </span>
          )}
          
          {advice.culture && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{getCultureFlag(advice.culture)}</span>
              <span>{getCultureLabel(advice.culture)}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {advice.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {advice.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {advice.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                +{advice.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-4 prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {advice.content}
            </div>
            
            {advice.resources && advice.resources.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ressources utiles :</h4>
                <ul className="space-y-1">
                  {advice.resources.map((resource, index) => (
                    <li key={index} className="text-sm text-indigo-600 dark:text-indigo-400">
                      <a href={resource} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{currentLikes}</span>
            </button>
            
            <button
              onClick={handleBookmark}
              className={`transition-colors ${
                isBookmarked 
                  ? 'text-indigo-500 hover:text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400'
              }`}
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <UserIcon className="h-3 w-3" />
              <span>Expert</span>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              {isExpanded ? 'Réduire' : 'Lire plus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { 
  StarIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { AdviceItem, ADVICE_CATEGORIES, ADVICE_TYPES } from '@/types/advice'

interface FeaturedAdviceProps {
  advice: AdviceItem[]
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
  className?: string
}

export default function FeaturedAdvice({ 
  advice, 
  onLike, 
  onBookmark, 
  className = '' 
}: FeaturedAdviceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % advice.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + advice.length) % advice.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const getCategoryInfo = (category: string) => {
    return ADVICE_CATEGORIES[category as keyof typeof ADVICE_CATEGORIES]
  }

  const getTypeInfo = (type: string) => {
    return ADVICE_TYPES[type as keyof typeof ADVICE_TYPES]
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

  if (advice.length === 0) {
    return null
  }

  return (
    <div className={`bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/10 dark:via-orange-900/10 dark:to-red-900/10 rounded-2xl border border-amber-200 dark:border-amber-800 ${className}`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2">
              <StarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Conseils à la une
              </h2>
              <p className="text-amber-700 dark:text-amber-300">
                Les conseils les plus appréciés par notre communauté
              </p>
            </div>
          </div>
          
          {advice.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {advice.map((item, index) => {
                const categoryInfo = getCategoryInfo(item.category)
                const typeInfo = getTypeInfo(item.type)
                
                return (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Content */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{categoryInfo.icon}</span>
                            <span className="text-xl">{typeInfo.icon}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              categoryInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              categoryInfo.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              categoryInfo.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              categoryInfo.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              categoryInfo.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              categoryInfo.color === 'amber' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {categoryInfo.label}
                            </span>
                            
                            {item.culture && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {getCultureFlag(item.culture)} {getCultureLabel(item.culture)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {item.title}
                          </h3>
                          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                          {item.timeline && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>{item.timeline}</span>
                            </div>
                          )}
                          
                          {item.estimatedTime && (
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-4 w-4" />
                              <span>{item.estimatedTime}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>Expert</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => onLike?.(item.id)}
                              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            >
                              <HeartIcon className="h-5 w-5" />
                              <span>{item.likes}</span>
                            </button>
                            
                            <button
                              onClick={() => onBookmark?.(item.id)}
                              className="text-gray-600 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
                            >
                              <BookmarkIcon className="h-5 w-5" />
                            </button>
                            
                            <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                              <ShareIcon className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="flex-1">
                            <button className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                              <span>Lire l'article</span>
                              <ArrowRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Visual/Illustration */}
                      <div className="relative">
                        <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
                          <div className="text-center">
                            <div className="text-6xl mb-4">
                              {categoryInfo.icon}
                            </div>
                            <h4 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">
                              {categoryInfo.label}
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                              {categoryInfo.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full opacity-60"></div>
                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Indicators */}
        {advice.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {advice.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 scale-125'
                    : 'bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-amber-200 dark:border-amber-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {advice.length}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                Articles vedettes
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {advice.reduce((sum, item) => sum + item.likes, 0)}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                Likes au total
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {new Set(advice.map(item => item.category)).size}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                Catégories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
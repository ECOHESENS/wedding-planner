'use client'

import { useState } from 'react'
import { 
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  GiftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { TrousseauItem, TROUSSEAU_CATEGORIES, PRIORITY_LEVELS } from '@/types/trousseau'

interface TrousseauItemCardProps {
  item: TrousseauItem
  onEdit: (item: TrousseauItem) => void
  onDelete: (itemId: string) => void
  onTogglePurchased: (itemId: string) => void
}

export default function TrousseauItemCard({ item, onEdit, onDelete, onTogglePurchased }: TrousseauItemCardProps) {
  const [imageError, setImageError] = useState(false)

  const category = TROUSSEAU_CATEGORIES[item.category]
  const priority = PRIORITY_LEVELS[item.priority]
  
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûre de vouloir supprimer cet article ?')) {
      onDelete(item.id)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      essentiel: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      important: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      souhaite: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      luxe: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[priority as keyof typeof colors] || colors.souhaite
  }

  const formatPrice = (price?: number) => {
    return price ? `${price.toLocaleString()}€` : ''
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
      item.purchased 
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
        : 'border-gray-100 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">{category.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                {priority.label}
              </span>
              {item.isGift && (
                <GiftIcon className="h-4 w-4 text-pink-500" title="Cadeau" />
              )}
            </div>
            <h3 className={`text-lg font-semibold line-clamp-2 ${
              item.purchased ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'
            }`}>
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.label}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onTogglePurchased(item.id)}
              className={`transition-colors ${
                item.purchased
                  ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                  : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
              }`}
              title={item.purchased ? 'Marquer comme non acheté' : 'Marquer comme acheté'}
            >
              {item.purchased ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XCircleIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => onEdit(item)}
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

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Details */}
        <div className="space-y-2">
          {/* Quantity */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Quantité:</span>
            <span className={`font-medium ${
              item.quantityObtained >= item.quantity 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {item.quantityObtained}/{item.quantity}
            </span>
          </div>

          {/* Price */}
          {(item.estimatedPrice || item.actualPrice) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Prix:</span>
              <div className="text-right">
                {item.actualPrice && (
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(item.actualPrice)}
                  </div>
                )}
                {item.estimatedPrice && item.estimatedPrice !== item.actualPrice && (
                  <div className={`text-xs ${
                    item.actualPrice 
                      ? 'line-through text-gray-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Est. {formatPrice(item.estimatedPrice)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Brand, Size, Color */}
          {(item.brand || item.size || item.color) && (
            <div className="flex flex-wrap gap-1">
              {item.brand && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {item.brand}
                </span>
              )}
              {item.size && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  Taille {item.size}
                </span>
              )}
              {item.color && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {item.color}
                </span>
              )}
            </div>
          )}

          {/* Store */}
          {item.store && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Magasin:</span>
              <span className="text-gray-700 dark:text-gray-300">{item.store}</span>
            </div>
          )}

          {/* Gift Info */}
          {item.isGift && item.giftFrom && (
            <div className="flex items-center space-x-2 p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <GiftIcon className="h-4 w-4 text-pink-500 flex-shrink-0" />
              <span className="text-sm text-pink-700 dark:text-pink-300">
                Cadeau de {item.giftFrom}
              </span>
            </div>
          )}

          {/* Purchase Date */}
          {item.purchased && item.purchaseDate && (
            <div className="text-xs text-green-600 dark:text-green-400">
              Acheté le {new Intl.DateTimeFormat('fr-FR').format(new Date(item.purchaseDate))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 rounded-b-xl">
        <div className="flex items-center justify-between">
          {/* URL Link */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              <span>Voir en ligne</span>
            </a>
          )}
          
          {/* Status */}
          <div className="flex items-center space-x-2 text-xs">
            {item.purchased ? (
              <span className="text-green-600 dark:text-green-400 font-medium">✓ Obtenu</span>
            ) : (
              <span className="text-orange-600 dark:text-orange-400 font-medium">À acheter</span>
            )}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {item.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
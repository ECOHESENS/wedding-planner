'use client'

import { 
  GiftIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { TrousseauItem, PRIORITY_LEVELS } from '@/types/trousseau'

interface TrousseauStatsProps {
  items: TrousseauItem[]
}

export default function TrousseauStats({ items }: TrousseauStatsProps) {
  const totalItems = items.length
  const purchasedItems = items.filter(item => item.purchased).length
  const pendingItems = totalItems - purchasedItems
  
  const totalBudget = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)
  const actualSpent = items.reduce((sum, item) => sum + (item.actualPrice || 0), 0)
  
  const essentialItems = items.filter(item => item.priority === 'essentiel')
  const essentialPurchased = essentialItems.filter(item => item.purchased).length
  
  const giftItems = items.filter(item => item.isGift).length

  const completionRate = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0

  const stats = [
    {
      name: 'Articles Total',
      value: totalItems,
      icon: GiftIcon,
      color: 'purple'
    },
    {
      name: 'Achetés',
      value: purchasedItems,
      subtext: `${completionRate}% terminé`,
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'Budget Estimé',
      value: `${totalBudget.toLocaleString()}€`,
      subtext: actualSpent > 0 ? `${actualSpent.toLocaleString()}€ dépensé` : undefined,
      icon: CurrencyDollarIcon,
      color: 'blue'
    },
    {
      name: 'Essentiels',
      value: `${essentialPurchased}/${essentialItems.length}`,
      subtext: essentialItems.length > 0 ? `${Math.round((essentialPurchased / essentialItems.length) * 100)}% terminé` : undefined,
      icon: SparklesIcon,
      color: 'red'
    },
    {
      name: 'En attente',
      value: pendingItems,
      icon: ShoppingBagIcon,
      color: 'orange'
    },
    {
      name: 'Cadeaux',
      value: giftItems,
      icon: HeartIcon,
      color: 'pink'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              {stat.subtext && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtext}
                </p>
              )}
            </div>
            <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
          </div>
        </div>
      ))}
    </div>
  )
}
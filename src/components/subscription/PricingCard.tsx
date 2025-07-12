'use client'

import { 
  CheckIcon,
  StarIcon,
  CurrencyEuroIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { PricingTier, Subscription } from '@/types/payment'

interface PricingCardProps {
  tier: PricingTier
  isCurrentPlan: boolean
  onSelect: (planId: string) => void
  currentSubscription: Subscription | null
}

export default function PricingCard({ tier, isCurrentPlan, onSelect, currentSubscription }: PricingCardProps) {
  const getButtonText = () => {
    if (isCurrentPlan) return 'Plan actuel'
    if (!currentSubscription) return 'Commencer l\'essai gratuit'
    return 'Changer de plan'
  }

  const getButtonStyle = () => {
    if (isCurrentPlan) {
      return 'bg-gray-100 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
    }
    if (tier.popular) {
      return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
    }
    return 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:bg-gray-800 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
  }

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-lg ${
      tier.popular 
        ? 'border-indigo-300 ring-2 ring-indigo-200 dark:border-indigo-600 dark:ring-indigo-800' 
        : 'border-gray-200 dark:border-gray-700'
    } ${isCurrentPlan ? 'ring-2 ring-green-200 border-green-300 dark:ring-green-800 dark:border-green-600' : ''}`}>
      
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <StarIcon className="h-3 w-3" />
            <span>Le plus populaire</span>
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <CheckIcon className="h-3 w-3" />
            <span>Plan actuel</span>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {tier.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {tier.description}
          </p>
          
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {tier.price}
              </span>
              <div className="text-left">
                <CurrencyEuroIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {tier.id === 'monthly' ? '/mois' : tier.id === 'quarterly' ? '/3 mois' : '/an'}
                </div>
              </div>
            </div>
            
            {/* Discount Info */}
            {tier.discount > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  Prix normal: {tier.originalPrice}€
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center space-x-1">
                  <BoltIcon className="h-4 w-4" />
                  <span>Économisez {tier.savings}€ ({tier.discount}%)</span>
                </div>
              </div>
            )}
            
            {/* Monthly Equivalent */}
            {tier.id !== 'monthly' && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Soit {Math.round(tier.price / (tier.id === 'quarterly' ? 3 : 12))}€/mois
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {tier.billingCycle}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => !isCurrentPlan && onSelect(tier.id)}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${getButtonStyle()}`}
        >
          {getButtonText()}
        </button>

        {/* Additional Info */}
        {!currentSubscription && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Essai gratuit de 14 jours • Aucune carte requise
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
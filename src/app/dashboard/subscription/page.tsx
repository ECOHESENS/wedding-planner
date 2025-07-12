'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTranslations } from '@/hooks/useTranslations'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  CreditCardIcon,
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { PRICING_TIERS, PAYMENT_FEATURES, FAQ_PAYMENT, Subscription } from '@/types/payment'
import PricingCard from '@/components/subscription/PricingCard'
import BillingHistory from '@/components/subscription/BillingHistory'
import PaymentMethods from '@/components/subscription/PaymentMethods'
import SubscriptionFAQ from '@/components/subscription/SubscriptionFAQ'

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans' | 'billing' | 'methods' | 'faq'>('plans')

  useEffect(() => {
    if (session) {
      fetchSubscription()
    }
  }, [session])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaymentForm(true)
  }

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })
      
      if (response.ok) {
        await fetchSubscription()
        setShowPaymentForm(false)
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan === planId
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'Actif', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      past_due: { label: 'En retard', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      trialing: { label: 'Essai gratuit', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      incomplete: { label: 'Incomplet', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
    }
    
    const badge = badges[status as keyof typeof badges] || badges.incomplete
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  if (!session) return null

  return (
    <DashboardLayout>
      <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <CreditCardIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Abonnement & Facturation</h1>
            </div>
            <p className="text-indigo-100 text-lg">
              Gérez votre abonnement et accédez à toutes les fonctionnalités premium
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Abonnement actuel
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-indigo-600">
                    {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.name}
                  </span>
                  {getStatusBadge(currentSubscription.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Période actuelle: {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} - {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.price}€
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {PRICING_TIERS.find(tier => tier.id === currentSubscription.plan)?.billingCycle}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'plans', label: 'Plans tarifaires', icon: CurrencyEuroIcon },
              { id: 'billing', label: 'Historique', icon: CalendarDaysIcon },
              { id: 'methods', label: 'Moyens de paiement', icon: CreditCardIcon },
              { id: 'faq', label: 'FAQ', icon: QuestionMarkCircleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' && (
          <div className="space-y-8">
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  isCurrentPlan={isCurrentPlan(tier.id)}
                  onSelect={handleSelectPlan}
                  currentSubscription={currentSubscription}
                />
              ))}
            </div>

            {/* Features Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comparaison des fonctionnalités
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Fonctionnalités
                      </th>
                      {PRICING_TIERS.map((tier) => (
                        <th key={tier.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      'Gestion illimitée d\'invités',
                      'Planning personnalisé',
                      'Budget en temps réel',
                      'Journal de préparation',
                      'Conseils culturels',
                      'Support prioritaire',
                      'Consultation personnalisée',
                      'Coach mariage personnel',
                      'Kit physique inclus'
                    ].map((feature, index) => (
                      <tr key={feature}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {feature}
                        </td>
                        {PRICING_TIERS.map((tier) => (
                          <td key={tier.id} className="px-6 py-4 text-center">
                            {index < (tier.id === 'monthly' ? 5 : tier.id === 'quarterly' ? 7 : 9) ? (
                              <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Security */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <ShieldCheckIcon className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                  Sécurité
                </h3>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-400">
                  {PAYMENT_FEATURES.security.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <CreditCardIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Moyens de paiement
                </h3>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                  {PAYMENT_FEATURES.methods.map((method, index) => (
                    <li key={index}>• {method}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <BoltIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Flexibilité
                </h3>
                <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-400">
                  {PAYMENT_FEATURES.flexibility.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <BillingHistory />
        )}

        {activeTab === 'methods' && (
          <PaymentMethods />
        )}

        {activeTab === 'faq' && (
          <SubscriptionFAQ faqs={FAQ_PAYMENT} />
        )}
      </div>
    </DashboardLayout>
  )
}
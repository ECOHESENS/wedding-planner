'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  StarIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { PaymentMethod } from '@/types/payment'

interface PaymentMethodsProps {
  className?: string
}

export default function PaymentMethods({ className = '' }: PaymentMethodsProps) {
  const { data: session } = useSession()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchPaymentMethods()
    }
  }, [session])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods')
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.paymentMethods || [])
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (methodId: string) => {
    setProcessingId(methodId)
    try {
      const response = await fetch(`/api/payment-methods/${methodId}/default`, {
        method: 'POST',
      })
      if (response.ok) {
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.error('Error setting default payment method:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (methodId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) {
      return
    }

    setProcessingId(methodId)
    try {
      const response = await fetch(`/api/payment-methods/${methodId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const getCardIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  const getMethodTypeLabel = (type: string) => {
    switch (type) {
      case 'card':
        return 'Carte bancaire'
      case 'sepa':
        return 'Prélèvement SEPA'
      case 'paypal':
        return 'PayPal'
      default:
        return 'Inconnu'
    }
  }

  const getMethodTypeColor = (type: string) => {
    switch (type) {
      case 'card':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'sepa':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'paypal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement des moyens de paiement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Moyens de paiement
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gérez vos cartes bancaires et autres moyens de paiement
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-900 dark:text-green-300">
              Sécurité des paiements
            </h4>
            <p className="text-sm text-green-800 dark:text-green-400 mt-1">
              Toutes vos informations de paiement sont sécurisées et cryptées. Nous ne stockons jamais vos numéros de carte complets.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucun moyen de paiement
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ajoutez une carte bancaire ou un autre moyen de paiement pour faciliter vos paiements.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Ajouter un moyen de paiement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                method.isDefault
                  ? 'border-indigo-300 ring-2 ring-indigo-200 dark:border-indigo-600 dark:ring-indigo-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {method.type === 'card' ? (
                        <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <span className="text-2xl">{getCardIcon(method.brand || '')}</span>
                        </div>
                      ) : method.type === 'sepa' ? (
                        <div className="w-12 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                          <span className="text-xl">🏦</span>
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                          <span className="text-xl">🅿️</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {method.type === 'card' && method.brand && (
                            <span className="capitalize">{method.brand}</span>
                          )}
                          {method.type === 'card' && method.last4 && (
                            <span> •••• {method.last4}</span>
                          )}
                          {method.type !== 'card' && getMethodTypeLabel(method.type)}
                        </h4>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodTypeColor(method.type)}`}>
                          {getMethodTypeLabel(method.type)}
                        </span>
                        
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Par défaut
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Expire {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Ajouté le {new Date(method.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={processingId === method.id}
                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Définir par défaut</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(method.id)}
                      disabled={processingId === method.id}
                      className="flex items-center space-x-1 px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ajouter un moyen de paiement
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="sr-only">Fermer</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => {
                    // Redirect to Stripe/payment processor
                    window.location.href = '/api/payment-methods/setup?type=card'
                  }}
                  className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Carte bancaire</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, American Express</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // Redirect to SEPA setup
                    window.location.href = '/api/payment-methods/setup?type=sepa'
                  }}
                  className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl">🏦</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Prélèvement SEPA</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Compte bancaire européen</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    // Redirect to PayPal setup
                    window.location.href = '/api/payment-methods/setup?type=paypal'
                  }}
                  className="flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-2xl">🅿️</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">PayPal</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Compte PayPal</div>
                  </div>
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
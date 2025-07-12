'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { Invoice, BillingHistory as BillingHistoryType } from '@/types/payment'

interface BillingHistoryProps {
  className?: string
}

export default function BillingHistory({ className = '' }: BillingHistoryProps) {
  const { data: session } = useSession()
  const [billingHistory, setBillingHistory] = useState<BillingHistoryType | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session) {
      fetchBillingHistory()
    }
  }, [session])

  const fetchBillingHistory = async () => {
    try {
      const response = await fetch('/api/billing/history')
      if (response.ok) {
        const data = await response.json()
        setBillingHistory(data)
      }
    } catch (error) {
      console.error('Error fetching billing history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingIds(prev => new Set(prev).add(invoiceId))
    
    try {
      const response = await fetch(`/api/billing/invoice/${invoiceId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `facture-${invoiceId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading invoice:', error)
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(invoiceId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée'
      case 'failed':
        return 'Échouée'
      case 'pending':
        return 'En attente'
      default:
        return 'Inconnu'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement de l'historique...</span>
        </div>
      </div>
    )
  }

  if (!billingHistory) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center ${className}`}>
        <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun historique de facturation
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Votre historique de facturation apparaîtra ici après votre premier paiement.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total payé</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {billingHistory.totalPaid.toFixed(2)}€
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Factures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {billingHistory.invoices.length}
              </p>
            </div>
            <DocumentArrowDownIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        {billingHistory.nextPayment && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prochain paiement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {billingHistory.nextPayment.amount.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(billingHistory.nextPayment.date).toLocaleDateString()}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        )}
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Historique des factures
          </h3>
        </div>

        {billingHistory.invoices.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentArrowDownIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune facture
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Vos factures apparaîtront ici après vos paiements.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {billingHistory.invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <div className="font-medium">{invoice.description}</div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Facture #{invoice.id.slice(-8)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.amount.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusLabel(invoice.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {invoice.status === 'paid' && invoice.downloadUrl && (
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          disabled={downloadingIds.has(invoice.id)}
                          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          <span>
                            {downloadingIds.has(invoice.id) ? 'Téléchargement...' : 'Télécharger'}
                          </span>
                        </button>
                      )}
                      {invoice.status === 'pending' && (
                        <span className="text-orange-600 dark:text-orange-400">
                          En attente
                        </span>
                      )}
                      {invoice.status === 'failed' && (
                        <span className="text-red-600 dark:text-red-400">
                          Échec
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { useTrialStatus } from '@/hooks/useTrialStatus'

// Helper component for trial warnings
export function TrialWarning({ feature, children }: { feature: string; children: React.ReactNode }) {
  const trialStatus = useTrialStatus()
  
  if (!trialStatus.canAccess(feature)) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {trialStatus.trialExpired ? 'Période d\'essai expirée' : 'Fonctionnalité premium'}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              {trialStatus.trialExpired 
                ? 'Votre période d\'essai de 15 jours est terminée. Souscrivez à un abonnement pour continuer à utiliser toutes les fonctionnalités.'
                : `Cette fonctionnalité sera disponible après votre période d'essai. ${trialStatus.daysRemaining} jours restants.`
              }
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/dashboard/subscription"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs rounded-md font-medium transition-colors"
            >
              {trialStatus.trialExpired ? 'S\'abonner' : 'Voir les plans'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Helper component for trial countdown
export function TrialCountdown() {
  const trialStatus = useTrialStatus()
  
  if (!trialStatus.isTrialing && !trialStatus.trialExpired) return null
  
  return (
    <div className={`rounded-lg p-4 mb-4 ${
      trialStatus.trialExpired 
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 ${
            trialStatus.trialExpired ? 'text-red-400' : 'text-blue-400'
          }`}>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className={`text-sm font-medium ${
              trialStatus.trialExpired 
                ? 'text-red-800 dark:text-red-200' 
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {trialStatus.trialExpired ? 'Période d\'essai expirée' : `Essai gratuit - ${trialStatus.daysRemaining} jour${trialStatus.daysRemaining > 1 ? 's' : ''} restant${trialStatus.daysRemaining > 1 ? 's' : ''}`}
            </h3>
            <p className={`text-sm mt-1 ${
              trialStatus.trialExpired 
                ? 'text-red-700 dark:text-red-300' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {trialStatus.trialExpired 
                ? 'Souscrivez à un abonnement pour continuer à utiliser l\'application.'
                : 'Profitez de toutes les fonctionnalités pendant votre période d\'essai.'
              }
            </p>
          </div>
        </div>
        <a
          href="/dashboard/subscription"
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
            trialStatus.trialExpired
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {trialStatus.trialExpired ? 'S\'abonner maintenant' : 'Choisir un plan'}
        </a>
      </div>
    </div>
  )
}
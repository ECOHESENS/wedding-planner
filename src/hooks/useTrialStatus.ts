'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface TrialStatus {
  isTrialing: boolean
  daysRemaining: number
  trialExpired: boolean
  trialEndDate: Date | null
  hasActiveSubscription: boolean
  canAccess: (feature: string) => boolean
  restrictions: string[]
}

const TRIAL_LENGTH_DAYS = 15

// Features that are restricted during trial or after trial expiry
export const TRIAL_RESTRICTIONS = {
  expired: [
    'budget_add',
    'budget_edit', 
    'trousseau_add',
    'trousseau_edit',
    'events_add',
    'documents_upload',
    'checklist_add',
    'vendors_contact',
    'export_data',
    'advanced_analytics'
  ],
  trial: [
    'export_data',
    'advanced_analytics',
    'premium_templates',
    'bulk_operations'
  ]
}

export function useTrialStatus(): TrialStatus {
  const { data: session } = useSession()
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialing: false,
    daysRemaining: 0,
    trialExpired: false,
    trialEndDate: null,
    hasActiveSubscription: false,
    canAccess: () => true,
    restrictions: []
  })

  useEffect(() => {
    if (session?.user) {
      fetchTrialStatus()
    }
  }, [session])

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch('/api/subscription/trial-status')
      if (response.ok) {
        const data = await response.json()
        
        const now = new Date()
        const trialEndDate = data.trialEndDate ? new Date(data.trialEndDate) : null
        const userCreatedAt = new Date(data.userCreatedAt)
        
        // Calculate trial end date if not set (15 days from user creation)
        const calculatedTrialEnd = trialEndDate || new Date(userCreatedAt.getTime() + (TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000))
        
        const daysRemaining = Math.max(0, Math.ceil((calculatedTrialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        const isTrialing = data.subscriptionStatus === 'trialing' || (!data.hasActiveSubscription && daysRemaining > 0)
        const trialExpired = !data.hasActiveSubscription && daysRemaining === 0
        
        const canAccess = (feature: string) => {
          if (data.hasActiveSubscription) return true
          if (trialExpired && TRIAL_RESTRICTIONS.expired.includes(feature)) return false
          if (isTrialing && TRIAL_RESTRICTIONS.trial.includes(feature)) return false
          return true
        }

        const restrictions = []
        if (trialExpired) {
          restrictions.push(...TRIAL_RESTRICTIONS.expired)
        } else if (isTrialing) {
          restrictions.push(...TRIAL_RESTRICTIONS.trial)
        }

        setTrialStatus({
          isTrialing,
          daysRemaining,
          trialExpired,
          trialEndDate: calculatedTrialEnd,
          hasActiveSubscription: data.hasActiveSubscription,
          canAccess,
          restrictions
        })
      }
    } catch (error) {
      console.error('Error fetching trial status:', error)
    }
  }

  return trialStatus
}
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        createdAt: true,
        trialEndsAt: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionEndsAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has an active subscription
    const now = new Date()
    const hasActiveSubscription = user.subscriptionStatus === 'active' && 
                                  user.subscriptionEndsAt && 
                                  new Date(user.subscriptionEndsAt) > now

    // Calculate trial end date (15 days from account creation if not set)
    const trialEndDate = user.trialEndsAt || new Date(user.createdAt.getTime() + (15 * 24 * 60 * 60 * 1000))

    // Determine trial status
    const isInTrial = user.subscriptionStatus === 'trialing' || 
                      (!hasActiveSubscription && now < trialEndDate)

    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    return NextResponse.json({
      userCreatedAt: user.createdAt,
      trialEndDate: trialEndDate,
      hasActiveSubscription,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      isInTrial,
      daysRemaining,
      trialExpired: !hasActiveSubscription && now >= trialEndDate
    })

  } catch (error) {
    console.error('Error fetching trial status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role === 'CLIENT') {
      // Get client's couple data
      const couple = await prisma.couple.findFirst({
        where: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        },
        include: {
          events: {
            include: {
              _count: {
                select: { attendees: true }
              }
            }
          },
          budgetItems: true,
          checklists: {
            include: {
              items: true
            }
          },
          planner: {
            select: { name: true }
          }
        }
      })

      if (!couple) {
        return NextResponse.json({
          totalEvents: 0,
          budgetUsagePercentage: 0,
          completedTasks: 0,
          totalTasks: 0,
          daysToWedding: null,
          totalBudget: 0,
          totalSpent: 0,
          upcomingEvents: []
        })
      }

      // Calculate stats
      const totalEvents = couple.events.length
      const totalBudget = couple.budgetItems.reduce((sum, item) => sum + (item.amount || 0), 0)
      const totalSpent = couple.budgetItems.reduce((sum, item) => sum + (item.paid || 0), 0)
      const budgetUsagePercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

      // Calculate checklist progress
      const allChecklistItems = couple.checklists.flatMap(checklist => checklist.items)
      const completedTasks = allChecklistItems.filter(item => item.completed).length
      const totalTasks = allChecklistItems.length

      // Calculate days to wedding
      let daysToWedding = null
      if (couple.weddingDate) {
        const today = new Date()
        const weddingDate = new Date(couple.weddingDate)
        const diffTime = weddingDate.getTime() - today.getTime()
        daysToWedding = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      // Get upcoming events
      const upcomingEvents = couple.events
        .filter(event => event.date && new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        .slice(0, 3)

      return NextResponse.json({
        totalEvents,
        budgetUsagePercentage,
        completedTasks,
        totalTasks,
        daysToWedding,
        totalBudget,
        totalSpent,
        upcomingEvents,
        recentActivity: [
          {
            type: 'task',
            message: allChecklistItems.length > 0 ? 
              `Tâche "${allChecklistItems.find(item => item.completed)?.title || 'Nouvelle tâche'}" complétée` : 
              'Aucune tâche complétée',
            time: 'Il y a 2h',
            color: 'green'
          },
          {
            type: 'message',
            message: couple.planner ? 
              `Nouveau message de ${couple.planner.name}` : 
              'Aucun message récent',
            time: 'Hier',
            color: 'blue'
          },
          {
            type: 'budget',
            message: totalSpent > 0 ? 
              `Budget mis à jour - ${totalSpent}€ dépensés` : 
              'Budget non configuré',
            time: 'Il y a 3 jours',
            color: 'purple'
          }
        ]
      })

    } else if (session.user.role === 'PLANNER') {
      // Get planner's clients data
      const couples = await prisma.couple.findMany({
        where: {
          plannerId: session.user.id
        },
        include: {
          events: true,
          budgetItems: true,
          checklists: {
            include: {
              items: true
            }
          },
          bride: {
            select: { name: true }
          },
          groom: {
            select: { name: true }
          }
        }
      })

      const totalClients = couples.length
      const totalEvents = couples.reduce((sum, couple) => sum + couple.events.length, 0)
      const totalBudget = couples.reduce((sum, couple) => 
        sum + couple.budgetItems.reduce((budgetSum, item) => budgetSum + (item.amount || 0), 0), 0)
      const totalSpent = couples.reduce((sum, couple) => 
        sum + couple.budgetItems.reduce((spentSum, item) => spentSum + (item.paid || 0), 0), 0)
      const budgetUsagePercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

      // Count all checklist items
      const allChecklistItems = couples.flatMap(couple => 
        couple.checklists.flatMap(checklist => checklist.items)
      )
      const completedTasks = allChecklistItems.filter(item => item.completed).length
      const totalTasks = allChecklistItems.length

      // Count upcoming weddings (next 60 days)
      const upcomingWeddings = couples.filter(couple => {
        if (!couple.weddingDate) return false
        const today = new Date()
        const weddingDate = new Date(couple.weddingDate)
        const diffTime = weddingDate.getTime() - today.getTime()
        const daysToWedding = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return daysToWedding > 0 && daysToWedding <= 60
      }).length

      return NextResponse.json({
        totalClients,
        totalEvents,
        budgetUsagePercentage,
        completedTasks,
        totalTasks,
        upcomingWeddings,
        totalBudget,
        totalSpent,
        recentActivity: [
          {
            type: 'client',
            message: totalClients > 0 ? 
              `${totalClients} clients actifs` : 
              'Aucun client actif',
            time: 'Aujourd\'hui',
            color: 'green'
          },
          {
            type: 'wedding',
            message: upcomingWeddings > 0 ? 
              `${upcomingWeddings} mariages prochains` : 
              'Aucun mariage prochain',
            time: 'Cette semaine',
            color: 'blue'
          },
          {
            type: 'revenue',
            message: totalSpent > 0 ? 
              `${totalSpent}€ de chiffre d'affaires` : 
              'Aucun chiffre d\'affaires',
            time: 'Ce mois',
            color: 'purple'
          }
        ]
      })
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
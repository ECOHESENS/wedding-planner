import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a planner
    if (session.user.role !== 'PLANNER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get all clients data
    const clients = await prisma.couple.findMany({
      where: { plannerId: session.user.id },
      include: {
        events: true,
        budgetItems: true,
        checklists: true,
        documents: true
      }
    })

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthRevenue = clients.reduce((sum, client) => {
        return sum + client.budgetItems
          .filter(item => {
            const itemDate = new Date(item.createdAt)
            return itemDate >= monthStart && itemDate <= monthEnd
          })
          .reduce((itemSum, item) => itemSum + (item.actualCost || item.estimatedCost || 0), 0)
      }, 0)

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('fr-FR', { month: 'short' }),
        revenue: monthRevenue
      })
    }

    // Wedding types distribution
    const weddingTypes = clients.reduce((acc, client) => {
      const culture = client.culture
      acc[culture] = (acc[culture] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Upcoming deadlines (next 30 days)
    const upcomingDeadlines = clients.flatMap(client => 
      client.events
        .filter(event => {
          if (!event.date || event.isCompleted) return false
          const eventDate = new Date(event.date)
          return eventDate >= now && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        })
        .map(event => ({
          ...event,
          clientName: client.brideName,
          coupleId: client.id
        }))
    ).sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())

    // Tasks that need attention
    const urgentTasks = clients.flatMap(client => {
      const overdueTasks = client.checklists.filter(task => !task.isCompleted)
      const overdueEvents = client.events.filter(event => 
        !event.isCompleted && event.date && new Date(event.date) < now
      )
      
      return [
        ...overdueTasks.map(task => ({
          type: 'checklist',
          id: task.id,
          title: task.title,
          clientName: client.brideName,
          coupleId: client.id,
          urgent: true
        })),
        ...overdueEvents.map(event => ({
          type: 'event',
          id: event.id,
          title: event.title,
          clientName: client.brideName,
          coupleId: client.id,
          urgent: true,
          date: event.date
        }))
      ]
    })

    // Budget analysis
    const budgetAnalysis = {
      totalRevenue: clients.reduce((sum, client) => 
        sum + client.budgetItems.reduce((clientSum, item) => 
          clientSum + (item.actualCost || item.estimatedCost || 0), 0), 0),
      averageBudget: clients.length > 0 
        ? clients.reduce((sum, client) => sum + (client.totalBudget || 0), 0) / clients.length 
        : 0,
      budgetUtilization: clients.map(client => {
        const totalBudget = client.totalBudget || 0
        const totalSpent = client.budgetItems.reduce((sum, item) => 
          sum + (item.actualCost || item.estimatedCost || 0), 0)
        return {
          clientName: client.brideName,
          percentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
          amount: totalSpent,
          budget: totalBudget
        }
      })
    }

    return NextResponse.json({
      overview: {
        totalClients: clients.length,
        activeProjects: clients.filter(c => c.weddingDate && new Date(c.weddingDate) > now).length,
        upcomingWeddings: clients.filter(c => {
          if (!c.weddingDate) return false
          const weddingDate = new Date(c.weddingDate)
          return weddingDate >= now && weddingDate <= new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
        }).length,
        totalRevenue: budgetAnalysis.totalRevenue
      },
      monthlyRevenue,
      weddingTypes,
      upcomingDeadlines: upcomingDeadlines.slice(0, 10),
      urgentTasks: urgentTasks.slice(0, 10),
      budgetAnalysis
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
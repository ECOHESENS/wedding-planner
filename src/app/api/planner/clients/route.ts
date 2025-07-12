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

    // Get all clients for this planner
    const clients = await prisma.couple.findMany({
      where: { plannerId: session.user.id },
      include: {
        bride: { select: { name: true, email: true } },
        groom: { select: { name: true, email: true } },
        events: {
          select: {
            id: true,
            title: true,
            type: true,
            date: true,
            isCompleted: true
          },
          orderBy: { date: 'asc' }
        },
        budgetItems: {
          select: {
            id: true,
            actualCost: true,
            estimatedCost: true,
            isPaid: true
          }
        },
        checklists: {
          select: {
            id: true,
            isCompleted: true
          }
        },
        _count: {
          select: {
            events: true,
            budgetItems: true,
            checklists: true,
            documents: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate statistics for each client
    const clientsWithStats = clients.map(client => {
      const totalBudget = client.totalBudget || 0
      const totalSpent = client.budgetItems.reduce((sum, item) => 
        sum + (item.actualCost || item.estimatedCost || 0), 0)
      const totalPaid = client.budgetItems.reduce((sum, item) => 
        sum + (item.paidAmount || 0), 0)
      
      const completedEvents = client.events.filter(e => e.isCompleted).length
      const completedChecklists = client.checklists.filter(c => c.isCompleted).length
      
      const nextEvent = client.events.find(e => !e.isCompleted && e.date)
      const daysToWedding = client.weddingDate 
        ? Math.ceil((new Date(client.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        ...client,
        stats: {
          totalBudget,
          totalSpent,
          totalPaid,
          budgetUsagePercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
          eventsProgress: client._count.events > 0 ? Math.round((completedEvents / client._count.events) * 100) : 0,
          checklistProgress: client._count.checklists > 0 ? Math.round((completedChecklists / client._count.checklists) * 100) : 0,
          nextEvent,
          daysToWedding
        }
      }
    })

    // Calculate overall statistics
    const totalClients = clients.length
    const upcomingWeddings = clients.filter(c => c.weddingDate && new Date(c.weddingDate) > new Date()).length
    const totalRevenue = clients.reduce((sum, client) => 
      sum + client.budgetItems.reduce((clientSum, item) => 
        clientSum + (item.actualCost || item.estimatedCost || 0), 0), 0)
    
    return NextResponse.json({
      clients: clientsWithStats,
      summary: {
        totalClients,
        upcomingWeddings,
        totalRevenue,
        averageBudget: totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0
      }
    })
  } catch (error) {
    console.error('Planner clients fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a planner
    if (session.user.role !== 'PLANNER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { coupleId } = await request.json()

    // Assign planner to existing couple
    const updatedCouple = await prisma.couple.update({
      where: { id: coupleId },
      data: { plannerId: session.user.id },
      include: {
        bride: { select: { name: true, email: true } },
        groom: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json(updatedCouple)
  } catch (error) {
    console.error('Client assignment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
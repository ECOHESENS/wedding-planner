import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'PLANNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = params.id

    // Get client details with all related data
    const client = await prisma.couple.findFirst({
      where: {
        id: clientId,
        plannerId: session.user.id // Security: only assigned clients
      },
      include: {
        bride: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        groom: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        events: {
          select: {
            id: true,
            name: true,
            date: true,
            status: true,
            type: true,
            venue: true
          },
          orderBy: {
            date: 'asc'
          }
        },
        budgetItems: {
          select: {
            id: true,
            name: true,
            category: true,
            estimatedCost: true,
            actualCost: true,
            status: true,
            dueDate: true
          },
          orderBy: {
            dueDate: 'asc'
          }
        },
        checklists: {
          select: {
            id: true,
            title: true,
            completed: true,
            dueDate: true,
            category: true,
            priority: true
          },
          orderBy: {
            dueDate: 'asc'
          }
        },
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            uploadDate: true,
            size: true
          },
          orderBy: {
            uploadDate: 'desc'
          }
        },
        messages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            sender: {
              select: {
                name: true,
                role: true
              }
            },
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Last 10 messages
        },
        weddingDays: {
          select: {
            id: true,
            name: true,
            date: true,
            description: true
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Calculate budget totals
    const totalBudget = client.budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0)
    const spentBudget = client.budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0)

    // Calculate completion stats
    const completedTasks = client.checklists.filter(task => task.completed).length
    const completedEvents = client.events.filter(event => event.status === 'completed').length

    const response = {
      id: client.id,
      bride: client.bride,
      groom: client.groom,
      weddingDate: client.weddingDate,
      venue: client.venue,
      culture: client.culture,
      guestCount: client.guestCount,
      totalBudget,
      spentBudget,
      events: client.events,
      budgetItems: client.budgetItems,
      checklists: client.checklists,
      documents: client.documents,
      messages: client.messages,
      weddingDays: client.weddingDays,
      stats: {
        totalEvents: client.events.length,
        completedEvents,
        totalTasks: client.checklists.length,
        completedTasks,
        totalDocuments: client.documents.length,
        budgetUtilization: totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching client details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'PLANNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = params.id
    const body = await request.json()

    // Verify planner has access to this client
    const existingClient = await prisma.couple.findFirst({
      where: {
        id: clientId,
        plannerId: session.user.id
      }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Update client data
    const updatedClient = await prisma.couple.update({
      where: {
        id: clientId
      },
      data: {
        weddingDate: body.weddingDate || existingClient.weddingDate,
        venue: body.venue || existingClient.venue,
        culture: body.culture || existingClient.culture,
        guestCount: body.guestCount || existingClient.guestCount,
        notes: body.notes || existingClient.notes,
        updatedAt: new Date()
      },
      include: {
        bride: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        groom: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'PLANNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = params.id

    // Verify planner has access to this client
    const existingClient = await prisma.couple.findFirst({
      where: {
        id: clientId,
        plannerId: session.user.id
      }
    })

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // For security, we don't actually delete the client, just remove planner assignment
    // This preserves client data while removing planner access
    await prisma.couple.update({
      where: {
        id: clientId
      },
      data: {
        plannerId: null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ message: 'Client access removed successfully' })
  } catch (error) {
    console.error('Error removing client access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
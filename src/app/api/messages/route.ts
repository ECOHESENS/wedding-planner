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

    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')

    let whereClause: any = {}

    if (session.user.role === 'PLANNER') {
      // Planner can see messages for specific couple or all their couples
      if (coupleId) {
        whereClause = {
          coupleId,
          couple: { plannerId: session.user.id }
        }
      } else {
        whereClause = {
          couple: { plannerId: session.user.id }
        }
      }
    } else {
      // Client can only see messages for their own couple
      const couple = await prisma.couple.findFirst({
        where: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      })

      if (!couple) {
        return NextResponse.json({ error: 'No couple profile found' }, { status: 404 })
      }

      whereClause = { coupleId: couple.id }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { name: true, role: true } },
        couple: { 
          select: { 
            id: true,
            brideName: true, 
            groomName: true,
            bride: { select: { name: true } },
            planner: { select: { name: true } }
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Group messages by couple for planner view
    const messagesByCouple = messages.reduce((acc, message) => {
      const coupleId = message.coupleId
      if (!acc[coupleId]) {
        acc[coupleId] = {
          couple: message.couple,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      acc[coupleId].messages.push(message)
      if (!acc[coupleId].lastMessage || new Date(message.createdAt) > new Date(acc[coupleId].lastMessage.createdAt)) {
        acc[coupleId].lastMessage = message
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      messages,
      messagesByCouple: session.user.role === 'PLANNER' ? messagesByCouple : null
    })
  } catch (error) {
    console.error('Messages fetch error:', error)
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

    const { content, coupleId } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    let targetCoupleId = coupleId

    if (session.user.role === 'CLIENT') {
      // For clients, get their couple ID
      const couple = await prisma.couple.findFirst({
        where: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      })

      if (!couple) {
        return NextResponse.json({ error: 'No couple profile found' }, { status: 404 })
      }

      targetCoupleId = couple.id
    } else if (session.user.role === 'PLANNER') {
      // Verify planner has access to this couple
      const couple = await prisma.couple.findFirst({
        where: {
          id: targetCoupleId,
          plannerId: session.user.id
        }
      })

      if (!couple) {
        return NextResponse.json({ error: 'Couple not found' }, { status: 404 })
      }
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: session.user.id,
        coupleId: targetCoupleId,
        isFromPlanner: session.user.role === 'PLANNER'
      },
      include: {
        sender: { select: { name: true, role: true } },
        couple: { 
          select: { 
            brideName: true, 
            groomName: true 
          } 
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EventType } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's couple
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

    // Get all events for this couple
    const events = await prisma.event.findMany({
      where: { coupleId: couple.id },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Events fetch error:', error)
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

    const {
      title,
      type,
      date,
      time,
      location,
      description
    } = await request.json()

    // Find the user's couple
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

    const newEvent = await prisma.event.create({
      data: {
        title,
        type: type as EventType,
        date: date ? new Date(date) : null,
        time,
        location,
        description,
        coupleId: couple.id
      }
    })

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
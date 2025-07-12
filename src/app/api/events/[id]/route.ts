import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EventType } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      description,
      isCompleted
    } = await request.json()

    // Find the event and verify ownership
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        couple: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        type: type as EventType,
        date: date ? new Date(date) : null,
        time,
        location,
        description,
        isCompleted
      }
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Event update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the event and verify ownership
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        couple: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.event.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
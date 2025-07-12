import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isCompleted, notes } = await request.json()

    // Find the checklist and verify ownership
    const checklist = await prisma.checklist.findFirst({
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

    if (!checklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 })
    }

    const updatedChecklist = await prisma.checklist.update({
      where: { id: params.id },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        notes
      }
    })

    return NextResponse.json(updatedChecklist)
  } catch (error) {
    console.error('Checklist update error:', error)
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

    // Find the checklist and verify ownership
    const checklist = await prisma.checklist.findFirst({
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

    if (!checklist) {
      return NextResponse.json({ error: 'Checklist not found' }, { status: 404 })
    }

    await prisma.checklist.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Checklist deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
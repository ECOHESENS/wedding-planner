import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      category,
      side,
      age,
      address,
      dietaryRestrictions,
      plusOne,
      plusOneName,
      confirmed,
      invitationSent,
      tableNumber,
      specialNeeds,
      notes,
      relationshipType,
      parentId,
      specialRole
    } = body

    // Verify ownership
    const existingAttendee = await prisma.attendee.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Invité non trouvé' }, { status: 404 })
    }

    const updatedAttendee = await prisma.attendee.update({
      where: {
        id: params.id,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        category,
        side,
        age,
        address,
        dietaryRestrictions,
        plusOne: plusOne || false,
        plusOneName,
        confirmed: confirmed || false,
        invitationSent: invitationSent || false,
        tableNumber,
        specialNeeds,
        notes,
        relationshipType,
        parentId,
        specialRole,
      },
    })

    return NextResponse.json(updatedAttendee)
  } catch (error) {
    console.error('Error updating attendee:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Verify ownership
    const existingAttendee = await prisma.attendee.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Invité non trouvé' }, { status: 404 })
    }

    await prisma.attendee.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting attendee:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const attendees = await prisma.attendee.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(attendees)
  } catch (error) {
    console.error('Error fetching attendees:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const attendee = await prisma.attendee.create({
      data: {
        userId: session.user.id,
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

    return NextResponse.json(attendee, { status: 201 })
  } catch (error) {
    console.error('Error creating attendee:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
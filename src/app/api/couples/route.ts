import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Culture } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      brideName,
      groomName,
      groomEmail,
      brideOrigin,
      groomOrigin,
      brideNationality,
      groomNationality,
      culture,
      secondaryCulture,
      weddingDate,
      estimatedGuests,
      totalBudget,
      phone,
      address,
      notes
    } = await request.json()

    // Create or find groom user if email provided
    let groomUser = null
    if (groomEmail) {
      groomUser = await prisma.user.findUnique({
        where: { email: groomEmail }
      })
    }

    // Check if couple already exists for this bride
    const existingCouple = await prisma.couple.findFirst({
      where: { brideId: session.user.id }
    })

    if (existingCouple) {
      // Update existing couple
      const updatedCouple = await prisma.couple.update({
        where: { id: existingCouple.id },
        data: {
          brideName,
          groomName,
          brideOrigin,
          groomOrigin,
          brideNationality,
          groomNationality,
          groomId: groomUser?.id,
          culture: culture as Culture,
          secondaryCulture: secondaryCulture ? secondaryCulture as Culture : null,
          weddingDate: weddingDate ? new Date(weddingDate) : null,
          estimatedGuests: estimatedGuests ? parseInt(estimatedGuests) : null,
          totalBudget: totalBudget ? parseFloat(totalBudget) : null,
          phone,
          address,
          notes
        },
        include: {
          bride: { select: { name: true, email: true } },
          groom: { select: { name: true, email: true } },
          planner: { select: { name: true, email: true } }
        }
      })

      return NextResponse.json(updatedCouple)
    } else {
      // Create new couple
      const newCouple = await prisma.couple.create({
        data: {
          brideName,
          groomName,
          brideOrigin,
          groomOrigin,
          brideNationality,
          groomNationality,
          brideId: session.user.id,
          groomId: groomUser?.id,
          culture: culture as Culture,
          secondaryCulture: secondaryCulture ? secondaryCulture as Culture : null,
          weddingDate: weddingDate ? new Date(weddingDate) : null,
          estimatedGuests: estimatedGuests ? parseInt(estimatedGuests) : null,
          totalBudget: totalBudget ? parseFloat(totalBudget) : null,
          phone,
          address,
          notes
        },
        include: {
          bride: { select: { name: true, email: true } },
          groom: { select: { name: true, email: true } },
          planner: { select: { name: true, email: true } }
        }
      })

      return NextResponse.json(newCouple)
    }
  } catch (error) {
    console.error('Couple creation/update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find couple for this user
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { brideId: session.user.id },
          { groomId: session.user.id }
        ]
      },
      include: {
        bride: { select: { name: true, email: true } },
        groom: { select: { name: true, email: true } },
        planner: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json(couple)
  } catch (error) {
    console.error('Couple fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
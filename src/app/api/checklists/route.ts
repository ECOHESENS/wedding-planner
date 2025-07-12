import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checklistTemplates } from '@/lib/checklist-templates'
import { Culture, ChecklistCategory } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the user's couple
    let couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { brideId: session.user.id },
          { groomId: session.user.id }
        ]
      }
    })

    // If no couple exists, create a basic one
    if (!couple) {
      couple = await prisma.couple.create({
        data: {
          brideName: session.user.name || 'Mariée',
          groomName: 'Marié',
          brideId: session.user.id,
          culture: 'MOROCCAN',
          totalBudget: 15000
        }
      })
    }

    // Get existing checklists
    const existingChecklists = await prisma.checklist.findMany({
      where: { coupleId: couple.id },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // If no checklists exist, create them based on couple's culture
    if (existingChecklists.length === 0) {
      const cultures = [couple.culture]
      if (couple.secondaryCulture) {
        cultures.push(couple.secondaryCulture)
      }

      const relevantTemplates = checklistTemplates.filter(template => 
        template.cultures.some(culture => cultures.includes(culture))
      )

      const checklistsToCreate = relevantTemplates.map(template => ({
        title: template.title,
        category: template.category,
        culture: template.cultures.includes(couple.culture) ? couple.culture : couple.secondaryCulture,
        coupleId: couple.id
      }))

      await prisma.checklist.createMany({
        data: checklistsToCreate
      })

      // Fetch the newly created checklists
      const newChecklists = await prisma.checklist.findMany({
        where: { coupleId: couple.id },
        orderBy: [
          { category: 'asc' },
          { createdAt: 'asc' }
        ]
      })

      return NextResponse.json(newChecklists)
    }

    return NextResponse.json(existingChecklists)
  } catch (error) {
    console.error('Checklist fetch error:', error)
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

    const { title, category, culture, notes } = await request.json()

    // Find the user's couple
    let couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { brideId: session.user.id },
          { groomId: session.user.id }
        ]
      }
    })

    // If no couple exists, create a basic one
    if (!couple) {
      couple = await prisma.couple.create({
        data: {
          brideName: session.user.name || 'Mariée',
          groomName: 'Marié',
          brideId: session.user.id,
          culture: 'MOROCCAN',
          totalBudget: 15000
        }
      })
    }

    const newChecklist = await prisma.checklist.create({
      data: {
        title,
        category: category as ChecklistCategory,
        culture: culture ? culture as Culture : null,
        notes,
        coupleId: couple.id
      }
    })

    return NextResponse.json(newChecklist)
  } catch (error) {
    console.error('Checklist creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
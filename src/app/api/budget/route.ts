import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BudgetCategory } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
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
          culture: 'FRENCH_MOROCCAN',
          totalBudget: 15000
        }
      })
    }

    // Get all budget items for this couple
    const budgetItems = await prisma.budgetItem.findMany({
      where: {
        coupleId: couple.id
      },
      include: {
        weddingDay: {
          select: {
            name: true,
            date: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate totals
    const totalBudget = couple.totalBudget || 0
    const totalSpent = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0)
    const totalEstimated = budgetItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0)

    return NextResponse.json({
      items: budgetItems,
      totalBudget,
      totalSpent,
      totalEstimated,
      budgetUsagePercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
    })
  } catch (error) {
    console.error('Budget fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
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
          culture: 'FRENCH_MOROCCAN',
          totalBudget: 15000
        }
      })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    
    if (!body.category || !Object.values(BudgetCategory).includes(body.category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 })
    }

    // Validate optional numeric fields
    const { estimatedCost, actualCost, paidAmount } = body
    const costs = { estimatedCost, actualCost, paidAmount }
    
    for (const [key, value] of Object.entries(costs)) {
      if (value !== undefined && value !== null && (isNaN(value) || value < 0)) {
        return NextResponse.json({ error: `${key} must be a positive number` }, { status: 400 })
      }
    }

    // Validate title length
    if (body.title.length > 255) {
      return NextResponse.json({ error: 'Title must be less than 255 characters' }, { status: 400 })
    }

    // Validate vendor length
    if (body.vendor && body.vendor.length > 255) {
      return NextResponse.json({ error: 'Vendor name must be less than 255 characters' }, { status: 400 })
    }

    // Create the budget item
    const newItem = await prisma.budgetItem.create({
      data: {
        title: body.title.trim(),
        category: body.category,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        actualCost: actualCost ? parseFloat(actualCost) : null,
        paidAmount: paidAmount ? parseFloat(paidAmount) : null,
        vendor: body.vendor?.trim() || null,
        notes: body.notes?.trim() || null,
        isPaid: body.isPaid || false,
        coupleId: couple.id,
        weddingDayId: body.weddingDayId || null
      },
      include: {
        weddingDay: {
          select: {
            name: true,
            date: true
          }
        }
      }
    })
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Budget item creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
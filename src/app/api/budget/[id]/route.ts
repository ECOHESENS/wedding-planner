import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BudgetCategory } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const itemId = params.id

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

    // Validate input data
    const {
      category,
      title,
      estimatedCost,
      actualCost,
      paidAmount,
      vendor,
      notes,
      isPaid,
      weddingDayId
    } = body

    // Validate category if provided
    if (category && !Object.values(BudgetCategory).includes(category)) {
      return NextResponse.json({ error: 'Invalid budget category' }, { status: 400 })
    }

    // Validate costs are positive numbers
    const costs = { estimatedCost, actualCost, paidAmount }
    for (const [key, value] of Object.entries(costs)) {
      if (value !== undefined && value !== null && (isNaN(value) || value < 0)) {
        return NextResponse.json({ error: `${key} must be a positive number` }, { status: 400 })
      }
    }

    // Update the budget item
    const updatedItem = await prisma.budgetItem.update({
      where: {
        id: itemId,
        coupleId: couple.id
      },
      data: {
        ...(category && { category }),
        ...(title && { title }),
        ...(estimatedCost !== undefined && { estimatedCost: parseFloat(estimatedCost) || null }),
        ...(actualCost !== undefined && { actualCost: parseFloat(actualCost) || null }),
        ...(paidAmount !== undefined && { paidAmount: parseFloat(paidAmount) || null }),
        ...(vendor !== undefined && { vendor }),
        ...(notes !== undefined && { notes }),
        ...(isPaid !== undefined && { isPaid }),
        ...(weddingDayId !== undefined && { weddingDayId })
      }
    })
    
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating budget item:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const itemId = params.id

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

    // Delete the budget item
    await prisma.budgetItem.delete({
      where: {
        id: itemId,
        coupleId: couple.id
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Budget item deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting budget item:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Budget item not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
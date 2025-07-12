import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (in a real app, this would be a database)
declare global {
  var weddingDays: any[]
  var weddingDayNextId: number
}

if (!global.weddingDays) {
  global.weddingDays = []
}

if (!global.weddingDayNextId) {
  global.weddingDayNextId = 1
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string

    // Filter wedding days for the current user
    const userWeddingDays = global.weddingDays.filter(day => day.userId === userId)
    
    return NextResponse.json(userWeddingDays)
  } catch (error) {
    console.error('Error fetching wedding days:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string
    const body = await request.json()
    
    // Basic validation
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    if (!body.date || typeof body.date !== 'string') {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }
    
    const newWeddingDay = {
      id: global.weddingDayNextId.toString(),
      userId,
      name: body.name,
      date: body.date,
      location: body.location || '',
      description: body.description || '',
      estimatedGuests: body.estimatedGuests || 0,
      budget: body.budget || 0,
      isMainDay: body.isMainDay || false,
      order: body.order || global.weddingDayNextId,
      attendees: [],
      events: [],
      budgetItems: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    global.weddingDays.push(newWeddingDay)
    global.weddingDayNextId++
    
    return NextResponse.json(newWeddingDay, { status: 201 })
  } catch (error) {
    console.error('Error creating wedding day:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
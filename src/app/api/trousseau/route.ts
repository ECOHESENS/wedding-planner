import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (in a real app, this would be a database)
declare global {
  var trousseauItems: any[]
  var trousseauNextId: number
}

if (!global.trousseauItems) {
  global.trousseauItems = []
}

if (!global.trousseauNextId) {
  global.trousseauNextId = 1
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string

    // Filter items for the current user
    const userItems = global.trousseauItems.filter(item => item.userId === userId)
    
    return NextResponse.json(userItems)
  } catch (error) {
    console.error('Error fetching trousseau items:', error)
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
    
    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    
    const newItem = {
      id: global.trousseauNextId.toString(),
      userId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    global.trousseauItems.push(newItem)
    global.trousseauNextId++
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating trousseau item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
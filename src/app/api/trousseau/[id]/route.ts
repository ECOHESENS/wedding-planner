import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (in a real app, this would be a database)
// This should be shared with the main route
declare global {
  var trousseauItems: any[]
}

if (!global.trousseauItems) {
  global.trousseauItems = []
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string
    const body = await request.json()
    const itemId = params.id
    
    const itemIndex = global.trousseauItems.findIndex(
      item => item.id === itemId && item.userId === userId
    )
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    global.trousseauItems[itemIndex] = {
      ...global.trousseauItems[itemIndex],
      ...body,
      updatedAt: new Date()
    }
    
    return NextResponse.json(global.trousseauItems[itemIndex])
  } catch (error) {
    console.error('Error updating trousseau item:', error)
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

    const userId = session.user.id as string
    const itemId = params.id
    
    const itemIndex = global.trousseauItems.findIndex(
      item => item.id === itemId && item.userId === userId
    )
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    global.trousseauItems.splice(itemIndex, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting trousseau item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (should be shared with main wedding days route)
declare global {
  var weddingDays: any[]
}

if (!global.weddingDays) {
  global.weddingDays = []
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
    const dayId = params.id
    
    const dayIndex = global.weddingDays.findIndex(
      day => day.id === dayId && day.userId === userId
    )
    
    if (dayIndex === -1) {
      return NextResponse.json({ error: 'Wedding day not found' }, { status: 404 })
    }
    
    global.weddingDays[dayIndex] = {
      ...global.weddingDays[dayIndex],
      ...body,
      id: dayId,
      userId,
      updatedAt: new Date()
    }
    
    return NextResponse.json(global.weddingDays[dayIndex])
  } catch (error) {
    console.error('Error updating wedding day:', error)
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
    const dayId = params.id
    
    const dayIndex = global.weddingDays.findIndex(
      day => day.id === dayId && day.userId === userId
    )
    
    if (dayIndex === -1) {
      return NextResponse.json({ error: 'Wedding day not found' }, { status: 404 })
    }
    
    global.weddingDays.splice(dayIndex, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wedding day:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
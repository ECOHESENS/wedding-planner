import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (should be shared with main timeline route)
declare global {
  var timelineTasks: any[]
}

if (!global.timelineTasks) {
  global.timelineTasks = []
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
    const taskId = params.id
    
    const taskIndex = global.timelineTasks.findIndex(
      task => task.id === taskId && task.userId === userId
    )
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Timeline task not found' }, { status: 404 })
    }
    
    global.timelineTasks[taskIndex] = {
      ...global.timelineTasks[taskIndex],
      ...body,
      id: taskId,
      userId,
      updatedAt: new Date()
    }
    
    return NextResponse.json(global.timelineTasks[taskIndex])
  } catch (error) {
    console.error('Error updating timeline task:', error)
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
    const taskId = params.id
    
    const taskIndex = global.timelineTasks.findIndex(
      task => task.id === taskId && task.userId === userId
    )
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Timeline task not found' }, { status: 404 })
    }
    
    global.timelineTasks.splice(taskIndex, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting timeline task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
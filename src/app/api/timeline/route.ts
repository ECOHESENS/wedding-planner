import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (in a real app, this would be a database)
declare global {
  var timelineTasks: any[]
  var timelineNextId: number
}

if (!global.timelineTasks) {
  global.timelineTasks = []
}

if (!global.timelineNextId) {
  global.timelineNextId = 1
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string

    // Filter tasks for the current user
    const userTasks = global.timelineTasks.filter(task => task.userId === userId)
    
    return NextResponse.json(userTasks)
  } catch (error) {
    console.error('Error fetching timeline tasks:', error)
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
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    
    if (!body.category || typeof body.category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    
    if (!body.phase || typeof body.phase !== 'string') {
      return NextResponse.json({ error: 'Phase is required' }, { status: 400 })
    }
    
    const newTask = {
      id: global.timelineNextId.toString(),
      userId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    global.timelineTasks.push(newTask)
    global.timelineNextId++
    
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating timeline task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
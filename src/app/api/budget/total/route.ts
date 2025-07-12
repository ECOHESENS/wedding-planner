import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data store (should be shared with main budget route)
declare global {
  var userBudgets: Record<string, number>
}

if (!global.userBudgets) {
  global.userBudgets = {}
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id as string
    const body = await request.json()
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    
    const { totalBudget } = body
    
    if (typeof totalBudget !== 'number' || totalBudget < 0 || !isFinite(totalBudget)) {
      return NextResponse.json({ error: 'Invalid budget amount' }, { status: 400 })
    }
    
    global.userBudgets[userId] = totalBudget
    
    return NextResponse.json({ totalBudget })
  } catch (error) {
    console.error('Budget total update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
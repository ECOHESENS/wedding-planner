import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get all documents for this couple
    const documents = await prisma.document.findMany({
      where: { coupleId: couple.id },
      orderBy: { uploadedAt: 'desc' }
    })

    // Group documents by category
    const documentsByCategory = documents.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = []
      }
      acc[doc.category].push(doc)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      documents,
      documentsByCategory,
      totalCount: documents.length
    })
  } catch (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
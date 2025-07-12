import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the document and verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: params.id,
        couple: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete the physical file
    const filePath = join(process.cwd(), 'public', document.fileUrl)
    try {
      await unlink(filePath)
    } catch (error) {
      console.warn('Could not delete physical file:', error)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Document deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, category } = await request.json()

    // Find the document and verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: params.id,
        couple: {
          OR: [
            { brideId: session.user.id },
            { groomId: session.user.id }
          ]
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: { title, category }
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error('Document update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { CoupleStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') as CoupleStatus
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { brideName: { contains: search, mode: 'insensitive' as const } },
          { groomName: { contains: search, mode: 'insensitive' as const } },
          { bride: { email: { contains: search, mode: 'insensitive' as const } } }
        ]
      })
    }

    const [couples, total] = await Promise.all([
      prisma.couple.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          bride: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          groom: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          planner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              events: true,
              budgetItems: true,
              checklists: true,
              documents: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.couple.count({ where })
    ])

    return NextResponse.json({
      couples,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin couples fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
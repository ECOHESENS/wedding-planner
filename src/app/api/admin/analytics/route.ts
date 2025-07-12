import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get analytics data
    const [
      totalUsers,
      usersByRole,
      totalCouples,
      couplesByStatus,
      recentUsers,
      recentCouples,
      budgetStats,
      eventStats
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Users by role
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        }
      }),
      
      // Total couples
      prisma.couple.count(),
      
      // Couples by status
      prisma.couple.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      }),
      
      // Recent users (last 30 days)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      
      // Recent couples (last 30 days)
      prisma.couple.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          brideName: true,
          groomName: true,
          weddingDate: true,
          status: true,
          createdAt: true
        }
      }),
      
      // Budget statistics
      prisma.budget.aggregate({
        _avg: {
          total: true,
          spent: true
        },
        _sum: {
          total: true,
          spent: true
        },
        _count: {
          id: true
        }
      }),
      
      // Event statistics
      prisma.event.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      })
    ])

    // Calculate growth metrics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

    const [usersLast30Days, usersLast60Days, couplesLast30Days, couplesLast60Days] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.couple.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.couple.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate growth percentages
    const userGrowth = usersLast60Days > 0 ? ((usersLast30Days - usersLast60Days) / usersLast60Days) * 100 : 0
    const coupleGrowth = couplesLast60Days > 0 ? ((couplesLast30Days - couplesLast60Days) / couplesLast60Days) * 100 : 0

    // Get monthly user registrations for the last 12 months
    const monthlyRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    // Process monthly data
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const monthData = monthlyRegistrations.filter(reg => {
        const regDate = new Date(reg.createdAt)
        return regDate >= monthStart && regDate <= monthEnd
      })
      
      return {
        month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        registrations: monthData.reduce((sum, item) => sum + item._count.id, 0)
      }
    }).reverse()

    return NextResponse.json({
      overview: {
        totalUsers,
        totalCouples,
        userGrowth: Math.round(userGrowth * 100) / 100,
        coupleGrowth: Math.round(coupleGrowth * 100) / 100,
        usersLast30Days,
        couplesLast30Days
      },
      usersByRole: usersByRole.map(item => ({
        role: item.role,
        count: item._count.id
      })),
      couplesByStatus: couplesByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      recentUsers,
      recentCouples,
      budgetStats: {
        averageTotal: budgetStats._avg.total || 0,
        averageSpent: budgetStats._avg.spent || 0,
        totalBudgets: budgetStats._sum.total || 0,
        totalSpent: budgetStats._sum.spent || 0,
        budgetCount: budgetStats._count.id
      },
      eventStats: eventStats.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      monthlyStats
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
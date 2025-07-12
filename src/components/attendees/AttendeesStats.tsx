'use client'

import { 
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Attendee } from '@/types/attendees'

interface AttendeesStatsProps {
  attendees: Attendee[]
}

export default function AttendeesStats({ attendees }: AttendeesStatsProps) {
  const totalAttendees = attendees.length
  const confirmedAttendees = attendees.filter(a => a.confirmed).length
  const pendingAttendees = totalAttendees - confirmedAttendees
  const marieSide = attendees.filter(a => a.side === 'marie').length
  const marieeSide = attendees.filter(a => a.side === 'mariee').length
  const commonSide = attendees.filter(a => a.side === 'commun').length
  const plusOnes = attendees.filter(a => a.plusOne).length

  const stats = [
    {
      name: 'Total Invités',
      value: totalAttendees,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      name: 'Confirmés',
      value: confirmedAttendees,
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      name: 'En attente',
      value: pendingAttendees,
      icon: XCircleIcon,
      color: 'orange'
    },
    {
      name: 'Côté Marié',
      value: marieSide,
      icon: UserGroupIcon,
      color: 'indigo'
    },
    {
      name: 'Côté Mariée',
      value: marieeSide,
      icon: HeartIcon,
      color: 'pink'
    },
    {
      name: 'Accompagnants',
      value: plusOnes,
      icon: UsersIcon,
      color: 'purple'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-theme"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
          </div>
        </div>
      ))}
    </div>
  )
}
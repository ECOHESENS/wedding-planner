'use client'

import { 
  BookOpenIcon,
  HeartIcon,
  CalendarDaysIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { JournalEntry, JOURNAL_MOODS } from '@/types/journal'

interface JournalStatsProps {
  entries: JournalEntry[]
}

export default function JournalStats({ entries }: JournalStatsProps) {
  const totalEntries = entries.length
  const thisMonth = entries.filter(entry => {
    const entryDate = new Date(entry.date)
    const now = new Date()
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
  }).length

  const mostCommonMood = entries.length > 0 ? 
    Object.entries(
      entries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).reduce((a, b) => a[1] > b[1] ? a : b)[0] : null

  const allTags = entries.flatMap(entry => entry.tags)
  const uniqueTags = [...new Set(allTags)].length

  const stats = [
    {
      name: 'Total Entrées',
      value: totalEntries,
      icon: BookOpenIcon,
      color: 'pink'
    },
    {
      name: 'Ce mois-ci',
      value: thisMonth,
      icon: CalendarDaysIcon,
      color: 'purple'
    },
    {
      name: 'Humeur dominante',
      value: mostCommonMood ? JOURNAL_MOODS[mostCommonMood as keyof typeof JOURNAL_MOODS]?.emoji || '😊' : '😊',
      label: mostCommonMood ? JOURNAL_MOODS[mostCommonMood as keyof typeof JOURNAL_MOODS]?.label || 'Heureuse' : 'Heureuse',
      icon: HeartIcon,
      color: 'rose'
    },
    {
      name: 'Tags utilisés',
      value: uniqueTags,
      icon: TagIcon,
      color: 'indigo'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.label && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                )}
              </div>
            </div>
            <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
          </div>
        </div>
      ))}
    </div>
  )
}
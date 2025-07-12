'use client'

import { 
  SparklesIcon,
  HeartIcon,
  PencilIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { JOURNAL_TEMPLATES, JOURNAL_MOODS } from '@/types/journal'

interface JournalTemplatesProps {
  onUseTemplate: (templateId: string) => void
}

export default function JournalTemplates({ onUseTemplate }: JournalTemplatesProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      milestones: 'purple',
      preparations: 'blue',
      planning: 'green',
      traditions: 'amber',
      emotions: 'pink'
    }
    return colors[category as keyof typeof colors] || 'gray'
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      milestones: SparklesIcon,
      preparations: PencilIcon,
      planning: LightBulbIcon,
      traditions: HeartIcon,
      emotions: HeartIcon
    }
    return icons[category as keyof typeof icons] || PencilIcon
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Idées d'écriture pour votre journal
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Laissez-vous inspirer par ces suggestions pour capturer vos souvenirs de mariage
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JOURNAL_TEMPLATES.map((template) => {
          const IconComponent = getCategoryIcon(template.category)
          const color = getCategoryColor(template.category)
          
          return (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className="h-6 w-6" />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/20`}>
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">
                  {template.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Prompts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Questions pour vous guider:
                    </h4>
                    <div className="space-y-2">
                      {template.prompts.slice(0, 2).map((prompt, index) => (
                        <p key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-pink-500 mr-2 flex-shrink-0">•</span>
                          {prompt}
                        </p>
                      ))}
                      {template.prompts.length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          +{template.prompts.length - 2} autres questions...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Conseils d'écriture:
                    </h4>
                    <div className="space-y-1">
                      {template.suggestions.slice(0, 2).map((suggestion, index) => (
                        <p key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
                          <span className="text-purple-400 mr-2 flex-shrink-0">→</span>
                          {suggestion}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onUseTemplate(template.id)}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Utiliser ce modèle</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-100 dark:border-pink-800">
        <div className="flex items-start space-x-4">
          <LightBulbIcon className="h-6 w-6 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-300 mb-2">
              Conseils pour bien tenir votre journal
            </h3>
            <div className="space-y-2 text-sm text-pink-800 dark:text-pink-400">
              <p>
                <strong>Soyez authentique:</strong> Écrivez ce que vous ressentez vraiment, sans filtre.
              </p>
              <p>
                <strong>Notez les détails:</strong> Les petits moments sont souvent les plus précieux.
              </p>
              <p>
                <strong>Écrivez régulièrement:</strong> Même quelques lignes peuvent capturer un souvenir important.
              </p>
              <p>
                <strong>Ajoutez des photos:</strong> Elles vous aideront à vous remémorer les moments.
              </p>
              <p>
                <strong>N'oubliez pas les traditions:</strong> Documentez les coutumes et leur signification pour vous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
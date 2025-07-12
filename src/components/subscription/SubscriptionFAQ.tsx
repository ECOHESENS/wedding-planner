'use client'

import { useState } from 'react'
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
}

interface SubscriptionFAQProps {
  faqs: FAQItem[]
  className?: string
}

export default function SubscriptionFAQ({ faqs, className = '' }: SubscriptionFAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const categories = [
    {
      title: 'Abonnements & Plans',
      icon: CreditCardIcon,
      color: 'blue',
      faqs: faqs.filter(faq => 
        faq.question.toLowerCase().includes('plan') || 
        faq.question.toLowerCase().includes('abonnement') ||
        faq.question.toLowerCase().includes('changer')
      )
    },
    {
      title: 'Paiements & Facturation',
      icon: CurrencyEuroIcon,
      color: 'green',
      faqs: faqs.filter(faq => 
        faq.question.toLowerCase().includes('prix') || 
        faq.question.toLowerCase().includes('paiement') ||
        faq.question.toLowerCase().includes('taxe') ||
        faq.question.toLowerCase().includes('facturation')
      )
    },
    {
      title: 'Essais & Annulations',
      icon: ClockIcon,
      color: 'orange',
      faqs: faqs.filter(faq => 
        faq.question.toLowerCase().includes('essai') || 
        faq.question.toLowerCase().includes('annul') ||
        faq.question.toLowerCase().includes('gratuit')
      )
    },
    {
      title: 'Sécurité & Support',
      icon: ShieldCheckIcon,
      color: 'purple',
      faqs: faqs.filter(faq => 
        faq.question.toLowerCase().includes('sécurité') || 
        faq.question.toLowerCase().includes('support') ||
        faq.question.toLowerCase().includes('professionnel')
      )
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-900 dark:text-blue-300'
        }
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          text: 'text-green-900 dark:text-green-300'
        }
      case 'orange':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          text: 'text-orange-900 dark:text-orange-300'
        }
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          icon: 'text-purple-600 dark:text-purple-400',
          text: 'text-purple-900 dark:text-purple-300'
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          text: 'text-gray-900 dark:text-gray-300'
        }
    }
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <QuestionMarkCircleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Questions fréquentes
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Trouvez rapidement les réponses à vos questions sur nos abonnements, paiements et services.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((category, categoryIndex) => {
          if (category.faqs.length === 0) return null
          
          const colors = getColorClasses(category.color)
          
          return (
            <div key={categoryIndex} className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
              <div className="flex items-center mb-4">
                <category.icon className={`h-6 w-6 ${colors.icon} mr-3`} />
                <h3 className={`text-lg font-semibold ${colors.text}`}>
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = faqs.indexOf(faq)
                  const isExpanded = expandedItems.has(globalIndex)
                  
                  return (
                    <div
                      key={faqIndex}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="pt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer.split('\n').map((paragraph, pIndex) => (
                              <p key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
            Vous ne trouvez pas votre réponse ?
          </h3>
          <p className="text-indigo-800 dark:text-indigo-400 mb-4">
            Notre équipe support est là pour vous aider. Contactez-nous pour une assistance personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Contacter le support
            </button>
            <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20 px-6 py-3 rounded-lg font-semibold transition-colors">
              Programmer un appel
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {faqs.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Questions disponibles
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            24h
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Temps de réponse moyen
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            98%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Satisfaction client
          </div>
        </div>
      </div>
    </div>
  )
}
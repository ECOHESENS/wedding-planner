'use client'

import { useState } from 'react'
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { BudgetItem } from '@/types/budget'

interface BudgetStatsProps {
  budgetItems: BudgetItem[]
  totalBudget: number
  onUpdateBudget: (newBudget: number) => void
}

export default function BudgetStats({ budgetItems, totalBudget, onUpdateBudget }: BudgetStatsProps) {
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetValue, setBudgetValue] = useState(totalBudget.toString())

  const totalEstimated = budgetItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0)
  const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0)
  const totalPaid = budgetItems.reduce((sum, item) => sum + (item.paidAmount || 0), 0)
  const remaining = totalBudget - totalActual
  const usedPercentage = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0

  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetValue) || 0
    onUpdateBudget(newBudget)
    setEditingBudget(false)
  }

  const handleCancelEdit = () => {
    setBudgetValue(totalBudget.toString())
    setEditingBudget(false)
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}€`
  }

  const getProgressColor = () => {
    if (usedPercentage > 100) return 'bg-red-500'
    if (usedPercentage > 80) return 'bg-orange-500'
    return 'bg-emerald-500'
  }

  const stats = [
    {
      name: 'Budget Total',
      value: editingBudget ? (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={budgetValue}
            onChange={(e) => setBudgetValue(e.target.value)}
            className="w-24 px-2 py-1 text-xl font-bold border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveBudget()
              if (e.key === 'Escape') handleCancelEdit()
            }}
          />
          <span className="text-xl font-bold">€</span>
          <button onClick={handleSaveBudget} className="text-emerald-600 hover:text-emerald-700">
            <CheckIcon className="h-4 w-4" />
          </button>
          <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBudget)}
          </span>
          <button 
            onClick={() => setEditingBudget(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      ),
      icon: CurrencyDollarIcon,
      color: 'blue',
      description: 'Budget total prévu'
    },
    {
      name: 'Estimé',
      value: formatCurrency(totalEstimated),
      icon: ChartBarIcon,
      color: 'purple',
      description: 'Total des coûts estimés'
    },
    {
      name: 'Coût Réel',
      value: formatCurrency(totalActual),
      icon: CreditCardIcon,
      color: totalActual > totalBudget ? 'red' : 'emerald',
      description: 'Total des coûts réels'
    },
    {
      name: 'Payé',
      value: formatCurrency(totalPaid),
      icon: CheckIcon,
      color: 'green',
      description: 'Montant déjà payé'
    },
    {
      name: 'Restant',
      value: formatCurrency(remaining),
      icon: remaining < 0 ? ExclamationTriangleIcon : CurrencyDollarIcon,
      color: remaining < 0 ? 'red' : 'blue',
      description: remaining < 0 ? 'Dépassement de budget' : 'Budget restant'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                <div className="mt-1">
                  {typeof stat.value === 'string' ? (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  ) : stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Utilisation du budget
          </h3>
          <span className={`text-lg font-bold ${
            usedPercentage > 100 ? 'text-red-600' : 
            usedPercentage > 80 ? 'text-orange-600' : 'text-emerald-600'
          }`}>
            {usedPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-4 transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
          {usedPercentage > 100 && (
            <div 
              className="h-4 bg-red-300 opacity-50"
              style={{ width: `${usedPercentage - 100}%`, marginTop: '-16px' }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>0€</span>
          <span>{formatCurrency(totalBudget)}</span>
        </div>

        {usedPercentage > 100 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200 font-medium">
                Dépassement de budget: {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>
        )}

        {usedPercentage > 80 && usedPercentage <= 100 && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                Attention: vous approchez de votre budget limite
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Target, CheckCircle2, Circle, Calendar, TrendingDown, Gift, DollarSign, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { differenceInDays, endOfYear } from 'date-fns'

interface PlanningItem {
  id: string
  title: string
  description: string
  deadline: string
  savings: string
  completed: boolean
  category: 'income' | 'deduction' | 'retirement' | 'charitable'
}

const planningItems: PlanningItem[] = [
  {
    id: '1',
    title: 'Max Out 401(k) Contributions',
    description: 'Contribute up to $23,000 ($30,500 if 50+) to your employer 401(k) by December 31.',
    deadline: 'Dec 31',
    savings: 'Up to $23,000 deduction',
    completed: false,
    category: 'retirement',
  },
  {
    id: '2',
    title: 'Make IRA Contributions',
    description: 'Traditional IRA contributions can be made until April 15 of next year, but planning now helps.',
    deadline: 'Apr 15, 2025',
    savings: 'Up to $7,000 deduction',
    completed: false,
    category: 'retirement',
  },
  {
    id: '3',
    title: 'Harvest Tax Losses',
    description: 'Sell losing investments to offset capital gains. Losses above gains can offset up to $3,000 of ordinary income.',
    deadline: 'Dec 31',
    savings: 'Offset gains + $3,000',
    completed: false,
    category: 'income',
  },
  {
    id: '4',
    title: 'Donate Appreciated Stock',
    description: 'Donate stocks held over 1 year to avoid capital gains tax while getting a deduction for full market value.',
    deadline: 'Dec 31',
    savings: 'Avoid capital gains',
    completed: false,
    category: 'charitable',
  },
  {
    id: '5',
    title: 'Bunch Charitable Donations',
    description: 'If itemizing, consider "bunching" 2 years of donations into one year to exceed the standard deduction.',
    deadline: 'Dec 31',
    savings: 'Maximize itemized deductions',
    completed: false,
    category: 'charitable',
  },
  {
    id: '6',
    title: 'Defer Income',
    description: 'If possible, delay invoicing or bonuses until January to push income into the next tax year.',
    deadline: 'Dec 31',
    savings: 'Defer tax payment',
    completed: false,
    category: 'income',
  },
  {
    id: '7',
    title: 'Prepay Deductible Expenses',
    description: 'Pay mortgage, property tax, or state taxes before year-end to claim deductions this year.',
    deadline: 'Dec 31',
    savings: 'Accelerate deductions',
    completed: false,
    category: 'deduction',
  },
  {
    id: '8',
    title: 'Review FSA/HSA Spending',
    description: 'Use remaining FSA funds (use-it-or-lose-it). Max out HSA contributions for triple tax benefits.',
    deadline: 'Dec 31 (FSA)',
    savings: 'Avoid losing FSA funds',
    completed: false,
    category: 'deduction',
  },
]

const categoryIcons = {
  income: TrendingDown,
  deduction: DollarSign,
  retirement: Target,
  charitable: Gift,
}

export function YearEndPlanning() {
  const { taxProfile } = useStore()
  const [items, setItems] = useState(planningItems)
  
  const daysUntilYearEnd = differenceInDays(endOfYear(new Date()), new Date())
  const completedCount = items.filter(i => i.completed).length

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Year-End Tax Planning</h2>
          <p className="text-sm text-slate-400">Maximize your savings before December 31</p>
        </div>
      </div>

      {/* Countdown */}
      <Card variant="gradient" className="border-violet-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <p className="text-slate-400">Days Until Year End</p>
              <p className="text-3xl font-bold">{daysUntilYearEnd}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Checklist Progress</p>
            <p className="text-2xl font-bold text-emerald-400">
              {completedCount}/{items.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Planning Checklist */}
      <div className="space-y-4">
        <h3 className="font-semibold">Year-End Checklist</h3>
        
        {items.map((item) => {
          const CategoryIcon = categoryIcons[item.category]
          
          return (
            <Card 
              key={item.id}
              variant={item.completed ? 'gradient' : 'glass'}
              className={`cursor-pointer transition-all ${
                item.completed ? 'border-emerald-500/30 opacity-75' : 'hover:border-slate-600'
              }`}
              onClick={() => toggleComplete(item.id)}
            >
              <div className="flex items-start gap-4">
                <button className="mt-1 flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${item.completed ? 'line-through text-slate-500' : ''}`}>
                      {item.title}
                    </h4>
                    <CategoryIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  
                  <p className={`text-sm ${item.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline: {item.deadline}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      {item.savings}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card variant="glass">
        <h3 className="font-semibold mb-3">Your Year-End Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Current Income</p>
            <p className="text-lg font-bold">{formatCurrency(taxProfile.annualIncome || 0)}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Potential Savings</p>
            <p className="text-lg font-bold text-emerald-400">
              {formatCurrency((taxProfile.annualIncome || 0) * 0.05)}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          * Estimated savings based on completing all planning items. Actual savings depend on your specific situation.
        </p>
      </Card>
    </div>
  )
}

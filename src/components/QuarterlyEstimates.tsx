'use client'

import { useState } from 'react'
import { CalendarCheck, AlertTriangle, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { getQuarterlyDueDates } from '@/lib/tax-calculations'
import { format, isPast, isFuture, differenceInDays } from 'date-fns'

interface QuarterData {
  quarter: number
  period: string
  dueDate: Date
  estimatedAmount: number
  paidAmount: number
  paid: boolean
}

export function QuarterlyEstimates() {
  const { taxProfile } = useStore()
  const currentYear = new Date().getFullYear()
  
  const [quarters, setQuarters] = useState<QuarterData[]>(() => {
    const dueDates = getQuarterlyDueDates(currentYear)
    const estimatedQuarterly = taxProfile.selfEmploymentIncome 
      ? (taxProfile.selfEmploymentIncome * 0.153 + taxProfile.selfEmploymentIncome * 0.22) / 4
      : 0
    
    return dueDates.map(q => ({
      ...q,
      estimatedAmount: estimatedQuarterly,
      paidAmount: 0,
      paid: false,
    }))
  })

  const [annualIncome, setAnnualIncome] = useState(taxProfile.selfEmploymentIncome || 0)

  const recalculate = () => {
    const estimatedAnnualTax = annualIncome * 0.153 + annualIncome * 0.22 // SE tax + ~22% income tax
    const quarterlyAmount = estimatedAnnualTax / 4

    setQuarters(prev => prev.map(q => ({
      ...q,
      estimatedAmount: quarterlyAmount,
    })))
  }

  const togglePaid = (quarter: number) => {
    setQuarters(prev => prev.map(q => 
      q.quarter === quarter 
        ? { ...q, paid: !q.paid, paidAmount: !q.paid ? q.estimatedAmount : 0 }
        : q
    ))
  }

  const totalEstimated = quarters.reduce((sum, q) => sum + q.estimatedAmount, 0)
  const totalPaid = quarters.reduce((sum, q) => sum + q.paidAmount, 0)
  const remaining = totalEstimated - totalPaid

  const getQuarterStatus = (q: QuarterData) => {
    if (q.paid) return { color: 'emerald', icon: CheckCircle2, text: 'Paid' }
    if (isPast(q.dueDate)) return { color: 'red', icon: AlertTriangle, text: 'Overdue' }
    const daysUntil = differenceInDays(q.dueDate, new Date())
    if (daysUntil <= 30) return { color: 'amber', icon: Clock, text: `${daysUntil} days` }
    return { color: 'slate', icon: Clock, text: format(q.dueDate, 'MMM d') }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <CalendarCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Quarterly Estimates</h2>
          <p className="text-sm text-slate-400">Track your estimated tax payments</p>
        </div>
      </div>

      {/* Calculator */}
      <Card variant="glass">
        <h3 className="font-semibold mb-4">Calculate Your Quarterly Payments</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Annual Self-Employment Income"
              type="number"
              value={annualIncome || ''}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              placeholder="50000"
              icon={<span className="text-slate-500">$</span>}
            />
          </div>
          <Button onClick={recalculate}>Calculate</Button>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Includes 15.3% self-employment tax + estimated income tax
        </p>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" className="text-center">
          <p className="text-sm text-slate-400 mb-1">Total Estimated</p>
          <p className="text-xl font-bold">{formatCurrency(totalEstimated)}</p>
        </Card>
        <Card variant="glass" className="text-center">
          <p className="text-sm text-slate-400 mb-1">Total Paid</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalPaid)}</p>
        </Card>
        <Card variant="glass" className="text-center">
          <p className="text-sm text-slate-400 mb-1">Remaining</p>
          <p className="text-xl font-bold text-amber-400">{formatCurrency(remaining)}</p>
        </Card>
      </div>

      {/* Quarterly Breakdown */}
      <div className="space-y-4">
        <h3 className="font-semibold">{currentYear} Quarterly Payments</h3>
        
        {quarters.map((q) => {
          const status = getQuarterStatus(q)
          const StatusIcon = status.icon
          
          return (
            <Card 
              key={q.quarter} 
              variant={q.paid ? 'gradient' : 'glass'}
              className={q.paid ? 'border-emerald-500/30' : ''}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-${status.color}-500/20 flex items-center justify-center`}>
                    <span className="text-lg font-bold">Q{q.quarter}</span>
                  </div>
                  <div>
                    <p className="font-semibold">Quarter {q.quarter}</p>
                    <p className="text-sm text-slate-400">{q.period}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Due Date</p>
                    <p className="font-medium">{format(q.dueDate, 'MMM d, yyyy')}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-400">Amount</p>
                    <p className="font-bold text-lg">{formatCurrency(q.estimatedAmount)}</p>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-${status.color}-500/10 text-${status.color}-400`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{status.text}</span>
                  </div>

                  <Button
                    variant={q.paid ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={() => togglePaid(q.quarter)}
                  >
                    {q.paid ? 'Undo' : 'Mark Paid'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* IRS Info */}
      <Card variant="glass" className="border-blue-500/20">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-400 mb-1">IRS Payment Methods</p>
            <p className="text-slate-400">
              Pay online at{' '}
              <a 
                href="https://www.irs.gov/payments" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                IRS.gov/Payments
              </a>
              {' '}using Direct Pay, debit/credit card, or EFTPS. Use Form 1040-ES for payment vouchers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

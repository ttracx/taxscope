'use client'

import { useState } from 'react'
import { FileSearch, Sparkles, Check, AlertCircle, ArrowRight, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

interface Deduction {
  category: string
  name: string
  estimatedAmount: number
  description: string
  requirements: string
  likelihood: 'high' | 'medium' | 'low'
}

const categoryIcons: Record<string, string> = {
  home_office: '🏠',
  vehicle: '🚗',
  charitable: '❤️',
  medical: '🏥',
  education: '📚',
  business: '💼',
  other: '📋',
}

const likelihoodColors = {
  high: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
}

export function DeductionFinder() {
  const { taxProfile } = useStore()
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleFindDeductions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/deductions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: taxProfile }),
      })
      const data = await res.json()
      setDeductions(data.deductions || [])
      setSearched(true)
    } catch (error) {
      console.error('Deduction finder error:', error)
    }
    setLoading(false)
  }

  const totalPotentialSavings = deductions
    .filter(d => d.likelihood !== 'low')
    .reduce((sum, d) => sum + (d.estimatedAmount || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <FileSearch className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Deduction Finder</h2>
          <p className="text-sm text-slate-400">Discover deductions you may be missing</p>
        </div>
      </div>

      {/* Profile Summary */}
      <Card variant="glass">
        <h3 className="font-semibold mb-3">Your Tax Profile</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Filing Status</p>
            <p className="font-medium">{taxProfile.filingStatus?.replace('_', ' ') || 'Not set'}</p>
          </div>
          <div>
            <p className="text-slate-400">Annual Income</p>
            <p className="font-medium">{formatCurrency(taxProfile.annualIncome || 0)}</p>
          </div>
          <div>
            <p className="text-slate-400">Self-Employed</p>
            <p className="font-medium">{taxProfile.selfEmployed ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-slate-400">Dependents</p>
            <p className="font-medium">{taxProfile.dependents || 0}</p>
          </div>
        </div>

        <Button onClick={handleFindDeductions} loading={loading} className="mt-4">
          <Sparkles className="w-4 h-4" />
          Find My Deductions
        </Button>
      </Card>

      {/* Results */}
      {searched && (
        <>
          {/* Summary */}
          {deductions.length > 0 && (
            <Card variant="gradient" className="border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400">Potential Tax Savings Found</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(totalPotentialSavings * 0.22)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Based on {deductions.length} possible deductions totaling {formatCurrency(totalPotentialSavings)}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Deduction List */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {deductions.length > 0 ? `${deductions.length} Deductions Found` : 'No Deductions Found'}
            </h3>

            {deductions.length === 0 && (
              <Card variant="glass">
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">
                    Update your tax profile with more details to find potential deductions.
                  </p>
                </div>
              </Card>
            )}

            {deductions.map((deduction, i) => (
              <Card key={i} variant="glass" className="hover:border-slate-600 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{categoryIcons[deduction.category] || '📋'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{deduction.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${likelihoodColors[deduction.likelihood]}`}>
                        {deduction.likelihood} likelihood
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{deduction.description}</p>
                    
                    {deduction.estimatedAmount > 0 && (
                      <p className="text-sm">
                        <span className="text-slate-500">Estimated value:</span>{' '}
                        <span className="font-semibold text-emerald-400">
                          {formatCurrency(deduction.estimatedAmount)}
                        </span>
                      </p>
                    )}
                    
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase mb-1">Requirements</p>
                      <p className="text-sm text-slate-300">{deduction.requirements}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

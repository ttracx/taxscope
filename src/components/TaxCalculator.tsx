'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, ArrowRight, Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useStore } from '@/lib/store'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface TaxResult {
  grossIncome: number
  standardDeduction: number
  itemizedDeductions: number
  deductionUsed: string
  taxableIncome: number
  federalTax: number
  selfEmploymentTax: number
  totalTax: number
  effectiveRate: number
  marginalRate: number
  bracketBreakdown: { bracket: string; tax: number }[]
  withholdings: number
  estimatedOwed: number
  quarterlyPayment: number
}

export function TaxCalculator() {
  const { taxProfile, setTaxProfile } = useStore()
  const [result, setResult] = useState<TaxResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    filingStatus: taxProfile.filingStatus || 'single',
    grossIncome: taxProfile.annualIncome || 0,
    selfEmploymentIncome: taxProfile.selfEmploymentIncome || 0,
    deductions: taxProfile.deductions || 0,
    withholdings: 0,
  })

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setResult(data)
      
      // Update profile
      setTaxProfile({
        filingStatus: formData.filingStatus,
        annualIncome: formData.grossIncome,
        selfEmploymentIncome: formData.selfEmploymentIncome,
        deductions: formData.deductions,
      })
    } catch (error) {
      console.error('Calculation error:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (formData.grossIncome > 0) {
      handleCalculate()
    }
  }, []) // eslint-disable-line

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Tax Bracket Calculator</h2>
          <p className="text-sm text-slate-400">See exactly how your income is taxed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card variant="glass">
          <h3 className="font-semibold mb-4">Your Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Filing Status</label>
              <select
                value={formData.filingStatus}
                onChange={(e) => setFormData({ ...formData, filingStatus: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="single">Single</option>
                <option value="married_joint">Married Filing Jointly</option>
                <option value="married_separate">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>

            <Input
              label="Gross Annual Income"
              type="number"
              value={formData.grossIncome || ''}
              onChange={(e) => setFormData({ ...formData, grossIncome: Number(e.target.value) })}
              placeholder="75000"
              icon={<span className="text-slate-500">$</span>}
            />

            <Input
              label="Self-Employment Income (if any)"
              type="number"
              value={formData.selfEmploymentIncome || ''}
              onChange={(e) => setFormData({ ...formData, selfEmploymentIncome: Number(e.target.value) })}
              placeholder="0"
              icon={<span className="text-slate-500">$</span>}
            />

            <Input
              label="Itemized Deductions (if higher than standard)"
              type="number"
              value={formData.deductions || ''}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              placeholder="0"
              icon={<span className="text-slate-500">$</span>}
            />

            <Input
              label="Tax Withholdings (from paychecks)"
              type="number"
              value={formData.withholdings || ''}
              onChange={(e) => setFormData({ ...formData, withholdings: Number(e.target.value) })}
              placeholder="0"
              icon={<span className="text-slate-500">$</span>}
            />

            <Button onClick={handleCalculate} loading={loading} className="w-full">
              Calculate Taxes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="glass" className="text-center">
                <p className="text-sm text-slate-400 mb-1">Total Tax</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(result.totalTax)}</p>
              </Card>
              <Card variant="glass" className="text-center">
                <p className="text-sm text-slate-400 mb-1">Effective Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{formatPercent(result.effectiveRate)}</p>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card variant="gradient">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Tax Breakdown
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Income</span>
                  <span className="font-medium">{formatCurrency(result.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {result.deductionUsed === 'standard' ? 'Standard' : 'Itemized'} Deduction
                  </span>
                  <span className="font-medium text-emerald-400">
                    -{formatCurrency(result.deductionUsed === 'standard' ? result.standardDeduction : result.itemizedDeductions)}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between">
                  <span className="text-slate-400">Taxable Income</span>
                  <span className="font-bold">{formatCurrency(result.taxableIncome)}</span>
                </div>
              </div>
            </Card>

            {/* Bracket Breakdown */}
            <Card variant="glass">
              <h3 className="font-semibold mb-4">Bracket Breakdown</h3>
              <div className="space-y-2">
                {result.bracketBreakdown.map((bracket, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{bracket.bracket}</span>
                    <span className="font-medium">{formatCurrency(bracket.tax)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-2 flex justify-between">
                  <span className="font-medium">Federal Tax</span>
                  <span className="font-bold">{formatCurrency(result.federalTax)}</span>
                </div>
                {result.selfEmploymentTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Self-Employment Tax</span>
                    <span className="font-medium">{formatCurrency(result.selfEmploymentTax)}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Owing/Refund */}
            <Card variant={result.estimatedOwed > 0 ? 'glass' : 'gradient'}>
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-slate-400">
                    {result.estimatedOwed > 0 ? 'Estimated Amount Owed' : 'Estimated Refund'}
                  </p>
                  <p className={`text-xl font-bold ${result.estimatedOwed > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatCurrency(Math.abs(result.estimatedOwed))}
                  </p>
                </div>
              </div>
              {result.quarterlyPayment > 0 && (
                <p className="text-sm text-slate-400 mt-2">
                  Quarterly payment: {formatCurrency(result.quarterlyPayment)}
                </p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

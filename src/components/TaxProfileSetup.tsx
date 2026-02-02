'use client'

import { useState } from 'react'
import { Settings, ChevronUp, ChevronDown, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

export function TaxProfileSetup() {
  const { taxProfile, setTaxProfile } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-slate-800/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 transition"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">Tax Profile</span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-3 pt-0 space-y-3">
          <div>
            <label className="text-xs text-slate-500">Filing Status</label>
            <select
              value={taxProfile.filingStatus}
              onChange={(e) => setTaxProfile({ filingStatus: e.target.value })}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="single">Single</option>
              <option value="married_joint">Married Filing Jointly</option>
              <option value="married_separate">Married Filing Separately</option>
              <option value="head_of_household">Head of Household</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500">Annual Income</label>
            <input
              type="number"
              value={taxProfile.annualIncome || ''}
              onChange={(e) => setTaxProfile({ annualIncome: Number(e.target.value) })}
              placeholder="75000"
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Self-Employment Income</label>
            <input
              type="number"
              value={taxProfile.selfEmploymentIncome || ''}
              onChange={(e) => setTaxProfile({ selfEmploymentIncome: Number(e.target.value) })}
              placeholder="0"
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">State</label>
            <input
              type="text"
              value={taxProfile.state || ''}
              onChange={(e) => setTaxProfile({ state: e.target.value })}
              placeholder="TX"
              maxLength={2}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selfEmployed"
              checked={taxProfile.selfEmployed}
              onChange={(e) => setTaxProfile({ selfEmployed: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="selfEmployed" className="text-sm">Self-Employed</label>
          </div>

          <div>
            <label className="text-xs text-slate-500">Dependents</label>
            <input
              type="number"
              value={taxProfile.dependents || ''}
              onChange={(e) => setTaxProfile({ dependents: Number(e.target.value) })}
              placeholder="0"
              min="0"
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <Button 
            size="sm" 
            className="w-full" 
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Save className="w-3 h-3" />
                Saved!
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

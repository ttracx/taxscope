'use client'

import { useState } from 'react'
import { Lightbulb, Star, Clock, DollarSign, Home, Car, Heart, GraduationCap, Briefcase, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

interface TaxTip {
  id: string
  category: string
  title: string
  description: string
  savings: string
  icon: typeof Lightbulb
  priority: 'high' | 'medium' | 'low'
}

const allTips: TaxTip[] = [
  {
    id: '1',
    category: 'Home Office',
    title: 'Home Office Deduction',
    description: 'If you work from home, deduct a portion of rent/mortgage, utilities, and internet. Use the simplified method ($5/sq ft up to 300 sq ft = $1,500 max) or actual expense method.',
    savings: 'Up to $1,500+',
    icon: Home,
    priority: 'high',
  },
  {
    id: '2',
    category: 'Vehicle',
    title: 'Vehicle Expense Deduction',
    description: 'Track business miles for a deduction of 67 cents per mile (2024). Keep a mileage log with date, destination, and business purpose.',
    savings: '67¢/mile',
    icon: Car,
    priority: 'high',
  },
  {
    id: '3',
    category: 'Retirement',
    title: 'Maximize Retirement Contributions',
    description: 'Contribute to a Traditional IRA ($7,000 limit, $8,000 if 50+) or SEP-IRA (25% of income, up to $69,000) to reduce taxable income.',
    savings: 'Up to $69,000',
    icon: TrendingUp,
    priority: 'high',
  },
  {
    id: '4',
    category: 'Charitable',
    title: 'Charitable Donations',
    description: 'Donate cash, goods, or appreciated stock to qualified charities. Stock donations avoid capital gains tax. Keep receipts for donations over $250.',
    savings: 'Varies',
    icon: Heart,
    priority: 'medium',
  },
  {
    id: '5',
    category: 'Education',
    title: 'Education Credits',
    description: 'Claim the American Opportunity Credit (up to $2,500) or Lifetime Learning Credit (up to $2,000) for tuition and education expenses.',
    savings: 'Up to $2,500',
    icon: GraduationCap,
    priority: 'medium',
  },
  {
    id: '6',
    category: 'Business',
    title: 'Section 199A Deduction',
    description: 'Self-employed? You may qualify for a 20% deduction on qualified business income (QBI) from pass-through entities.',
    savings: '20% of QBI',
    icon: Briefcase,
    priority: 'high',
  },
  {
    id: '7',
    category: 'Health',
    title: 'HSA Contributions',
    description: 'Contribute to a Health Savings Account ($4,150 individual, $8,300 family in 2024). Triple tax advantage: deductible, grows tax-free, withdrawals tax-free for medical.',
    savings: 'Up to $8,300',
    icon: DollarSign,
    priority: 'high',
  },
  {
    id: '8',
    category: 'Timing',
    title: 'Defer Income / Accelerate Deductions',
    description: 'If expecting lower income next year, defer invoices to January. Or prepay deductible expenses (mortgage, property tax) by December 31.',
    savings: 'Varies',
    icon: Clock,
    priority: 'medium',
  },
]

const categories = ['All', 'Home Office', 'Vehicle', 'Retirement', 'Charitable', 'Education', 'Business', 'Health', 'Timing']

const priorityColors = {
  high: 'border-emerald-500/30 bg-emerald-500/5',
  medium: 'border-amber-500/30 bg-amber-500/5',
  low: 'border-slate-500/30',
}

export function TaxTips() {
  const { taxProfile } = useStore()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [savedTips, setSavedTips] = useState<string[]>([])

  const filteredTips = selectedCategory === 'All' 
    ? allTips 
    : allTips.filter(tip => tip.category === selectedCategory)

  const toggleSaved = (id: string) => {
    setSavedTips(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Smart Tax Tips</h2>
          <p className="text-sm text-slate-400">Personalized strategies to save on taxes</p>
        </div>
      </div>

      {/* Personalized Note */}
      {taxProfile.selfEmployed && (
        <Card variant="gradient" className="border-emerald-500/20">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-semibold">Self-Employment Detected</p>
              <p className="text-sm text-slate-400">
                As a self-employed individual, pay special attention to tips marked with high priority—they can save you thousands!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => (
          <Card 
            key={tip.id} 
            variant="glass" 
            className={`transition-all hover:border-slate-600 ${priorityColors[tip.priority]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <tip.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase">{tip.category}</span>
                  <h3 className="font-semibold">{tip.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => toggleSaved(tip.id)}
                className={`p-1.5 rounded-lg transition ${
                  savedTips.includes(tip.id) 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-slate-800 text-slate-500 hover:text-amber-400'
                }`}
              >
                <Star className="w-4 h-4" fill={savedTips.includes(tip.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-3">{tip.description}</p>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                tip.priority === 'high' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {tip.priority} priority
              </span>
              <span className="text-sm font-semibold text-emerald-400">
                Savings: {tip.savings}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Saved Tips */}
      {savedTips.length > 0 && (
        <Card variant="glass">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Your Saved Tips ({savedTips.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedTips.map(id => {
              const tip = allTips.find(t => t.id === id)
              return tip ? (
                <span key={id} className="px-3 py-1.5 bg-slate-800 rounded-full text-sm">
                  {tip.title}
                </span>
              ) : null
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

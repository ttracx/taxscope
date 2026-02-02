'use client'

import { useState } from 'react'
import { 
  Calculator, 
  FileSearch, 
  CalendarCheck, 
  Upload, 
  Lightbulb, 
  Target,
  MessageSquare,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Percent,
  PiggyBank
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useStore } from '@/lib/store'
import { TaxCalculator } from '@/components/TaxCalculator'
import { DeductionFinder } from '@/components/DeductionFinder'
import { QuarterlyEstimates } from '@/components/QuarterlyEstimates'
import { DocumentUpload } from '@/components/DocumentUpload'
import { TaxTips } from '@/components/TaxTips'
import { YearEndPlanning } from '@/components/YearEndPlanning'
import { TaxChat } from '@/components/TaxChat'
import { TaxProfileSetup } from '@/components/TaxProfileSetup'

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'calculator', icon: Calculator, label: 'Tax Calculator' },
  { id: 'deductions', icon: FileSearch, label: 'Deduction Finder' },
  { id: 'quarterly', icon: CalendarCheck, label: 'Quarterly Estimates' },
  { id: 'documents', icon: Upload, label: 'Documents' },
  { id: 'tips', icon: Lightbulb, label: 'Tax Tips' },
  { id: 'planning', icon: Target, label: 'Year-End Planning' },
  { id: 'chat', icon: MessageSquare, label: 'AI Assistant' },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { activeTab, setActiveTab, taxProfile } = useStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <TaxCalculator />
      case 'deductions':
        return <DeductionFinder />
      case 'quarterly':
        return <QuarterlyEstimates />
      case 'documents':
        return <DocumentUpload />
      case 'tips':
        return <TaxTips />
      case 'planning':
        return <YearEndPlanning />
      case 'chat':
        return <TaxChat />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">TaxScope</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                ${activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <TaxProfileSetup />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Tax Year 2024</span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

function DashboardOverview() {
  const { taxProfile, setActiveTab } = useStore()

  const quickStats = [
    { 
      label: 'Annual Income', 
      value: `$${(taxProfile.annualIncome || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'emerald' 
    },
    { 
      label: 'Filing Status', 
      value: taxProfile.filingStatus?.replace('_', ' ') || 'Not set', 
      icon: Settings, 
      color: 'blue' 
    },
    { 
      label: 'Est. Tax Rate', 
      value: taxProfile.annualIncome ? '~22%' : 'N/A', 
      icon: Percent, 
      color: 'purple' 
    },
    { 
      label: 'Potential Savings', 
      value: taxProfile.annualIncome ? '~$3,500' : 'Calculate →', 
      icon: PiggyBank, 
      color: 'orange' 
    },
  ]

  const quickActions = [
    { id: 'calculator', icon: Calculator, label: 'Calculate Taxes', desc: 'See your tax breakdown' },
    { id: 'deductions', icon: FileSearch, label: 'Find Deductions', desc: 'Discover savings' },
    { id: 'quarterly', icon: CalendarCheck, label: 'Quarterly Payments', desc: 'Track deadlines' },
    { id: 'chat', icon: MessageSquare, label: 'Ask AI Assistant', desc: 'Get tax advice' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome to TaxScope</h2>
          <p className="text-slate-400">Let&apos;s optimize your taxes together.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Card key={i} variant="glass" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className="relative">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.id}
              variant="glass" 
              className="cursor-pointer hover:border-emerald-500/30 transition-all group"
              onClick={() => setActiveTab(action.id)}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition">
                <action.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-semibold">{action.label}</h4>
              <p className="text-sm text-slate-400">{action.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tax Tips Preview */}
      <Card variant="gradient">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">💡 Tax Tip of the Day</h3>
            <p className="text-slate-300">
              If you work from home, you may be able to deduct a portion of your rent, utilities, and internet 
              as a home office expense. The simplified method allows $5 per square foot, up to 300 sq ft.
            </p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => setActiveTab('tips')}>
              View More Tips →
            </Button>
          </div>
        </div>
      </Card>

      {/* Upcoming Deadlines */}
      <Card variant="glass">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-400" />
          Upcoming Tax Deadlines
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <p className="font-medium">Q4 Estimated Tax Payment</p>
              <p className="text-sm text-slate-400">2024 Tax Year</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-amber-400">Jan 15, 2025</p>
              <p className="text-xs text-slate-500">Due Soon</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <p className="font-medium">Tax Filing Deadline</p>
              <p className="text-sm text-slate-400">2024 Tax Year</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Apr 15, 2025</p>
              <p className="text-xs text-slate-500">~4 months away</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

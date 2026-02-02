'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calculator, 
  FileSearch, 
  CalendarCheck, 
  Upload, 
  Lightbulb, 
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: FileSearch,
    title: 'Deduction Finder',
    description: 'AI-powered analysis finds every deduction you qualify for based on your unique situation.',
  },
  {
    icon: Calculator,
    title: 'Tax Bracket Calculator',
    description: 'See exactly how your income is taxed across federal brackets with visual breakdowns.',
  },
  {
    icon: CalendarCheck,
    title: 'Quarterly Estimates',
    description: 'Never miss a quarterly payment. Track deadlines and calculate accurate estimates.',
  },
  {
    icon: Upload,
    title: 'Document Analysis',
    description: 'Upload W-2s, 1099s, and receipts. AI extracts and organizes the data automatically.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Tax Tips',
    description: 'Personalized recommendations based on your profile to optimize your tax strategy.',
  },
  {
    icon: Target,
    title: 'Year-End Planning',
    description: 'Strategic planning tools to maximize deductions before the year ends.',
  },
]

const benefits = [
  'Find hidden deductions worth thousands',
  'Calculate taxes in seconds',
  'Never miss quarterly deadlines',
  'AI-powered document analysis',
  'Personalized tax strategies',
  '24/7 tax assistant access',
]

export default function HomePage() {
  const [email, setEmail] = useState('')

  const handleGetStarted = async () => {
    if (!email) return
    
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TaxScope</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-slate-400 hover:text-white transition">Features</Link>
              <Link href="#pricing" className="text-slate-400 hover:text-white transition">Pricing</Link>
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
            </nav>
            <Link href="/dashboard">
              <Button>Launch App</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">AI-Powered Tax Optimization</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Maximize Your Tax Savings<br />
            <span className="gradient-text">With AI Intelligence</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            TaxScope uses advanced AI to find every deduction, calculate your taxes instantly, 
            and provide personalized strategies to keep more money in your pocket.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-auto flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <Button size="lg" onClick={handleGetStarted} className="w-full sm:w-auto">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Bank-level security
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Instant calculations
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Optimize Your Taxes
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful AI tools designed to make tax optimization accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} variant="glass" className="group hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400">
              One plan with everything you need. No hidden fees.
            </p>
          </div>

          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">TaxScope Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mb-6">
                  Everything you need to maximize your tax savings and stay compliant.
                </p>
                <Button size="lg" className="w-full" onClick={handleGetStarted}>
                  Get Started Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Save More on Taxes?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered hidden deductions and optimized their tax strategy with TaxScope.
          </p>
          <Link href="/dashboard">
            <Button size="lg">
              Launch TaxScope
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">TaxScope</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TaxScope. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

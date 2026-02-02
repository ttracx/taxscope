import { NextRequest, NextResponse } from 'next/server'
import { findDeductions } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json()

    if (!profile) {
      return NextResponse.json({ error: 'Profile required' }, { status: 400 })
    }

    const profileString = `
Filing Status: ${profile.filingStatus}
Annual Income: $${profile.annualIncome?.toLocaleString() || 0}
Self-Employment Income: $${profile.selfEmploymentIncome?.toLocaleString() || 0}
State: ${profile.state || 'Not specified'}
Self-Employed: ${profile.selfEmployed ? 'Yes' : 'No'}
Dependents: ${profile.dependents || 0}
Current Deductions: $${profile.deductions?.toLocaleString() || 0}
`

    const result = await findDeductions(profileString)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Deductions API error:', error)
    return NextResponse.json(
      { error: 'Failed to find deductions' },
      { status: 500 }
    )
  }
}

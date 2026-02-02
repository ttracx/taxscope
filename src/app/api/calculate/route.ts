import { NextRequest, NextResponse } from 'next/server'
import { calculateTax, type FilingStatus } from '@/lib/tax-calculations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const result = calculateTax({
      filingStatus: (body.filingStatus || 'single') as FilingStatus,
      grossIncome: Number(body.grossIncome) || 0,
      selfEmploymentIncome: Number(body.selfEmploymentIncome) || 0,
      deductions: Number(body.deductions) || 0,
      withholdings: Number(body.withholdings) || 0,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Calculate API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate taxes' },
      { status: 500 }
    )
  }
}

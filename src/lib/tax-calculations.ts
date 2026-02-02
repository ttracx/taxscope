// 2024 Federal Tax Brackets
export const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
}

export const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
}

export const FICA_RATE = 0.0765 // Employee portion
export const SELF_EMPLOYMENT_TAX_RATE = 0.153 // Full FICA for self-employed

export type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household'

export interface TaxCalculationInput {
  filingStatus: FilingStatus
  grossIncome: number
  selfEmploymentIncome?: number
  deductions?: number
  withholdings?: number
}

export interface TaxCalculationResult {
  grossIncome: number
  standardDeduction: number
  itemizedDeductions: number
  deductionUsed: 'standard' | 'itemized'
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

export function calculateFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus
): { tax: number; marginalRate: number; breakdown: { bracket: string; tax: number }[] } {
  const brackets = TAX_BRACKETS_2024[filingStatus]
  let tax = 0
  let marginalRate = 0
  const breakdown: { bracket: string; tax: number }[] = []

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min
      const taxInBracket = taxableInBracket * bracket.rate
      tax += taxInBracket
      marginalRate = bracket.rate

      if (taxInBracket > 0) {
        breakdown.push({
          bracket: `${(bracket.rate * 100).toFixed(0)}% ($${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '+' : bracket.max.toLocaleString()})`,
          tax: taxInBracket,
        })
      }
    }
  }

  return { tax, marginalRate, breakdown }
}

export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  const { filingStatus, grossIncome, selfEmploymentIncome = 0, deductions = 0, withholdings = 0 } = input

  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus]
  const deductionUsed = deductions > standardDeduction ? 'itemized' : 'standard'
  const actualDeduction = Math.max(deductions, standardDeduction)

  // Self-employment tax (calculated on 92.35% of SE income)
  const selfEmploymentTaxBase = selfEmploymentIncome * 0.9235
  const selfEmploymentTax = selfEmploymentTaxBase * SELF_EMPLOYMENT_TAX_RATE

  // Half of SE tax is deductible
  const seDeduction = selfEmploymentTax / 2

  const taxableIncome = Math.max(0, grossIncome - actualDeduction - seDeduction)

  const { tax: federalTax, marginalRate, breakdown } = calculateFederalTax(taxableIncome, filingStatus)

  const totalTax = federalTax + selfEmploymentTax
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0
  const estimatedOwed = totalTax - withholdings
  const quarterlyPayment = Math.max(0, estimatedOwed / 4)

  return {
    grossIncome,
    standardDeduction,
    itemizedDeductions: deductions,
    deductionUsed,
    taxableIncome,
    federalTax,
    selfEmploymentTax,
    totalTax,
    effectiveRate,
    marginalRate,
    bracketBreakdown: breakdown,
    withholdings,
    estimatedOwed,
    quarterlyPayment,
  }
}

export function getQuarterlyDueDates(year: number) {
  return [
    { quarter: 1, period: 'Jan 1 - Mar 31', dueDate: new Date(year, 3, 15) }, // April 15
    { quarter: 2, period: 'Apr 1 - May 31', dueDate: new Date(year, 5, 15) }, // June 15
    { quarter: 3, period: 'Jun 1 - Aug 31', dueDate: new Date(year, 8, 15) }, // Sept 15
    { quarter: 4, period: 'Sep 1 - Dec 31', dueDate: new Date(year + 1, 0, 15) }, // Jan 15 next year
  ]
}

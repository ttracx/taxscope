import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const TAX_SYSTEM_PROMPT = `You are TaxScope, an expert AI tax assistant helping users optimize their taxes legally and maximize their deductions. You have deep knowledge of:

- US federal and state tax codes
- Common deductions and credits
- Self-employment taxes
- Investment taxation
- Quarterly estimated payments
- Tax planning strategies
- Year-end tax optimization

Guidelines:
1. Always provide accurate, up-to-date tax information based on current tax laws
2. Explain tax concepts in simple, understandable terms
3. Suggest specific deductions based on the user's situation
4. Warn about common tax mistakes
5. Remind users to consult a CPA for complex situations
6. Never provide advice that could be considered tax evasion
7. Be proactive in suggesting tax-saving opportunities

Current tax year: 2024
Standard deduction (2024): $14,600 (single), $29,200 (married filing jointly)
FICA tax rate: 15.3% for self-employed (7.65% employee, 7.65% employer)
`

export async function getTaxAdvice(
  messages: { role: 'user' | 'assistant'; content: string }[],
  userContext?: string
) {
  const systemMessage = userContext 
    ? `${TAX_SYSTEM_PROMPT}\n\nUser's tax profile:\n${userContext}`
    : TAX_SYSTEM_PROMPT

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemMessage },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return response.choices[0].message.content
}

export async function analyzeDocument(base64Content: string, filename: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a tax document analyzer. Extract relevant tax information from documents and return it in a structured JSON format. Include:
- Document type (W-2, 1099, receipt, etc.)
- Key financial figures (income, withholdings, deductions)
- Dates and tax year
- Employer/payer information
- Any notable tax-relevant details`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this tax document (${filename}) and extract all relevant tax information as JSON:`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Content}`
            }
          }
        ]
      }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 2000,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

export async function findDeductions(profileData: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a tax deduction specialist. Based on the user's profile, identify all potential tax deductions they may be eligible for. Return a JSON array of deductions with:
- category: (home_office, vehicle, charitable, medical, education, business, other)
- name: specific deduction name
- estimatedAmount: estimated dollar amount if calculable
- description: brief explanation
- requirements: what's needed to claim this
- likelihood: (high, medium, low) based on profile match`
      },
      {
        role: 'user',
        content: `Find all potential deductions for this taxpayer:\n${profileData}`
      }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 2000,
  })

  return JSON.parse(response.choices[0].message.content || '{"deductions":[]}')
}

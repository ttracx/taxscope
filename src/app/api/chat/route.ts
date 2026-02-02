import { NextRequest, NextResponse } from 'next/server'
import { getTaxAdvice } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    const response = await getTaxAdvice(messages, userContext)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}

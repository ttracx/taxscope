'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Sparkles, User, Bot, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/lib/store'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TaxChat() {
  const { taxProfile, messages, addMessage, clearMessages } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMessage })
    setLoading(true)

    try {
      // Build context from profile
      const userContext = `
Filing Status: ${taxProfile.filingStatus || 'Not specified'}
Annual Income: $${taxProfile.annualIncome?.toLocaleString() || 'Not specified'}
Self-Employment Income: $${taxProfile.selfEmploymentIncome?.toLocaleString() || 0}
State: ${taxProfile.state || 'Not specified'}
Self-Employed: ${taxProfile.selfEmployed ? 'Yes' : 'No'}
Dependents: ${taxProfile.dependents || 0}
`

      const chatMessages = [...messages, { role: 'user' as const, content: userMessage }]
        .slice(-10) // Keep last 10 messages for context
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, userContext }),
      })

      const data = await res.json()
      
      if (data.message) {
        addMessage({ role: 'assistant', content: data.message })
      }
    } catch (error) {
      console.error('Chat error:', error)
      addMessage({ 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      })
    }

    setLoading(false)
  }

  const suggestedQuestions = [
    'What deductions am I missing?',
    'How can I reduce my tax bill?',
    'Should I itemize or take the standard deduction?',
    'How do I calculate quarterly taxes?',
  ]

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Tax Assistant</h2>
            <p className="text-sm text-slate-400">Ask me anything about taxes</p>
          </div>
        </div>
        
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <Card variant="glass" className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">How can I help with your taxes?</h3>
              <p className="text-slate-400 mb-6 max-w-md">
                I can help you find deductions, explain tax concepts, calculate estimates, and provide personalized tax advice.
              </p>
              
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="p-3 bg-slate-800/50 rounded-lg text-sm text-left hover:bg-slate-700/50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about deductions, tax strategies, or anything tax-related..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            TaxScope AI provides general information, not professional tax advice. Consult a CPA for complex situations.
          </p>
        </form>
      </Card>
    </div>
  )
}

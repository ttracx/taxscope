import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TaxProfile {
  filingStatus: string
  annualIncome: number
  selfEmploymentIncome: number
  state: string
  selfEmployed: boolean
  dependents: number
  deductions: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AppState {
  // User
  user: { id: string; email: string; name?: string } | null
  setUser: (user: AppState['user']) => void
  
  // Tax Profile
  taxProfile: TaxProfile
  setTaxProfile: (profile: Partial<TaxProfile>) => void
  
  // Chat
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  
  // UI
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Tax Profile
      taxProfile: {
        filingStatus: 'single',
        annualIncome: 0,
        selfEmploymentIncome: 0,
        state: '',
        selfEmployed: false,
        dependents: 0,
        deductions: 0,
      },
      setTaxProfile: (profile) =>
        set((state) => ({
          taxProfile: { ...state.taxProfile, ...profile },
        })),
      
      // Chat
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      
      // UI
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'taxscope-storage',
      partialize: (state) => ({ taxProfile: state.taxProfile }),
    }
  )
)

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TaxScope - AI Tax Optimization Assistant',
  description: 'Maximize your tax savings with AI-powered deduction finding, bracket calculations, and year-end planning.',
  keywords: ['tax', 'deductions', 'tax optimization', 'AI', 'tax planning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white min-h-screen antialiased`}>
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}

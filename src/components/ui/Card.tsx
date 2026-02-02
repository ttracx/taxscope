'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-800/50 border border-slate-700/50',
      glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
      gradient: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

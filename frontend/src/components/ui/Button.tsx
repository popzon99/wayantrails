'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const baseStyles = cn(
    // Base styles
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none',

    // Full width
    fullWidth && 'w-full',

    // Size variants
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'px-8 py-4 text-xl': size === 'xl',
    },

    // Color variants
    {
      // Primary - Sand tan
      'bg-sand-tan text-white shadow-md hover:bg-sand-tan-dark hover:-translate-y-0.5 hover:shadow-lg focus:ring-sand-tan active:translate-y-0 active:shadow-md':
        variant === 'primary',

      // Secondary - Night blue
      'bg-night-blue text-white shadow-md hover:bg-night-blue-dark hover:-translate-y-0.5 hover:shadow-lg focus:ring-night-blue active:translate-y-0 active:shadow-md':
        variant === 'secondary',

      // Outline - Sand tan border
      'border-2 border-sand-tan text-sand-tan bg-transparent hover:bg-sand-tan hover:text-white focus:ring-sand-tan':
        variant === 'outline',

      // Ghost - Minimal
      'text-night-blue bg-transparent hover:bg-mist focus:ring-night-blue':
        variant === 'ghost',

      // Danger - Error color
      'bg-error text-white shadow-md hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg focus:ring-error active:translate-y-0 active:shadow-md':
        variant === 'danger',
    },

    className
  )

  return (
    <motion.button
      ref={ref}
      className={baseStyles}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {!loading && leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}

      <span className={cn(loading && 'opacity-70')}>
        {children}
      </span>

      {!loading && rightIcon && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'

export { Button }
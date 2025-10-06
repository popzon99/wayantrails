import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  elevation = 'md',
  hoverable = false,
  padding = 'md',
  rounded = 'xl',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base styles
        'bg-white border border-gray-100',
        'transition-all duration-300 ease-out',

        // Elevation (shadow)
        {
          'shadow-none': elevation === 'none',
          'shadow-sm': elevation === 'sm',
          'shadow-premium': elevation === 'md',
          'shadow-premium-lg': elevation === 'lg',
        },

        // Hoverable effect
        hoverable && 'hover:shadow-premium-lg hover:scale-105 cursor-pointer',

        // Padding
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },

        // Border radius
        {
          'rounded-none': rounded === 'none',
          'rounded-sm': rounded === 'sm',
          'rounded-md': rounded === 'md',
          'rounded-lg': rounded === 'lg',
          'rounded-xl': rounded === 'xl',
          'rounded-2xl': rounded === '2xl',
        },

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card sub-components for composition
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn('heading-4', className)}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('body-normal text-text-muted', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('pt-0', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}
import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center font-medium rounded-full',
        'transition-all duration-200 ease-out',

        // Size variants
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
          'px-4 py-2 text-base': size === 'lg',
        },

        // Color variants
        {
          // Default - Gray
          'bg-gray-100 text-gray-800 border border-gray-200':
            variant === 'default',

          // Primary - Sand tan
          'bg-sand-tan-light text-sand-tan-dark border border-sand-tan':
            variant === 'primary',

          // Secondary - Night blue
          'bg-night-blue-light text-white border border-night-blue':
            variant === 'secondary',

          // Success - Green
          'bg-green-100 text-green-800 border border-green-200':
            variant === 'success',

          // Warning - Yellow
          'bg-yellow-100 text-yellow-800 border border-yellow-200':
            variant === 'warning',

          // Error - Red
          'bg-red-100 text-red-800 border border-red-200':
            variant === 'error',

          // Info - Blue
          'bg-blue-100 text-blue-800 border border-blue-200':
            variant === 'info',
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

// Specialized badge components
const RatingBadge = React.forwardRef<HTMLDivElement, {
  rating: number
  maxRating?: number
  showStars?: boolean
  className?: string
}>(({
  rating,
  maxRating = 5,
  showStars = true,
  className,
}, ref) => {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md',
        className
      )}
    >
      {showStars && (
        <div className="flex items-center gap-0.5">
          {stars.map((star) => (
            <svg
              key={star}
              className={cn(
                'w-3 h-3',
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              )}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <span className="text-sm font-medium text-night-blue">
        {rating.toFixed(1)}
      </span>
    </div>
  )
})

RatingBadge.displayName = 'RatingBadge'

const PriceBadge = React.forwardRef<HTMLDivElement, {
  price: number
  currency?: string
  period?: string
  className?: string
}>(({
  price,
  currency = '₹',
  period = 'night',
  className,
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center px-3 py-1.5 bg-sand-tan text-white rounded-full shadow-md font-semibold',
        className
      )}
    >
      <span className="text-sm">
        {currency}{price.toLocaleString()}
        {period && <span className="text-xs opacity-90">/{period}</span>}
      </span>
    </div>
  )
})

PriceBadge.displayName = 'PriceBadge'

const StatusBadge = React.forwardRef<HTMLDivElement, {
  status: 'available' | 'booked' | 'pending' | 'cancelled'
  className?: string
}>(({
  status,
  className,
}, ref) => {
  const statusConfig = {
    available: { label: 'Available', variant: 'success' as const },
    booked: { label: 'Booked', variant: 'info' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    cancelled: { label: 'Cancelled', variant: 'error' as const },
  }

  const config = statusConfig[status]

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      size="sm"
      className={className}
    >
      {config.label}
    </Badge>
  )
})

StatusBadge.displayName = 'StatusBadge'

export {
  Badge,
  RatingBadge,
  PriceBadge,
  StatusBadge,
}
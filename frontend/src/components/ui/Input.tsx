'use client'

import React, { useId } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required,
  id,
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const hasError = !!error

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium mb-2',
            hasError ? 'text-error' : 'text-night-blue'
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={cn(
              'text-gray-400',
              hasError && 'text-error'
            )}>
              {leftIcon}
            </span>
          </div>
        )}

        <input
          ref={ref}
          type={type}
          id={inputId}
          className={cn(
            // Base styles
            'block w-full px-4 py-3 text-base rounded-lg border-2',
            'transition-all duration-200 ease-out',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',

            // Icon padding
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',

            // States
            hasError
              ? 'border-error text-error focus:border-error focus:ring-error'
              : 'border-gray-300 text-night-blue focus:border-sand-tan focus:ring-sand-tan hover:border-gray-400',

            // Disabled state
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',

            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className={cn(
              'text-gray-400',
              hasError && 'text-error'
            )}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-error">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-sm text-text-muted">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  error,
  helperText,
  required,
  id,
  ...props
}, ref) => {
  const generatedId = useId()
  const textareaId = id || generatedId
  const hasError = !!error

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            'block text-sm font-medium mb-2',
            hasError ? 'text-error' : 'text-night-blue'
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          // Base styles
          'block w-full px-4 py-3 text-base rounded-lg border-2',
          'transition-all duration-200 ease-out',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'resize-y min-h-[100px]',

          // States
          hasError
            ? 'border-error text-error focus:border-error focus:ring-error'
            : 'border-gray-300 text-night-blue focus:border-sand-tan focus:ring-sand-tan hover:border-gray-400',

          // Disabled state
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',

          className
        )}
        {...props}
      />

      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-error">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-sm text-text-muted">{helperText}</p>
          )}
        </div>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Input, Textarea }
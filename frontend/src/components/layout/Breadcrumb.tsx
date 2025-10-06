'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator = (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
}) => {
  return (
    <nav
      className={cn(
        'bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3',
        className
      )}
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mr-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {item.href && !item.isActive ? (
                <Link
                  href={item.href}
                  className={cn(
                    'font-medium transition-colors hover:text-sand-tan',
                    index === 0
                      ? 'text-night-blue hover:text-sand-tan'
                      : 'text-gray-500 hover:text-night-blue'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-medium',
                    item.isActive || index === items.length - 1
                      ? 'text-sand-tan'
                      : 'text-gray-500'
                  )}
                  aria-current={item.isActive || index === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
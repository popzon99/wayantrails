'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb'
import { cn } from '@/lib/utils/cn'

interface LayoutProps {
  children: React.ReactNode
  showBreadcrumb?: boolean
  breadcrumbItems?: BreadcrumbItem[]
  className?: string
  headerClassName?: string
  footerClassName?: string
  showFooter?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showBreadcrumb = false,
  breadcrumbItems = [],
  className,
  headerClassName,
  footerClassName,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header className={headerClassName} />

      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      <main className={cn('flex-1', className)}>
        {children}
      </main>

      {showFooter && (
        <Footer className={footerClassName} />
      )}
    </div>
  )
}

export default Layout
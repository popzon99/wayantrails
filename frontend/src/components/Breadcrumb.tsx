'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm overflow-x-auto py-2 px-4 sm:px-6 bg-gray-50 border-b" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors flex-shrink-0"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center flex-shrink-0">
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          {item.href && index !== items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

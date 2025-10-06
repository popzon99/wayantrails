'use client';

import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface FilterOption {
  label: string;
  value: string | number | boolean;
}

interface FilterGroup {
  title: string;
  key: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  activeFilters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  className?: string;
}

export function FilterSidebar({
  isOpen,
  onClose,
  filterGroups,
  activeFilters,
  onFilterChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(activeFilters);

  const handleApply = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    (key) => activeFilters[key] !== undefined && activeFilters[key] !== ''
  ).length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-80 bg-white shadow-lg z-50 transition-transform duration-300',
          'lg:transform-none lg:shadow-none lg:border-r lg:border-gray-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="primary">{activeFilterCount}</Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] p-4">
          {filterGroups.map((group) => (
            <div key={group.key} className="mb-6">
              <h4 className="font-semibold mb-3">{group.title}</h4>

              {group.type === 'checkbox' && group.options && (
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <label
                      key={option.value.toString()}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(localFilters[group.key])
                            ? localFilters[group.key].includes(option.value)
                            : localFilters[group.key] === option.value
                        }
                        onChange={(e) => {
                          const current = localFilters[group.key] || [];
                          const newValue = e.target.checked
                            ? [...(Array.isArray(current) ? current : []), option.value]
                            : (Array.isArray(current) ? current : []).filter(
                                (v: any) => v !== option.value
                              );
                          setLocalFilters({
                            ...localFilters,
                            [group.key]: newValue,
                          });
                        }}
                        className="rounded border-gray-300 text-sand-tan focus:ring-sand-tan"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {group.type === 'radio' && group.options && (
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <label
                      key={option.value.toString()}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={group.key}
                        checked={localFilters[group.key] === option.value}
                        onChange={() => {
                          setLocalFilters({
                            ...localFilters,
                            [group.key]: option.value,
                          });
                        }}
                        className="border-gray-300 text-sand-tan focus:ring-sand-tan"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {group.type === 'range' && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min={group.min}
                    max={group.max}
                    step={group.step}
                    value={localFilters[group.key] || group.min}
                    onChange={(e) => {
                      setLocalFilters({
                        ...localFilters,
                        [group.key]: Number(e.target.value),
                      });
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{group.min}</span>
                    <span className="font-semibold">
                      ₹{localFilters[group.key] || group.min}
                    </span>
                    <span>₹{group.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react'
import { Clock, Plus, Filter, ArrowUpDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { CATEGORY_LIST } from '../constants/categories'
import { QuickAddModal } from '../components/layout/QuickAddModal'

export const TimelinePage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3f4f6] font-display">
            Chronological Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#9da3b4] mt-0.5">
            Unified chronological record of every moment, experience, and creation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
          >
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Entry
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-[#9da3b4] pr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'bg-[#171a24] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
          }`}
        >
          All Entries
        </button>
        {CATEGORY_LIST.slice(0, 8).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'bg-[#171a24] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream (Empty State for Phase 1 per PRD Section 23) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Timeline Stream</CardTitle>
            <Badge variant="outline" size="sm">
              0 Events
            </Badge>
          </div>
          <span className="text-xs text-[#9da3b4]">
            Filtering by: <strong className="text-[#f3f4f6]">{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</strong>
          </span>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Clock className="w-8 h-8" />}
            title="No timeline events found"
            description="Your timeline brings together your movies, books, travels, projects, and personal memories in order of occurrence."
            actionLabel="Add Timeline Entry"
            onAction={() => setIsAddModalOpen(true)}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        </CardContent>
      </Card>

      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

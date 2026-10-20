import React, { useState, useMemo } from 'react'
import { Clock, Plus, Filter, ArrowUpDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { EntryCard } from '../components/entries/EntryCard'
import { CATEGORY_LIST } from '../constants/categories'
import { useEntries } from '../context/useEntries'
import type { CategoryId } from '../types'

export const TimelinePage: React.FC = () => {
  const {
    entries,
    openCreateModal,
    openDetailModal,
    openEditModal,
    openDeleteDialog,
    toggleFavorite,
    togglePin,
  } = useEntries()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Filter & sort active (non-archived) entries
  const filteredEntries = useMemo(() => {
    let result = entries.filter((e) => !e.isArchived)

    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.categoryId === selectedCategory)
    }

    result.sort((a, b) => {
      const timeA = new Date(a.eventDate).getTime()
      const timeB = new Date(b.eventDate).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [entries, selectedCategory, sortOrder])

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
            onClick={() =>
              openCreateModal(
                selectedCategory !== 'all' ? (selectedCategory as CategoryId) : undefined
              )
            }
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
          All Entries ({entries.filter((e) => !e.isArchived).length})
        </button>
        {CATEGORY_LIST.map((cat) => {
          const count = entries.filter((e) => !e.isArchived && e.categoryId === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'bg-[#171a24] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && <span className="ml-1.5 text-[10px] opacity-75">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Timeline Stream */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Timeline Stream</CardTitle>
            <Badge variant="outline" size="sm">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'Frame' : 'Frames'}
            </Badge>
          </div>
          <span className="text-xs text-[#9da3b4]">
            Sorting: <strong className="text-[#f3f4f6]">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</strong>
          </span>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => openDetailModal(entry)}
                  onToggleFavorite={toggleFavorite}
                  onTogglePin={togglePin}
                  onEdit={openEditModal}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="w-8 h-8" />}
              title="No timeline events found"
              description={
                selectedCategory === 'all'
                  ? 'Your timeline brings together your movies, books, travels, projects, and personal memories in order of occurrence.'
                  : `No entries recorded under ${selectedCategory}. Record your first frame in this category!`
              }
              actionLabel="Add Timeline Entry"
              onAction={() =>
                openCreateModal(
                  selectedCategory !== 'all' ? (selectedCategory as CategoryId) : undefined
                )
              }
              actionIcon={<Plus className="w-4 h-4" />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

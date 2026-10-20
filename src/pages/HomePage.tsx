import React from 'react'
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Film,
  BookOpen,
  Music,
  Camera,
  Layers,
  Star,
  Pin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { EntryCard } from '../components/entries/EntryCard'
import { CATEGORIES } from '../constants/categories'
import { useEntries } from '../context/useEntries'
import { Link } from 'react-router-dom'
import type { CategoryId } from '../types'

export const HomePage: React.FC = () => {
  const {
    stats,
    openCreateModal,
    openDetailModal,
    openEditModal,
    openDeleteDialog,
    toggleFavorite,
    togglePin,
  } = useEntries()

  // Current formatted date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Quick Action category options
  const quickCategories: Array<{ id: CategoryId; label: string; icon: React.ReactNode; color: string }> = [
    { id: 'movies', label: 'Movie / Show', icon: <Film className="w-4 h-4" />, color: '#f43f5e' },
    { id: 'books', label: 'Book', icon: <BookOpen className="w-4 h-4" />, color: '#f59e0b' },
    { id: 'music', label: 'Music', icon: <Music className="w-4 h-4" />, color: '#a855f7' },
    { id: 'memories', label: 'Memory', icon: <Camera className="w-4 h-4" />, color: '#06b6d4' },
    { id: 'projects', label: 'Project', icon: <Layers className="w-4 h-4" />, color: '#3b82f6' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Greeting & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-purple-400 mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3f4f6] font-display">
            Life in Frames
          </h1>
          <p className="text-xs sm:text-sm text-[#9da3b4] mt-1">
            Your private personal chronicle. Capture moments, preserve memories, track culture.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="accent"
            size="md"
            onClick={() => openCreateModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Entry
          </Button>
          <Link to="/timeline">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Timeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Add Actions Bar (PRD Section 6.1) */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-[#646c7f] uppercase">
          Quick Capture
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickCategories.map((qc) => (
            <button
              key={qc.id}
              onClick={() => openCreateModal(qc.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141721] hover:bg-[#1a1e2b] border border-white/[0.08] hover:border-purple-500/40 text-xs font-medium text-[#f3f4f6] shrink-0 transition-colors cursor-pointer group"
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${qc.color}20`, color: qc.color }}
              >
                {qc.icon}
              </span>
              <span>+ {qc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real Archive Statistics Row (PRD Section 6.2 - derived strictly from data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#11131a] border border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] font-display">
              {stats.totalEntries}
            </div>
            <div className="text-[11px] text-[#9da3b4]">Total Frames</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131a] border border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] font-display">
              {stats.favoriteCount}
            </div>
            <div className="text-[11px] text-[#9da3b4]">Favorites</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131a] border border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] font-display">
              {stats.pinnedCount}
            </div>
            <div className="text-[11px] text-[#9da3b4]">Pinned</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#11131a] border border-white/[0.08] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#f3f4f6] font-display">
              {Object.values(stats.categoryCounts).filter((c) => c > 0).length}
            </div>
            <div className="text-[11px] text-[#9da3b4]">Active Categories</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Added / Pinned vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pinned Entries (if any exist) */}
          {stats.pinnedEntries.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-purple-400" />
                  <CardTitle>Pinned Highlights</CardTitle>
                </div>
                <Badge variant="purple" size="sm">
                  {stats.pinnedEntries.length} Pinned
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {stats.pinnedEntries.map((entry) => (
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
              </CardContent>
            </Card>
          )}

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your latest recorded memories, films, books, and moments</CardDescription>
              </div>
              <Badge variant="outline" size="sm">
                {stats.totalEntries} Records
              </Badge>
            </CardHeader>
            <CardContent>
              {stats.recentlyAdded.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {stats.recentlyAdded.map((entry) => (
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
                  icon={<Clock className="w-6 h-6" />}
                  title="Your archive has just begun"
                  description="No records have been added yet. Use the Create Entry button to start cataloging your personal memories and experiences."
                  actionLabel="Create First Entry"
                  onAction={() => openCreateModal()}
                  actionIcon={<Plus className="w-4 h-4" />}
                />
              )}
            </CardContent>
          </Card>

          {/* Recently Watched & Read (when data exists) */}
          {stats.recentlyWatched.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-rose-400" />
                  <CardTitle>Recently Watched</CardTitle>
                </div>
                <button
                  onClick={() => openCreateModal('movies')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  + Add Film/Show
                </button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {stats.recentlyWatched.map((entry) => (
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
              </CardContent>
            </Card>
          )}

          {stats.recentlyRead.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <CardTitle>Recently Read Books</CardTitle>
                </div>
                <button
                  onClick={() => openCreateModal('books')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  + Add Book
                </button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {stats.recentlyRead.map((entry) => (
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Column: On This Day & Categories Breakdown */}
        <div className="space-y-6">
          {/* On This Day (PRD Section 6.1 & 12.1) */}
          <Card>
            <CardHeader>
              <CardTitle>On This Day</CardTitle>
              <Badge variant="purple" size="sm">
                Rewind
              </Badge>
            </CardHeader>
            <CardContent>
              {stats.onThisDayEntries.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#9da3b4]">
                    Memories from this calendar date in previous years:
                  </p>
                  {stats.onThisDayEntries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onClick={() => openDetailModal(entry)}
                      onToggleFavorite={toggleFavorite}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#f3f4f6]">
                    No past memories for today
                  </h4>
                  <p className="text-xs text-[#9da3b4] mt-1 max-w-xs mx-auto">
                    As you record life events, memories from this calendar date in previous years will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category-Level Activity Summary (PRD Section 6.1) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Archive Domains</CardTitle>
                <CardDescription>Live counts per category</CardDescription>
              </div>
              <Link to="/explore" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View all (12)
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  CATEGORIES.movies,
                  CATEGORIES.books,
                  CATEGORIES.music,
                  CATEGORIES.memories,
                  CATEGORIES.projects,
                  CATEGORIES.learning,
                ].map((cat) => {
                  const count = stats.categoryCounts[cat.id] || 0
                  return (
                    <button
                      key={cat.id}
                      onClick={() => openCreateModal(cat.id)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#171a24]/70 hover:bg-[#1d212e] border border-white/[0.06] hover:border-purple-500/30 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.accentColor }}
                        />
                        <span className="text-xs font-semibold text-[#f3f4f6] truncate font-display">
                          {cat.label}
                        </span>
                      </div>
                      <Badge variant={count > 0 ? 'purple' : 'default'} size="sm">
                        {count}
                      </Badge>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#646c7f]">Phase 2 Core Interface</span>
                <Link
                  to="/timeline"
                  className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <span>Go to Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

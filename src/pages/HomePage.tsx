import React, { useState } from 'react'
import {
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Film,
  BookOpen,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { CATEGORIES } from '../constants/categories'
import { QuickAddModal } from '../components/layout/QuickAddModal'
import { Link } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Current formatted date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

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
            Welcome to Life in Frames
          </h1>
          <p className="text-xs sm:text-sm text-[#9da3b4] mt-1">
            Your private, chronological personal archive. Offline-ready and built to last.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="accent"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
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

      {/* Phase 1 System Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#171a24] to-[#12141c] border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#f3f4f6] font-display">
                Phase 1: Project Foundation Ready
              </span>
              <Badge variant="purple" size="sm">
                Vite + TS + Tailwind
              </Badge>
            </div>
            <p className="text-xs text-[#9da3b4] mt-0.5">
              Design tokens, responsive shell, routing, error handling, and component architecture established.
            </p>
          </div>
        </div>
        <Link to="/explore" className="shrink-0">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Explore Categories
          </Button>
        </Link>
      </div>

      {/* Empty State Showcase (No hardcoded fake data per PRD Section 23) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest recorded memories, films, books, and milestones</CardDescription>
              </div>
              <Badge variant="outline" size="sm">
                0 Records
              </Badge>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Clock className="w-6 h-6" />}
                title="Your archive has just begun"
                description="No records have been added yet. Use the Create Entry button to start cataloging your personal memories and experiences."
                actionLabel="Create First Entry"
                onAction={() => setIsAddModalOpen(true)}
                actionIcon={<Plus className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          {/* Quick Categories Overview */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Archive Domains</CardTitle>
                <CardDescription>Organized categories ready for your personal chronicle</CardDescription>
              </div>
              <Link to="/explore" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                View all (12)
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[CATEGORIES.movies, CATEGORIES.books, CATEGORIES.music, CATEGORIES.memories, CATEGORIES.projects, CATEGORIES.learning].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#171a24]/70 hover:bg-[#1d212e] border border-white/[0.06] hover:border-purple-500/30 transition-all text-left cursor-pointer group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: cat.glowColor, color: cat.accentColor }}
                    >
                      {cat.id === 'movies' && <Film className="w-4 h-4" />}
                      {cat.id === 'books' && <BookOpen className="w-4 h-4" />}
                      {cat.id === 'memories' && <Camera className="w-4 h-4" />}
                      {cat.id !== 'movies' && cat.id !== 'books' && cat.id !== 'memories' && <Layers className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#f3f4f6] truncate font-display">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-[#9da3b4] truncate">
                        0 items
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column: On This Day & Archive Insights */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>On This Day</CardTitle>
              <Badge variant="purple" size="sm">
                Rewind
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-[#f3f4f6]">No past memories for today</h4>
                <p className="text-xs text-[#9da3b4] mt-1 max-w-xs mx-auto">
                  As you record life events, memories from this calendar date in previous years will appear here.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archive Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-[#9da3b4]">Storage Engine</span>
                  <span className="font-medium text-[#f3f4f6]">IndexedDB (Offline)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-[#9da3b4]">Sync Architecture</span>
                  <span className="font-medium text-emerald-400">Deterministic Local</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-[#9da3b4]">Privacy Status</span>
                  <span className="font-medium text-[#f3f4f6]">Private • Zero AI / Telemetry</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9da3b4]">Current Phase</span>
                  <span className="font-medium text-purple-300">Phase 1 Foundation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

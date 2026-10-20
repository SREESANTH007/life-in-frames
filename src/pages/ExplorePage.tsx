import React, { useState } from 'react'
import {
  Compass,
  Film,
  BookOpen,
  Music,
  Camera,
  FolderGit2,
  GraduationCap,
  Target,
  Wallet,
  Lightbulb,
  Users,
  Sparkles,
  Search,
  Plus,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CATEGORY_LIST } from '../constants/categories'
import { useEntries } from '../context/useEntries'
import type { CategoryId } from '../types'

const iconMap: Record<string, React.ReactNode> = {
  Film: <Film className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  FolderGit2: <FolderGit2 className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
}

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { stats, openCreateModal } = useEntries()

  const filteredCategories = CATEGORY_LIST.filter(
    (cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCategorySelect = (id: CategoryId) => {
    openCreateModal(id)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3f4f6] font-display">
            Explore Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#9da3b4] mt-0.5">
            Discover and catalog every aspect of your life across unified categories.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => openCreateModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Entry
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#646c7f] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter categories (e.g. Films, Books, Travels, Projects)..."
          className="w-full pl-10 pr-4 py-2 bg-[#11131a] border border-white/[0.08] focus:border-purple-500/50 rounded-xl text-xs sm:text-sm text-[#f3f4f6] placeholder-[#646c7f] outline-none transition-colors"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const entryCount = stats.categoryCounts[category.id] || 0
          return (
            <Card
              key={category.id}
              variant="interactive"
              onClick={() => handleCategorySelect(category.id)}
              className="group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: category.glowColor,
                      color: category.accentColor,
                    }}
                  >
                    {iconMap[category.iconName] || <Sparkles className="w-5 h-5" />}
                  </div>
                  <Badge variant={entryCount > 0 ? 'purple' : 'outline'} size="sm">
                    {entryCount} {entryCount === 1 ? 'Entry' : 'Entries'}
                  </Badge>
                </div>

                <h2 className="text-base font-semibold text-[#f3f4f6] font-display">
                  {category.label}
                </h2>
                <p className="text-xs text-[#9da3b4] mt-1 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[#646c7f]">PRD Section 8</span>
                <span className="text-purple-400 group-hover:text-purple-300 font-medium">
                  Record +
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

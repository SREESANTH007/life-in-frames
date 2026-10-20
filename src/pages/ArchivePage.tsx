import React, { useState } from 'react'
import { Archive, FolderHeart, Star, Bookmark, Plus, Layers } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { QuickAddModal } from '../components/layout/QuickAddModal'

type TabType = 'collections' | 'favorites' | 'archived'

export const ArchivePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('collections')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3f4f6] font-display">
            Collections & Archive
          </h1>
          <p className="text-xs sm:text-sm text-[#9da3b4] mt-0.5">
            Curate custom collections, starred favorites, and historical life chapters.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Collection
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 -mb-1 transition-colors cursor-pointer ${
            activeTab === 'collections'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-[#9da3b4] hover:text-[#f3f4f6]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Collections</span>
          <Badge variant="outline" size="sm">0</Badge>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 -mb-1 transition-colors cursor-pointer ${
            activeTab === 'favorites'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-[#9da3b4] hover:text-[#f3f4f6]'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Favorites</span>
          <Badge variant="outline" size="sm">0</Badge>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 -mb-1 transition-colors cursor-pointer ${
            activeTab === 'archived'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-[#9da3b4] hover:text-[#f3f4f6]'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Archived Records</span>
          <Badge variant="outline" size="sm">0</Badge>
        </button>
      </div>

      {/* Content Area with genuine Empty States */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'collections' && (
            <EmptyState
              icon={<FolderHeart className="w-8 h-8" />}
              title="No collections created yet"
              description="Collections let you curate cross-category groupings like 'Favorite 2026 Films', 'Books That Changed Me', or 'Chennai Travels'."
              actionLabel="Create Collection"
              onAction={() => setIsAddModalOpen(true)}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          )}

          {activeTab === 'favorites' && (
            <EmptyState
              icon={<Star className="w-8 h-8" />}
              title="No favorites starred"
              description="Pin or star your most cherished entries across movies, books, memories, and projects to access them quickly here."
              actionLabel="Explore Archive"
              onAction={() => setIsAddModalOpen(true)}
              actionIcon={<Bookmark className="w-4 h-4" />}
            />
          )}

          {activeTab === 'archived' && (
            <EmptyState
              icon={<Archive className="w-8 h-8" />}
              title="Archive is clear"
              description="Records you choose to archive rather than delete will appear here, preserved forever."
            />
          )}
        </CardContent>
      </Card>

      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

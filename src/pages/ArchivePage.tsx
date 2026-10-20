import React, { useState } from 'react'
import { Archive, FolderHeart, Star, Bookmark, Plus, Layers } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { EntryCard } from '../components/entries/EntryCard'
import { useEntries } from '../context/useEntries'

type TabType = 'collections' | 'favorites' | 'archived'

export const ArchivePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('collections')
  const {
    entries,
    openCreateModal,
    openDetailModal,
    openEditModal,
    openDeleteDialog,
    toggleFavorite,
    togglePin,
  } = useEntries()

  const favoriteEntries = entries.filter((e) => e.isFavorite && !e.isArchived)
  const archivedEntries = entries.filter((e) => e.isArchived)

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
          onClick={() => openCreateModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Frame
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
          <Badge variant={favoriteEntries.length > 0 ? 'purple' : 'outline'} size="sm">
            {favoriteEntries.length}
          </Badge>
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
          <Badge variant={archivedEntries.length > 0 ? 'purple' : 'outline'} size="sm">
            {archivedEntries.length}
          </Badge>
        </button>
      </div>

      {/* Content Area with real entries or genuine Empty States */}
      <div>
        {activeTab === 'collections' && (
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={<FolderHeart className="w-8 h-8" />}
                title="No collections created yet"
                description="Collections let you curate cross-category groupings like 'Favorite 2026 Films', 'Books That Changed Me', or 'Chennai Travels'."
                actionLabel="Record Frame"
                onAction={() => openCreateModal()}
                actionIcon={<Plus className="w-4 h-4" />}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favoriteEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteEntries.map((entry) => (
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
              <Card>
                <CardContent className="pt-6">
                  <EmptyState
                    icon={<Star className="w-8 h-8" />}
                    title="No favorites starred"
                    description="Pin or star your most cherished entries across movies, books, memories, and projects to access them quickly here."
                    actionLabel="Create Entry"
                    onAction={() => openCreateModal()}
                    actionIcon={<Bookmark className="w-4 h-4" />}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'archived' && (
          <div>
            {archivedEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedEntries.map((entry) => (
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
              <Card>
                <CardContent className="pt-6">
                  <EmptyState
                    icon={<Archive className="w-8 h-8" />}
                    title="Archive is clear"
                    description="Records you choose to archive rather than delete will appear here, preserved forever."
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

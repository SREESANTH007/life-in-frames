import React, { useState, useMemo } from 'react'
import {
  Search,
  X,
  Star,
  Pin,
  Calendar,
  Filter,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { CATEGORY_LIST, CATEGORIES } from '../../constants/categories'
import { useEntries } from '../../context/useEntries'
import type { BaseEntry, CategoryId } from '../../types'

export interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface GlobalSearchModalContentProps {
  onClose: () => void
}

const GlobalSearchModalContent: React.FC<GlobalSearchModalContentProps> = ({ onClose }) => {
  const { entries, openDetailModal } = useEntries()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [onlyPinned, setOnlyPinned] = useState(false)
  const [minRating] = useState<number | null>(null)

  // Real-time offline search across all local records (PRD Section 11.1)
  const searchResults: BaseEntry[] = useMemo(() => {
    let result = entries.filter((e) => !e.isArchived)

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.categoryId === selectedCategory)
    }

    // Favorites filter
    if (onlyFavorites) {
      result = result.filter((e) => e.isFavorite)
    }

    // Pinned filter
    if (onlyPinned) {
      result = result.filter((e) => e.isPinned)
    }

    // Min rating filter
    if (minRating !== null) {
      result = result.filter((e) => (e.rating || 0) >= minRating)
    }

    // Text search filter
    const q = query.toLowerCase().trim()
    if (q) {
      result = result.filter((entry) => {
        if (entry.title.toLowerCase().includes(q)) return true
        if (entry.notes?.toLowerCase().includes(q)) return true
        if (entry.tags.some((t) => t.toLowerCase().includes(q))) return true
        if (entry.categoryId.toLowerCase().includes(q)) return true
        if (entry.metadata) {
          const metaStr = JSON.stringify(entry.metadata).toLowerCase()
          if (metaStr.includes(q)) return true
        }
        return false
      })
    }

    return result
  }, [entries, query, selectedCategory, onlyFavorites, onlyPinned, minRating])

  const handleResultClick = (entry: BaseEntry) => {
    onClose()
    openDetailModal(entry)
  }

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search archive, notes, tags, directors, authors..."
          autoFocus
          className="w-full pl-11 pr-10 py-3 bg-[#171a24] text-[#f3f4f6] text-sm rounded-xl border border-white/[0.12] focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 outline-none placeholder-[#646c7f]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 text-[#9da3b4] hover:text-[#f3f4f6] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-1 text-[11px] text-[#646c7f] mr-1">
          <Filter className="w-3 h-3" />
          <span>Filter:</span>
        </div>

        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'bg-[#141721] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
          }`}
        >
          All
        </button>

        {CATEGORY_LIST.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)
            }
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'bg-[#141721] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            onlyFavorites
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#141721] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
          }`}
        >
          <Star className={`w-3 h-3 ${onlyFavorites ? 'fill-amber-400' : ''}`} />
          <span>Favorites</span>
        </button>

        <button
          onClick={() => setOnlyPinned(!onlyPinned)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            onlyPinned
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'bg-[#141721] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06]'
          }`}
        >
          <Pin className={`w-3 h-3 ${onlyPinned ? 'fill-purple-400' : ''}`} />
          <span>Pinned</span>
        </button>
      </div>

      {/* Results List */}
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {searchResults.length > 0 ? (
          searchResults.map((entry) => {
            const cat = CATEGORIES[entry.categoryId] || CATEGORIES.custom
            const formattedDate = new Date(entry.eventDate + 'T00:00:00').toLocaleDateString(
              'en-US',
              { month: 'short', day: 'numeric', year: 'numeric' }
            )
            return (
              <div
                key={entry.id}
                onClick={() => handleResultClick(entry)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#141721] hover:bg-[#1c202e] border border-white/[0.06] hover:border-purple-500/30 transition-all cursor-pointer group"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.accentColor }}
                    />
                    <span className="text-[11px] font-medium text-[#9da3b4]">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-[#646c7f]">•</span>
                    <span className="text-[11px] text-[#646c7f] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    {entry.rating && (
                      <span className="text-[11px] text-amber-400 font-medium flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {entry.rating}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#f3f4f6] group-hover:text-purple-200 transition-colors truncate">
                    {entry.title}
                  </h4>
                  {entry.notes && (
                    <p className="text-xs text-[#9da3b4] line-clamp-1 mt-0.5">
                      {entry.notes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {entry.isFavorite && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  )}
                  {entry.isPinned && (
                    <Pin className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#f3f4f6]">No matching records found</p>
            <p className="text-xs text-[#9da3b4] mt-1 max-w-xs mx-auto">
              {query
                ? `No entries match "${query}". Try searching by tag, person name, or category.`
                : 'Start typing to search your personal archive offline.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#646c7f]">
        <span>{searchResults.length} matching {searchResults.length === 1 ? 'frame' : 'frames'} in local storage</span>
        <Badge variant="outline" size="sm">IndexedDB Ready</Badge>
      </div>
    </div>
  )
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      {isOpen && <GlobalSearchModalContent onClose={onClose} />}
    </Modal>
  )
}

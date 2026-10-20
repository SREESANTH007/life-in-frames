import React from 'react'
import {
  Star,
  Pin,
  Calendar,
  Clock,
  Film,
  BookOpen,
  Music,
  Camera,
  FolderGit2,
  GraduationCap,
  Compass,
  Target,
  Wallet,
  Lightbulb,
  Users,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react'
import { CATEGORIES } from '../../constants/categories'
import type { BaseEntry } from '../../types'

const iconMap: Record<string, React.ReactNode> = {
  Film: <Film className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Music: <Music className="w-3.5 h-3.5" />,
  Camera: <Camera className="w-3.5 h-3.5" />,
  FolderGit2: <FolderGit2 className="w-3.5 h-3.5" />,
  GraduationCap: <GraduationCap className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Target: <Target className="w-3.5 h-3.5" />,
  Wallet: <Wallet className="w-3.5 h-3.5" />,
  Lightbulb: <Lightbulb className="w-3.5 h-3.5" />,
  Users: <Users className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
}

export interface EntryCardProps {
  entry: BaseEntry
  onClick: () => void
  onToggleFavorite?: (id: string) => void
  onTogglePin?: (id: string) => void
  onEdit?: (entry: BaseEntry) => void
  onDelete?: (entry: BaseEntry) => void
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onClick,
  onToggleFavorite,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const category = CATEGORIES[entry.categoryId] || CATEGORIES.custom

  // Format event date
  const formattedDate = new Date(entry.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Derive metadata subtitle highlight
  const getMetadataSnippet = (): string | null => {
    if (!entry.metadata) return null
    const meta = entry.metadata as Record<string, unknown>
    if (entry.categoryId === 'movies' && meta.creatorOrDirector) {
      return `Dir. ${meta.creatorOrDirector}`
    }
    if (entry.categoryId === 'books' && meta.author) {
      return `by ${meta.author}`
    }
    if (entry.categoryId === 'music' && (meta.artist || meta.album)) {
      return [meta.artist, meta.album].filter(Boolean).join(' • ')
    }
    if (entry.categoryId === 'memories' && meta.locationName) {
      return `📍 ${meta.locationName}`
    }
    if (entry.categoryId === 'places' && meta.locationOrCity) {
      return `📍 ${meta.locationOrCity}`
    }
    if (entry.categoryId === 'projects' && meta.status) {
      return `Status: ${meta.status}`
    }
    return null
  }

  const metaSnippet = getMetadataSnippet()

  return (
    <article
      onClick={onClick}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#11131a] hover:bg-[#151822] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-black/50"
    >
      <div>
        {/* Top bar: Category badge, date, pin & favorite icons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border"
            style={{
              backgroundColor: category.glowColor,
              borderColor: `${category.accentColor}40`,
              color: category.accentColor,
            }}
          >
            {iconMap[category.iconName] || <Sparkles className="w-3.5 h-3.5" />}
            <span>{category.label}</span>
          </div>

          <div className="flex items-center gap-1">
            {onTogglePin ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePin(entry.id)
                }}
                aria-label={entry.isPinned ? 'Unpin frame' : 'Pin frame'}
                className="p-1 rounded-md text-[#646c7f] hover:text-purple-300 transition-colors cursor-pointer"
                title={entry.isPinned ? 'Pinned' : 'Pin to dashboard'}
              >
                <Pin
                  className={`w-3.5 h-3.5 ${
                    entry.isPinned ? 'fill-purple-400 text-purple-400' : 'text-[#646c7f]'
                  }`}
                />
              </button>
            ) : entry.isPinned ? (
              <span className="p-1 text-purple-400" title="Pinned">
                <Pin className="w-3.5 h-3.5 fill-purple-400" />
              </span>
            ) : null}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite?.(entry.id)
              }}
              aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1 rounded-md text-[#646c7f] hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Star
                className={`w-4 h-4 ${
                  entry.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-[#646c7f]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Cover image preview if provided */}
        {entry.coverImageUrl && (
          <div className="mb-3 rounded-xl overflow-hidden aspect-video bg-[#171a24] border border-white/[0.06]">
            <img
              src={entry.coverImageUrl}
              alt={entry.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Title & Metadata subtitle */}
        <h3 className="text-base font-semibold text-[#f3f4f6] font-display group-hover:text-purple-200 transition-colors leading-snug line-clamp-2">
          {entry.title}
        </h3>

        {metaSnippet && (
          <p className="text-xs text-purple-300/80 font-medium mt-0.5">
            {metaSnippet}
          </p>
        )}

        {/* Notes preview */}
        {entry.notes && (
          <p className="text-xs text-[#9da3b4] mt-2 line-clamp-2 leading-relaxed">
            {entry.notes}
          </p>
        )}
      </div>

      {/* Footer: Date, Rating, Tags & Actions */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-[#9da3b4]">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-[#646c7f]" />
            {formattedDate}
          </span>
          {entry.eventTime && (
            <span className="flex items-center gap-1 text-[11px] text-[#646c7f]">
              <Clock className="w-3 h-3" />
              {entry.eventTime}
            </span>
          )}
          {entry.rating && (
            <span className="flex items-center gap-0.5 text-amber-400 font-medium text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" />
              {entry.rating}/5
            </span>
          )}
        </div>

        {/* Card actions */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(entry)
              }}
              title="Edit Frame"
              className="p-1 rounded-md text-[#9da3b4] hover:text-[#f3f4f6] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(entry)
              }}
              title="Delete Frame"
              className="p-1 rounded-md text-[#9da3b4] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

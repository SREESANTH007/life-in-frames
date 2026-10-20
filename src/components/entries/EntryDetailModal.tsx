import React from 'react'
import {
  Star,
  Pin,
  Calendar,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
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
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CATEGORIES } from '../../constants/categories'
import type { BaseEntry } from '../../types'

const iconMap: Record<string, React.ReactNode> = {
  Film: <Film className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  FolderGit2: <FolderGit2 className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  Lightbulb: <Lightbulb className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
}

export interface EntryDetailModalProps {
  entry: BaseEntry | null
  isOpen: boolean
  onClose: () => void
  onEdit: (entry: BaseEntry) => void
  onDelete: (entry: BaseEntry) => void
  onToggleFavorite: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleArchive: (id: string) => void
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePin,
  onToggleArchive,
}) => {
  if (!entry) return null

  const category = CATEGORIES[entry.categoryId] || CATEGORIES.custom

  const formattedEventDate = new Date(entry.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedCreatedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const meta = (entry.metadata || {}) as Record<string, unknown>

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-5">
        {/* Cover image if available */}
        {entry.coverImageUrl && (
          <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 rounded-t-2xl overflow-hidden max-h-56 bg-[#171a24] relative">
            <img
              src={entry.coverImageUrl}
              alt={entry.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-transparent to-black/30" />
          </div>
        )}

        {/* Top bar: Category badge, Favorite, Pin, and Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: category.glowColor,
              borderColor: `${category.accentColor}40`,
              color: category.accentColor,
            }}
          >
            {iconMap[category.iconName] || <Sparkles className="w-4 h-4" />}
            <span>{category.label}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(entry.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                entry.isFavorite
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-[#171a24] border-white/10 text-[#9da3b4] hover:text-amber-400'
              }`}
              title={entry.isFavorite ? 'Starred Favorite' : 'Star as Favorite'}
            >
              <Star
                className={`w-4 h-4 ${entry.isFavorite ? 'fill-amber-400' : ''}`}
              />
            </button>

            <button
              onClick={() => onTogglePin(entry.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                entry.isPinned
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                  : 'bg-[#171a24] border-white/10 text-[#9da3b4] hover:text-purple-300'
              }`}
              title={entry.isPinned ? 'Pinned to Dashboard' : 'Pin to Dashboard'}
            >
              <Pin
                className={`w-4 h-4 ${entry.isPinned ? 'fill-purple-400' : ''}`}
              />
            </button>

            <button
              onClick={() => onToggleArchive(entry.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                entry.isArchived
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-[#171a24] border-white/10 text-[#9da3b4] hover:text-indigo-300'
              }`}
              title={entry.isArchived ? 'Restore from Archive' : 'Move to Archive'}
            >
              {entry.isArchived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title & Rating */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f3f4f6] font-display leading-tight">
            {entry.title}
          </h2>

          {entry.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= (entry.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-[#646c7f]'
                  }`}
                />
              ))}
              <span className="text-xs text-[#9da3b4] ml-1.5 font-medium">
                {entry.rating} / 5
              </span>
            </div>
          )}
        </div>

        {/* Event Date vs Created Timestamp (PRD Section 7.1) */}
        <div className="p-3.5 rounded-xl bg-[#171a24]/80 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#f3f4f6]">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="font-medium">{formattedEventDate}</span>
              {entry.eventTime && (
                <span className="text-[#9da3b4] ml-2">at {entry.eventTime}</span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-[#646c7f] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Recorded on {formattedCreatedDate}</span>
          </div>
        </div>

        {/* Personal Notes */}
        {entry.notes && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-[#9da3b4] uppercase tracking-wider">
              Personal Notes & Reflections
            </h4>
            <div className="p-4 rounded-xl bg-[#141721] border border-white/[0.06] text-xs sm:text-sm text-[#f3f4f6] leading-relaxed whitespace-pre-wrap">
              {entry.notes}
            </div>
          </div>
        )}

        {/* Category Details Grid */}
        {Object.keys(meta).length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-[#9da3b4] uppercase tracking-wider">
              {category.label} Details
            </h4>
            <div className="p-3.5 rounded-xl bg-[#171a24]/50 border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(meta).map(([key, val]) => {
                if (!val) return null
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                return (
                  <div key={key} className="space-y-0.5">
                    <span className="text-[11px] text-[#646c7f]">{label}</span>
                    <p className="font-medium text-[#f3f4f6]">{String(val)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-[#9da3b4] uppercase tracking-wider">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Link */}
        {entry.externalUrl && (
          <div>
            <a
              href={entry.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171a24] hover:bg-[#202433] text-purple-300 text-xs font-medium border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open External Reference</span>
            </a>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose()
              onDelete(entry)
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose()
                onEdit(entry)
              }}
              leftIcon={<Edit2 className="w-4 h-4" />}
            >
              Edit Frame
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

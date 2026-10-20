import React, { useState } from 'react'
import {
  Star,
  Pin,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { TextInput } from '../ui/TextInput'
import { Textarea } from '../ui/Textarea'
import { RatingPicker } from '../ui/RatingPicker'
import { TagInput } from '../ui/TagInput'
import { CATEGORY_LIST, CATEGORIES } from '../../constants/categories'
import type {
  BaseEntry,
  CategoryId,
  CreateEntryInput,
  UpdateEntryInput,
} from '../../types'

export interface EntryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateEntryInput | UpdateEntryInput) => Promise<void>
  initialEntry?: BaseEntry | null
  defaultCategoryId?: CategoryId | null
}

interface EntryFormContentProps {
  initialEntry?: BaseEntry | null
  defaultCategoryId?: CategoryId | null
  onSubmit: (input: CreateEntryInput | UpdateEntryInput) => Promise<void>
  onClose: () => void
}

const EntryFormContent: React.FC<EntryFormContentProps> = ({
  initialEntry,
  defaultCategoryId,
  onSubmit,
  onClose,
}) => {
  const isEditing = Boolean(initialEntry)
  const meta = (initialEntry?.metadata || {}) as Record<string, unknown>

  // Direct state initialization from props (No useEffect needed per React Best Practices)
  const [categoryId, setCategoryId] = useState<CategoryId>(
    initialEntry?.categoryId || defaultCategoryId || 'movies'
  )
  const [title, setTitle] = useState(initialEntry?.title || '')
  const [eventDate, setEventDate] = useState(
    initialEntry?.eventDate || new Date().toISOString().split('T')[0]
  )
  const [eventTime, setEventTime] = useState(initialEntry?.eventTime || '')
  const [notes, setNotes] = useState(initialEntry?.notes || '')
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || [])
  const [rating, setRating] = useState<number | undefined>(initialEntry?.rating)
  const [coverImageUrl, setCoverImageUrl] = useState(initialEntry?.coverImageUrl || '')
  const [externalUrl, setExternalUrl] = useState(initialEntry?.externalUrl || '')
  const [isFavorite, setIsFavorite] = useState(initialEntry?.isFavorite || false)
  const [isPinned, setIsPinned] = useState(initialEntry?.isPinned || false)

  // Category-specific metadata state
  const [showMetadata, setShowMetadata] = useState(
    Boolean(initialEntry && Object.keys(meta).length > 0)
  )
  const [metaCreator, setMetaCreator] = useState(
    (meta.creatorOrDirector || meta.author || meta.artist || meta.personName || '') as string
  )
  const [metaLocation, setMetaLocation] = useState(
    (meta.locationName || meta.locationOrCity || '') as string
  )
  const [metaStatus, setMetaStatus] = useState(
    (meta.status || meta.readingStatus || meta.completionStatus || '') as string
  )
  const [metaQuote, setMetaQuote] = useState(
    (meta.quote || meta.favoriteScene || '') as string
  )

  // Validation & Submission
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!eventDate.trim()) {
      newErrors.eventDate = 'Event date is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Build structured category metadata
    const metadata: Record<string, unknown> = {}
    if (metaCreator.trim()) {
      if (categoryId === 'movies') metadata.creatorOrDirector = metaCreator.trim()
      else if (categoryId === 'books') metadata.author = metaCreator.trim()
      else if (categoryId === 'music') metadata.artist = metaCreator.trim()
      else if (categoryId === 'people') metadata.personName = metaCreator.trim()
      else metadata.creator = metaCreator.trim()
    }
    if (metaLocation.trim()) {
      if (categoryId === 'memories') metadata.locationName = metaLocation.trim()
      else metadata.locationOrCity = metaLocation.trim()
    }
    if (metaStatus.trim()) {
      if (categoryId === 'books') metadata.readingStatus = metaStatus.trim()
      else metadata.status = metaStatus.trim()
    }
    if (metaQuote.trim()) {
      metadata.quote = metaQuote.trim()
    }

    try {
      if (isEditing) {
        const updatePayload: UpdateEntryInput = {
          title: title.trim(),
          categoryId,
          eventDate,
          eventTime: eventTime || undefined,
          notes: notes.trim() || undefined,
          tags,
          rating,
          coverImageUrl: coverImageUrl.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          isFavorite,
          isPinned,
          metadata,
        }
        await onSubmit(updatePayload)
      } else {
        const createPayload: CreateEntryInput = {
          title: title.trim(),
          categoryId,
          eventDate,
          eventTime: eventTime || undefined,
          notes: notes.trim() || undefined,
          tags,
          rating,
          coverImageUrl: coverImageUrl.trim() || undefined,
          externalUrl: externalUrl.trim() || undefined,
          isFavorite,
          isPinned,
          metadata,
        }
        await onSubmit(createPayload)
      }
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save entry'
      setErrors((prev) => ({ ...prev, form: message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentCategory = CATEGORIES[categoryId] || CATEGORIES.custom

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {errors.form}
        </div>
      )}

      {/* Category Selector Chips */}
      <div>
        <label className="block text-xs font-semibold text-[#f3f4f6] font-display mb-2">
          Archive Category
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {CATEGORY_LIST.map((cat) => {
            const isSelected = cat.id === categoryId
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 border border-purple-400/40'
                    : 'bg-[#171a24] text-[#9da3b4] hover:text-[#f3f4f6] border border-white/[0.06] hover:border-white/15'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : cat.accentColor }}
                />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Title */}
      <FormField
        label="Title"
        required
        error={errors.title}
        helperText={`e.g. ${
          categoryId === 'movies'
            ? 'Inception (2010)'
            : categoryId === 'books'
            ? 'Atomic Habits'
            : categoryId === 'memories'
            ? 'Trip to Marina Beach with family'
            : 'Project Launch'
        }`}
      >
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What would you like to record?"
          error={Boolean(errors.title)}
          autoFocus
        />
      </FormField>

      {/* Date, Time & Rating Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField label="Event Date" required error={errors.eventDate}>
          <TextInput
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            error={Boolean(errors.eventDate)}
          />
        </FormField>

        <FormField label="Time (Optional)">
          <TextInput
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </FormField>

        <FormField label="Rating">
          <div className="pt-1">
            <RatingPicker value={rating} onChange={setRating} />
          </div>
        </FormField>
      </div>

      {/* Personal Notes / Description */}
      <FormField label="Personal Notes / Review">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your personal reflections, review, memories, or observations..."
          rows={3}
        />
      </FormField>

      {/* Tags */}
      <FormField label="Tags" helperText="Add tags to connect experiences across categories">
        <TagInput tags={tags} onChange={setTags} />
      </FormField>

      {/* Collapsible Category-Specific Details */}
      <div className="pt-2 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={() => setShowMetadata(!showMetadata)}
          className="flex items-center justify-between w-full text-xs font-semibold text-[#9da3b4] hover:text-[#f3f4f6] py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{currentCategory.label} Details & Cover Art</span>
          </span>
          {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMetadata && (
          <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-[#141721] border border-white/[0.06] animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label={
                  categoryId === 'movies'
                    ? 'Director / Creator'
                    : categoryId === 'books'
                    ? 'Author'
                    : categoryId === 'music'
                    ? 'Artist / Band'
                    : categoryId === 'people'
                    ? 'Person / Contact'
                    : 'Creator / Origin'
                }
              >
                <TextInput
                  value={metaCreator}
                  onChange={(e) => setMetaCreator(e.target.value)}
                  placeholder="e.g. Christopher Nolan"
                />
              </FormField>

              <FormField
                label={
                  categoryId === 'books'
                    ? 'Reading Status'
                    : categoryId === 'projects'
                    ? 'Project Status'
                    : 'Status / Stage'
                }
              >
                <TextInput
                  value={metaStatus}
                  onChange={(e) => setMetaStatus(e.target.value)}
                  placeholder="e.g. Completed, In Progress, Rewatched"
                />
              </FormField>
            </div>

            <FormField label="Location or Context">
              <TextInput
                value={metaLocation}
                onChange={(e) => setMetaLocation(e.target.value)}
                placeholder="e.g. Chennai, Grand Cinema, Home"
              />
            </FormField>

            <FormField label="Memorable Quote or Favorite Scene">
              <TextInput
                value={metaQuote}
                onChange={(e) => setMetaQuote(e.target.value)}
                placeholder="Memorable quote or standout scene..."
              />
            </FormField>

            <FormField label="Cover Image URL">
              <TextInput
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                leftIcon={<ImageIcon className="w-4 h-4" />}
              />
            </FormField>

            <FormField label="Reference Link">
              <TextInput
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..."
                leftIcon={<LinkIcon className="w-4 h-4" />}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Favorite & Pin check row */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-[#f3f4f6] cursor-pointer">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 text-purple-600 focus:ring-purple-500 bg-[#171a24]"
            />
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Favorite
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-[#f3f4f6] cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 text-purple-600 focus:ring-purple-500 bg-[#171a24]"
            />
            <span className="flex items-center gap-1">
              <Pin className="w-3.5 h-3.5 text-purple-400" />
              Pin to Dashboard
            </span>
          </label>
        </div>
      </div>

      {/* Form Footer Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="accent"
          size="md"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Save Changes' : 'Record Frame'}
        </Button>
      </div>
    </form>
  )
}

export const EntryFormModal: React.FC<EntryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEntry,
  defaultCategoryId,
}) => {
  if (!isOpen) return null

  // Clean key-based remount pattern: guarantees clean initial state without setState inside effects!
  const formKey = initialEntry
    ? `edit_${initialEntry.id}`
    : `new_${defaultCategoryId || 'default'}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialEntry ? 'Edit Archive Frame' : 'Record Life Frame'}
      description="Record an experience, memory, or media entry to your private archive."
      maxWidth="lg"
    >
      <EntryFormContent
        key={formKey}
        initialEntry={initialEntry}
        defaultCategoryId={defaultCategoryId}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Modal>
  )
}

import React, { useState, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

export interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
  placeholder?: string
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  disabled = false,
  placeholder = 'Add tag and press Enter...',
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    const trimmed = inputValue.trim().replace(/^#/, '')
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
      setInputValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      {/* Existing Tags Chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30"
            >
              <span>#{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-300 transition-colors p-0.5 rounded cursor-pointer"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      {!disabled && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-[#171a24] text-[#f3f4f6] text-xs sm:text-sm rounded-xl px-3.5 py-2 border border-white/[0.08] focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 outline-none placeholder-[#646c7f]"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!inputValue.trim()}
            className="px-3 py-2 rounded-xl bg-[#202433] hover:bg-[#282d40] text-[#f3f4f6] text-xs font-medium border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

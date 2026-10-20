import React, { useState } from 'react'
import { Star } from 'lucide-react'

export interface RatingPickerProps {
  value?: number
  onChange: (rating: number | undefined) => void
  disabled?: boolean
  className?: string
}

export const RatingPicker: React.FC<RatingPickerProps> = ({
  value = 0,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const handleStarClick = (starIndex: number) => {
    if (disabled) return
    if (value === starIndex) {
      onChange(undefined) // Click again to unset
    } else {
      onChange(starIndex)
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : value

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFilled = starIndex <= activeRating
        return (
          <button
            key={starIndex}
            type="button"
            disabled={disabled}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => !disabled && setHoverRating(starIndex)}
            onMouseLeave={() => !disabled && setHoverRating(null)}
            className="p-1 rounded-md text-[#646c7f] hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none"
            aria-label={`Rate ${starIndex} out of 5 stars`}
          >
            <Star
              className={`w-5 h-5 transition-transform hover:scale-110 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-[#646c7f] hover:text-amber-400/60'
              }`}
            />
          </button>
        )
      })}
      {value > 0 && (
        <span className="text-xs text-[#9da3b4] ml-2 font-medium">
          {value}/5
        </span>
      )}
    </div>
  )
}

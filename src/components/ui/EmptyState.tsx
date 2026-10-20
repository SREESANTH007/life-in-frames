import React from 'react'
import { Button } from './Button'

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-[#11131a]/60 border border-white/[0.06] ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[#f3f4f6] font-display">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#9da3b4] max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          leftIcon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

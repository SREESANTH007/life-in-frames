import React from 'react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div
        className={`${sizeStyles[size]} rounded-full border-purple-500/20 border-t-purple-400 animate-spin`}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="text-xs text-[#9da3b4]">{label}</p>}
    </div>
  )
}

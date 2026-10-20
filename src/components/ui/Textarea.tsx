import React, { type TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
  error,
  className = '',
  disabled,
  rows = 3,
  ...props
}) => {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-[#171a24] text-[#f3f4f6] text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border transition-colors outline-none placeholder-[#646c7f] disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
        error
          ? 'border-rose-500/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
          : 'border-white/[0.08] focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20'
      } ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}

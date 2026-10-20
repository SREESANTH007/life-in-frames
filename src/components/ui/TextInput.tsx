import React, { type InputHTMLAttributes } from 'react'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: React.ReactNode
}

export const TextInput: React.FC<TextInputProps> = ({
  error,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="relative flex items-center w-full">
      {leftIcon && (
        <div className="absolute left-3 text-[#646c7f] pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}
      <input
        className={`w-full bg-[#171a24] text-[#f3f4f6] text-xs sm:text-sm rounded-xl border transition-colors outline-none placeholder-[#646c7f] disabled:opacity-50 disabled:cursor-not-allowed ${
          leftIcon ? 'pl-9 pr-3.5 py-2.5' : 'px-3.5 py-2.5'
        } ${
          error
            ? 'border-rose-500/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30'
            : 'border-white/[0.08] focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20'
        } ${className}`}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

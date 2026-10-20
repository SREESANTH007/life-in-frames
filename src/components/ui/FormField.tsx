import React, { type ReactNode } from 'react'

export interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  helperText?: string
  children: ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-[#f3f4f6] font-display"
      >
        {label}
        {required && <span className="text-rose-400 ml-1" title="Required">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#646c7f]">{helperText}</p>
      ) : null}
    </div>
  )
}

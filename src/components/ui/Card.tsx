import React, { type HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#11131a] border border-white/[0.08]',
    elevated: 'bg-[#171a24] border border-white/[0.12] shadow-xl shadow-black/40',
    glass: 'bg-[#11131a]/80 backdrop-blur-md border border-white/[0.1]',
    interactive:
      'bg-[#11131a] border border-white/[0.08] hover:border-purple-500/30 hover:bg-[#141722] hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-200 cursor-pointer',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`rounded-2xl text-[#f3f4f6] ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] ${className}`} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-semibold text-[#f3f4f6] tracking-tight font-display ${className}`} {...props}>
    {children}
  </h3>
)

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-[#9da3b4] mt-0.5 ${className}`} {...props}>
    {children}
  </p>
)

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
)

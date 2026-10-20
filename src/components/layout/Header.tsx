import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Settings, Film } from 'lucide-react'
import { SyncStatusBadge } from '../ui/SyncStatusBadge'

interface HeaderProps {
  onOpenSearch?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Mobile Brand / Title */}
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white border border-purple-400/30 shadow-sm">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-[#f3f4f6] font-display tracking-tight">
            Life in Frames
          </span>
        </div>

        {/* Desktop Search Trigger / Input Mockup */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            onClick={onOpenSearch || (() => navigate('/explore'))}
            aria-label="Search entries and categories"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#11131a] hover:bg-[#171a24] border border-white/[0.08] hover:border-white/[0.16] text-[#9da3b4] text-xs transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#646c7f]" />
              <span>Search archive, titles, categories, tags...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white/[0.06] rounded border border-white/10 font-mono text-[#9da3b4]">
              /
            </kbd>
          </button>
        </div>

        {/* Right Section: Sync indicator & Settings */}
        <div className="flex items-center gap-2.5">
          <SyncStatusBadge status="offline_only" />

          {/* Quick search button on mobile */}
          <button
            onClick={onOpenSearch || (() => navigate('/explore'))}
            aria-label="Search archive"
            className="md:hidden p-2 rounded-xl text-[#9da3b4] hover:text-[#f3f4f6] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Settings link on mobile & desktop */}
          <Link
            to="/settings"
            aria-label="Open application settings"
            className="p-2 rounded-xl text-[#9da3b4] hover:text-[#f3f4f6] hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

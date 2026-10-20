import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Clock,
  Compass,
  Archive,
  Plus,
  Settings,
  Film,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { SyncStatusBadge } from '../ui/SyncStatusBadge'

interface SidebarProps {
  onOpenAddModal: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddModal }) => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/archive', label: 'Archive', icon: Archive },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#0e1017] border-r border-white/[0.08] select-none p-4 z-30 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 border border-purple-400/20">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-[#f3f4f6] font-display leading-tight">
            Life in Frames
          </h1>
          <p className="text-[11px] text-[#9da3b4] tracking-wide uppercase font-medium">
            Personal Archive
          </p>
        </div>
      </div>

      {/* Primary Action: Add Entry */}
      <div className="px-1 mb-6">
        <Button
          variant="accent"
          size="lg"
          onClick={onOpenAddModal}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-full justify-center shadow-purple-600/20"
        >
          Add to Archive
        </Button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-1" aria-label="Main Navigation">
        <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-[#646c7f] uppercase">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-200 border border-purple-500/30'
                    : 'text-[#9da3b4] hover:text-[#f3f4f6] hover:bg-white/[0.04]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Info & Settings */}
      <div className="pt-4 mt-auto border-t border-white/[0.08] space-y-3 px-1">
        <div className="px-2">
          <SyncStatusBadge status="offline_only" />
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-purple-600/15 text-purple-200 border border-purple-500/30'
                : 'text-[#9da3b4] hover:text-[#f3f4f6] hover:bg-white/[0.04]'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

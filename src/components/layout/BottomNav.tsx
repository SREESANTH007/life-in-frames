import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Clock, Plus, Compass, Archive } from 'lucide-react'

interface BottomNavProps {
  onOpenAddModal: () => void
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAddModal }) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1017]/95 backdrop-blur-lg border-t border-white/[0.08] px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-purple-400' : 'text-[#9da3b4] active:text-[#f3f4f6]'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </NavLink>

        {/* Timeline */}
        <NavLink
          to="/timeline"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-purple-400' : 'text-[#9da3b4] active:text-[#f3f4f6]'
            }`
          }
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Timeline</span>
        </NavLink>

        {/* Central Prominent Add Action */}
        <div className="flex items-center justify-center -mt-5 px-2">
          <button
            onClick={onOpenAddModal}
            aria-label="Create new archive entry"
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-purple-600/35 border border-purple-400/40 active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Explore */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-purple-400' : 'text-[#9da3b4] active:text-[#f3f4f6]'
            }`
          }
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Explore</span>
        </NavLink>

        {/* Archive */}
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-purple-400' : 'text-[#9da3b4] active:text-[#f3f4f6]'
            }`
          }
        >
          <Archive className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Archive</span>
        </NavLink>
      </div>
    </nav>
  )
}

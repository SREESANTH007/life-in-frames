import React from 'react'
import { Modal } from '../ui/Modal'
import { CATEGORY_LIST } from '../../constants/categories'
import {
  Film,
  BookOpen,
  Music,
  Camera,
  FolderGit2,
  GraduationCap,
  Compass,
  Target,
  Wallet,
  Lightbulb,
  Users,
  Sparkles,
} from 'lucide-react'
import type { CategoryId } from '../../types'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCategory?: (categoryId: CategoryId) => void
}

const iconMap: Record<string, React.ReactNode> = {
  Film: <Film className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  FolderGit2: <FolderGit2 className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const handleCategoryClick = (categoryId: CategoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Archive Entry"
      description="Select an archive category to record a new experience or life event"
      maxWidth="lg"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
        {CATEGORY_LIST.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="group flex flex-col items-start p-3 sm:p-3.5 rounded-xl bg-[#171a24] hover:bg-[#1f2331] border border-white/[0.08] hover:border-purple-500/40 transition-all text-left cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: category.glowColor,
                color: category.accentColor,
              }}
            >
              {iconMap[category.iconName] || <Sparkles className="w-5 h-5" />}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#f3f4f6] font-display">
              {category.label}
            </span>
            <span className="text-[11px] text-[#9da3b4] line-clamp-1 mt-0.5 leading-snug">
              {category.description}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#9da3b4]">
        <span>Phase 1 Foundation • Universal Entry Form arrives in Phase 2</span>
        <button
          onClick={onClose}
          className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </Modal>
  )
}

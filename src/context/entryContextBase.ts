import { createContext } from 'react'
import type {
  BaseEntry,
  CategoryId,
  CreateEntryInput,
  UpdateEntryInput,
} from '../types'

export interface ArchiveStats {
  totalEntries: number
  categoryCounts: Record<CategoryId, number>
  favoriteCount: number
  pinnedCount: number
  archivedCount: number
  recentlyAdded: BaseEntry[]
  recentlyWatched: BaseEntry[]
  recentlyRead: BaseEntry[]
  recentlyListened: BaseEntry[]
  recentMemories: BaseEntry[]
  pinnedEntries: BaseEntry[]
  onThisDayEntries: BaseEntry[]
}

export interface EntryContextType {
  entries: BaseEntry[]
  isLoading: boolean
  error: string | null
  stats: ArchiveStats
  createEntry: (input: CreateEntryInput) => Promise<BaseEntry>
  updateEntry: (id: string, input: UpdateEntryInput) => Promise<BaseEntry>
  deleteEntry: (id: string) => Promise<boolean>
  toggleFavorite: (id: string) => Promise<void>
  togglePin: (id: string) => Promise<void>
  toggleArchive: (id: string) => Promise<void>
  getEntryById: (id: string) => BaseEntry | undefined
  // Modal handlers
  isFormModalOpen: boolean
  formModalCategory: CategoryId | null
  editingEntry: BaseEntry | null
  viewingEntry: BaseEntry | null
  deletingEntry: BaseEntry | null
  openCreateModal: (category?: CategoryId) => void
  openEditModal: (entry: BaseEntry) => void
  openDetailModal: (entry: BaseEntry) => void
  openDeleteDialog: (entry: BaseEntry) => void
  closeAllModals: () => void
}

export const EntryContext = createContext<EntryContextType | undefined>(undefined)

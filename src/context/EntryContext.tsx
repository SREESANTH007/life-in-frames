import React, {
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { entryRepository } from '../services/entryStorage'
import { EntryContext } from './entryContextBase'
import type { ArchiveStats, EntryContextType } from './entryContextBase'
import type {
  BaseEntry,
  CategoryId,
  CreateEntryInput,
  UpdateEntryInput,
} from '../types'

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Synchronous lazy initializer: avoids setState in effect
  const [entries, setEntries] = useState<BaseEntry[]>(() =>
    entryRepository.getInitialEntriesSync()
  )
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formModalCategory, setFormModalCategory] = useState<CategoryId | null>(null)
  const [editingEntry, setEditingEntry] = useState<BaseEntry | null>(null)
  const [viewingEntry, setViewingEntry] = useState<BaseEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<BaseEntry | null>(null)

  const createEntry = async (input: CreateEntryInput): Promise<BaseEntry> => {
    const created = await entryRepository.create(input)
    setEntries((prev) => [created, ...prev])
    return created
  }

  const updateEntry = async (id: string, input: UpdateEntryInput): Promise<BaseEntry> => {
    const updated = await entryRepository.update(id, input)
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    if (viewingEntry?.id === id) {
      setViewingEntry(updated)
    }
    return updated
  }

  const deleteEntry = async (id: string): Promise<boolean> => {
    const deleted = await entryRepository.delete(id)
    if (deleted) {
      setEntries((prev) => prev.filter((e) => e.id !== id))
      if (viewingEntry?.id === id) setViewingEntry(null)
      if (editingEntry?.id === id) setEditingEntry(null)
    }
    return deleted
  }

  const toggleFavorite = async (id: string): Promise<void> => {
    const updated = await entryRepository.toggleFavorite(id)
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    if (viewingEntry?.id === id) setViewingEntry(updated)
  }

  const togglePin = async (id: string): Promise<void> => {
    const updated = await entryRepository.togglePin(id)
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    if (viewingEntry?.id === id) setViewingEntry(updated)
  }

  const toggleArchive = async (id: string): Promise<void> => {
    const updated = await entryRepository.toggleArchive(id)
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
    if (viewingEntry?.id === id) setViewingEntry(updated)
  }

  const getEntryById = (id: string) => entries.find((e) => e.id === id)

  // Modal open/close helpers
  const openCreateModal = (category?: CategoryId) => {
    setEditingEntry(null)
    setFormModalCategory(category || null)
    setIsFormModalOpen(true)
  }

  const openEditModal = (entry: BaseEntry) => {
    setEditingEntry(entry)
    setFormModalCategory(entry.categoryId)
    setIsFormModalOpen(true)
  }

  const openDetailModal = (entry: BaseEntry) => {
    setViewingEntry(entry)
  }

  const openDeleteDialog = (entry: BaseEntry) => {
    setDeletingEntry(entry)
  }

  const closeAllModals = () => {
    setIsFormModalOpen(false)
    setEditingEntry(null)
    setFormModalCategory(null)
    setViewingEntry(null)
    setDeletingEntry(null)
  }

  // Derived statistics (strictly calculated over stored records per PRD Section 6.2)
  const stats: ArchiveStats = useMemo(() => {
    const activeEntries = entries.filter((e) => !e.isArchived)

    // Category counts
    const categoryCounts: Record<CategoryId, number> = {
      movies: 0,
      books: 0,
      music: 0,
      memories: 0,
      projects: 0,
      learning: 0,
      places: 0,
      goals: 0,
      finance: 0,
      ideas: 0,
      people: 0,
      custom: 0,
    }

    activeEntries.forEach((entry) => {
      if (categoryCounts[entry.categoryId] !== undefined) {
        categoryCounts[entry.categoryId]++
      }
    })

    const favoriteCount = activeEntries.filter((e) => e.isFavorite).length
    const pinnedEntries = activeEntries.filter((e) => e.isPinned)
    const archivedCount = entries.filter((e) => e.isArchived).length

    // Sort by eventDate descending
    const sortedByDate = [...activeEntries].sort(
      (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    )

    const recentlyAdded = sortedByDate.slice(0, 6)
    const recentlyWatched = sortedByDate.filter((e) => e.categoryId === 'movies').slice(0, 4)
    const recentlyRead = sortedByDate.filter((e) => e.categoryId === 'books').slice(0, 4)
    const recentlyListened = sortedByDate.filter((e) => e.categoryId === 'music').slice(0, 4)
    const recentMemories = sortedByDate.filter((e) => e.categoryId === 'memories').slice(0, 4)

    // On This Day: same month and day from previous years (PRD Section 12.1)
    const today = new Date()
    const todayMonth = today.getMonth() + 1 // 1-12
    const todayDay = today.getDate() // 1-31
    const currentYear = today.getFullYear()

    const onThisDayEntries = activeEntries.filter((entry) => {
      const [year, month, day] = entry.eventDate.split('-').map(Number)
      return (
        year < currentYear &&
        month === todayMonth &&
        day === todayDay
      )
    })

    return {
      totalEntries: activeEntries.length,
      categoryCounts,
      favoriteCount,
      pinnedCount: pinnedEntries.length,
      archivedCount,
      recentlyAdded,
      recentlyWatched,
      recentlyRead,
      recentlyListened,
      recentMemories,
      pinnedEntries,
      onThisDayEntries,
    }
  }, [entries])

  const contextValue: EntryContextType = {
    entries,
    isLoading,
    error,
    stats,
    createEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    togglePin,
    toggleArchive,
    getEntryById,
    isFormModalOpen,
    formModalCategory,
    editingEntry,
    viewingEntry,
    deletingEntry,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteDialog,
    closeAllModals,
  }

  return (
    <EntryContext.Provider value={contextValue}>
      {children}
    </EntryContext.Provider>
  )
}

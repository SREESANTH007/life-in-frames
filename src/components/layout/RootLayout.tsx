import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { ErrorBoundary } from './ErrorBoundary'
import { EntryFormModal } from '../entries/EntryFormModal'
import { EntryDetailModal } from '../entries/EntryDetailModal'
import { DeleteConfirmDialog } from '../entries/DeleteConfirmDialog'
import { GlobalSearchModal } from '../search/GlobalSearchModal'
import { useEntries } from '../../context/useEntries'
import type { CreateEntryInput, UpdateEntryInput } from '../../types'

export const RootLayout: React.FC = () => {
  const {
    isFormModalOpen,
    formModalCategory,
    editingEntry,
    viewingEntry,
    deletingEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    togglePin,
    toggleArchive,
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    closeAllModals,
  } = useEntries()

  const [isDeleting, setIsDeleting] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Global search shortcut: Cmd+K / Ctrl+K / /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleFormSubmit = async (input: CreateEntryInput | UpdateEntryInput) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, input)
    } else {
      await createEntry(input as CreateEntryInput)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return
    setIsDeleting(true)
    try {
      await deleteEntry(deletingEntry.id)
      closeAllModals()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f3f4f6] flex flex-col md:flex-row antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar onOpenAddModal={() => openCreateModal()} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] md:pb-8">
        {/* Responsive Header with search modal trigger */}
        <Header onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Dynamic Route Content with Error Boundary */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <BottomNav onOpenAddModal={() => openCreateModal()} />

      {/* Global Offline Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Universal Entry Creation / Editing Modal */}
      <EntryFormModal
        isOpen={isFormModalOpen}
        onClose={closeAllModals}
        onSubmit={handleFormSubmit}
        initialEntry={editingEntry}
        defaultCategoryId={formModalCategory}
      />

      {/* Entry Detail View Modal */}
      <EntryDetailModal
        entry={viewingEntry}
        isOpen={Boolean(viewingEntry)}
        onClose={closeAllModals}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
        onToggleFavorite={toggleFavorite}
        onTogglePin={togglePin}
        onToggleArchive={toggleArchive}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        entry={deletingEntry}
        isOpen={Boolean(deletingEntry)}
        onClose={closeAllModals}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}

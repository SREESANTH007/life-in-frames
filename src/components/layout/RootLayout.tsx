import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { QuickAddModal } from './QuickAddModal'
import { ErrorBoundary } from './ErrorBoundary'

export const RootLayout: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f3f4f6] flex flex-col md:flex-row antialiased selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+4.5rem))] md:pb-8">
        {/* Responsive Header */}
        <Header />

        {/* Dynamic Route Content with Error Boundary */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <BottomNav onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

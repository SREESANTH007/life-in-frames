import { useContext } from 'react'
import { EntryContext } from './entryContextBase'
import type { EntryContextType } from './entryContextBase'

export const useEntries = (): EntryContextType => {
  const context = useContext(EntryContext)
  if (!context) {
    throw new Error('useEntries must be used within an EntryProvider')
  }
  return context
}

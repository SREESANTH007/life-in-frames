/**
 * Life in Frames — Entry Storage & Repository Export
 * Based on PRD Section 2.4 and Section 14
 */

export type { EntryRepository, EntryValidationResult } from './localEntryRepository'
export { LocalEntryRepository } from './localEntryRepository'

import { indexedDbRepository } from './indexedDbRepository'
export { indexedDbRepository }
export const entryRepository = indexedDbRepository

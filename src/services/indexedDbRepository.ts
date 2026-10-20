/**
 * Life in Frames — Offline-First IndexedDB Entry Repository
 * Based on PRD Section 2.4, Section 7, Section 11, and Section 14
 */

import { dbClient } from './db/indexedDb'
import { STORES } from './db/schema'
import { syncQueueService } from './db/syncQueue'
import {
  LocalEntryRepository,
  type EntryRepository,
  type EntryValidationResult,
} from './localEntryRepository'
import type {
  BaseEntry,
  CreateEntryInput,
  UpdateEntryInput,
  EntryFilter,
} from '../types'

export interface SearchOptions extends EntryFilter {
  query?: string
}

export class IndexedDbEntryRepository implements EntryRepository {
  private fallbackRepo: LocalEntryRepository

  constructor() {
    this.fallbackRepo = new LocalEntryRepository()
  }

  public validate(input: Partial<CreateEntryInput>): EntryValidationResult {
    return this.fallbackRepo.validate(input)
  }

  public getInitialEntriesSync(): BaseEntry[] {
    return this.fallbackRepo.getInitialEntriesSync()
  }

  public async getAll(filter?: EntryFilter): Promise<BaseEntry[]> {
    if (!dbClient.isSupported()) {
      return this.fallbackRepo.getAll()
    }

    try {
      let entries: BaseEntry[] = []

      // Utilize index if categoryId filter is specified
      if (filter?.categoryId && filter.categoryId !== 'all') {
        entries = await dbClient.getAllFromIndex<BaseEntry>(
          STORES.ENTRIES,
          'by_category',
          filter.categoryId
        )
      } else {
        entries = await dbClient.getAll<BaseEntry>(STORES.ENTRIES)
      }

      // In-memory filter refinements (favorites, tags, archived status)
      if (filter) {
        if (filter.isFavorite !== undefined) {
          entries = entries.filter((e) => e.isFavorite === filter.isFavorite)
        }
        if (filter.isPinned !== undefined) {
          entries = entries.filter((e) => e.isPinned === filter.isPinned)
        }
        if (filter.isArchived !== undefined) {
          entries = entries.filter((e) => e.isArchived === filter.isArchived)
        }
        if (filter.tag) {
          entries = entries.filter((e) => e.tags.includes(filter.tag!))
        }
        if (filter.searchQuery) {
          const q = filter.searchQuery.toLowerCase().trim()
          entries = entries.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.notes?.toLowerCase().includes(q) ||
              e.tags.some((t) => t.toLowerCase().includes(q))
          )
        }

        // Sorting
        if (filter.sortOrder === 'oldest') {
          entries.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        } else {
          // Default newest first
          entries.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
        }
      } else {
        // Default sort newest first by event date
        entries.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      }

      return entries
    } catch (err) {
      console.warn('IndexedDB getAll failed, falling back to local storage cache:', err)
      return this.fallbackRepo.getAll()
    }
  }

  public async getById(id: string): Promise<BaseEntry | null> {
    if (!dbClient.isSupported()) {
      return this.fallbackRepo.getById(id)
    }

    try {
      return await dbClient.get<BaseEntry>(STORES.ENTRIES, id)
    } catch (err) {
      console.warn('IndexedDB getById failed, falling back:', err)
      return this.fallbackRepo.getById(id)
    }
  }

  public async create(input: CreateEntryInput): Promise<BaseEntry> {
    const validation = this.validate(input)
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      throw new Error(`Validation failed: ${firstError}`)
    }

    const now = new Date().toISOString()
    const newEntry: BaseEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: input.title.trim(),
      categoryId: input.categoryId,
      subCategory: input.subCategory?.trim(),
      eventDate: input.eventDate,
      eventTime: input.eventTime || undefined,
      createdAt: now,
      updatedAt: now,
      notes: input.notes?.trim() || undefined,
      tags: input.tags ? Array.from(new Set(input.tags.map((t) => t.trim()))).filter(Boolean) : [],
      rating: input.rating,
      coverImageUrl: input.coverImageUrl?.trim() || undefined,
      externalUrl: input.externalUrl?.trim() || undefined,
      isFavorite: Boolean(input.isFavorite),
      isPinned: Boolean(input.isPinned),
      isArchived: false,
      syncState: 'offline_only',
      metadata: input.metadata || {},
    }

    if (!dbClient.isSupported()) {
      return this.fallbackRepo.create(input)
    }

    try {
      await dbClient.put(STORES.ENTRIES, newEntry)
      // Enqueue durable offline sync change record (PRD Section 14.2)
      await syncQueueService.enqueue('create', newEntry.id, 'entry', newEntry as unknown as Record<string, unknown>)
      // Update fallback repo as secondary cache
      this.fallbackRepo.create(input).catch(() => {})
      return { ...newEntry }
    } catch (err) {
      console.warn('IndexedDB put failed, falling back to local storage cache:', err)
      return this.fallbackRepo.create(input)
    }
  }

  public async update(id: string, input: UpdateEntryInput): Promise<BaseEntry> {
    const existing = await this.getById(id)
    if (!existing) {
      throw new Error(`Entry with id "${id}" not found`)
    }

    const updated: BaseEntry = {
      ...existing,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      categoryId: input.categoryId !== undefined ? input.categoryId : existing.categoryId,
      subCategory: input.subCategory !== undefined ? input.subCategory.trim() : existing.subCategory,
      eventDate: input.eventDate !== undefined ? input.eventDate : existing.eventDate,
      eventTime: input.eventTime !== undefined ? input.eventTime : existing.eventTime,
      notes: input.notes !== undefined ? input.notes.trim() : existing.notes,
      tags: input.tags !== undefined ? Array.from(new Set(input.tags.map((t) => t.trim()))).filter(Boolean) : existing.tags,
      rating: input.rating !== undefined ? input.rating : existing.rating,
      coverImageUrl: input.coverImageUrl !== undefined ? input.coverImageUrl.trim() : existing.coverImageUrl,
      externalUrl: input.externalUrl !== undefined ? input.externalUrl.trim() : existing.externalUrl,
      isFavorite: input.isFavorite !== undefined ? Boolean(input.isFavorite) : existing.isFavorite,
      isPinned: input.isPinned !== undefined ? Boolean(input.isPinned) : existing.isPinned,
      isArchived: input.isArchived !== undefined ? Boolean(input.isArchived) : existing.isArchived,
      metadata: input.metadata !== undefined ? input.metadata : existing.metadata,
      updatedAt: new Date().toISOString(),
    }

    if (!dbClient.isSupported()) {
      return this.fallbackRepo.update(id, input)
    }

    try {
      await dbClient.put(STORES.ENTRIES, updated)
      // Enqueue sync change
      await syncQueueService.enqueue('update', id, 'entry', input as Record<string, unknown>)
      this.fallbackRepo.update(id, input).catch(() => {})
      return { ...updated }
    } catch (err) {
      console.warn('IndexedDB update failed, using fallback:', err)
      return this.fallbackRepo.update(id, input)
    }
  }

  public async delete(id: string): Promise<boolean> {
    if (!dbClient.isSupported()) {
      return this.fallbackRepo.delete(id)
    }

    try {
      await dbClient.delete(STORES.ENTRIES, id)
      // Enqueue deletion tombstone for synchronization (PRD Section 14.2)
      await syncQueueService.enqueue('delete', id, 'entry')
      this.fallbackRepo.delete(id).catch(() => {})
      return true
    } catch (err) {
      console.warn('IndexedDB delete failed, using fallback:', err)
      return this.fallbackRepo.delete(id)
    }
  }

  public async toggleFavorite(id: string): Promise<BaseEntry> {
    const entry = await this.getById(id)
    if (!entry) throw new Error(`Entry with id "${id}" not found`)
    return this.update(id, { isFavorite: !entry.isFavorite })
  }

  public async togglePin(id: string): Promise<BaseEntry> {
    const entry = await this.getById(id)
    if (!entry) throw new Error(`Entry with id "${id}" not found`)
    return this.update(id, { isPinned: !entry.isPinned })
  }

  public async toggleArchive(id: string): Promise<BaseEntry> {
    const entry = await this.getById(id)
    if (!entry) throw new Error(`Entry with id "${id}" not found`)
    return this.update(id, { isArchived: !entry.isArchived })
  }

  /**
   * Global search across titles, notes, tags, and category metadata (PRD Section 11.1)
   */
  public async search(query: string, options?: EntryFilter): Promise<BaseEntry[]> {
    const all = await this.getAll(options)
    const q = query.toLowerCase().trim()
    if (!q) return all

    return all.filter((entry) => {
      // Title match
      if (entry.title.toLowerCase().includes(q)) return true
      // Notes match
      if (entry.notes?.toLowerCase().includes(q)) return true
      // Tags match
      if (entry.tags.some((t) => t.toLowerCase().includes(q))) return true
      // Category match
      if (entry.categoryId.toLowerCase().includes(q)) return true
      // Structured metadata match
      if (entry.metadata) {
        const metaValues = Object.values(entry.metadata).filter(
          (val) => typeof val === 'string'
        ) as string[]
        if (metaValues.some((v) => v.toLowerCase().includes(q))) return true
      }
      return false
    })
  }

  /**
   * Export all user records as machine-readable JSON (PRD Section 18.1)
   */
  public async exportArchive(): Promise<string> {
    const entries = await this.getAll()
    const exportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schema: 'life_in_frames_v1',
      totalEntries: entries.length,
      entries,
    }
    return JSON.stringify(exportPayload, null, 2)
  }

  /**
   * Import records from machine-readable JSON
   */
  public async importArchive(jsonString: string): Promise<{ imported: number; failed: number }> {
    try {
      const parsed = JSON.parse(jsonString)
      const rawEntries = Array.isArray(parsed) ? parsed : parsed.entries

      if (!Array.isArray(rawEntries)) {
        throw new Error('Invalid archive format: expected an array of entries.')
      }

      let imported = 0
      let failed = 0

      for (const item of rawEntries) {
        try {
          if (!item.title || !item.categoryId || !item.eventDate) {
            failed++
            continue
          }
          await this.create({
            title: item.title,
            categoryId: item.categoryId,
            eventDate: item.eventDate,
            eventTime: item.eventTime,
            notes: item.notes,
            tags: item.tags,
            rating: item.rating,
            coverImageUrl: item.coverImageUrl,
            externalUrl: item.externalUrl,
            isFavorite: item.isFavorite,
            isPinned: item.isPinned,
            metadata: item.metadata,
          })
          imported++
        } catch {
          failed++
        }
      }

      return { imported, failed }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON file'
      throw new Error(`Failed to import archive: ${msg}`, { cause: err })
    }
  }

  /**
   * Storage diagnostics & estimate
   */
  public async getStorageEstimate(): Promise<{
    usageBytes: number
    quotaBytes: number
    formattedUsage: string
  }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate()
        const usageBytes = est.usage || 0
        const quotaBytes = est.quota || 0
        const formattedUsage =
          usageBytes < 1024 * 1024
            ? `${(usageBytes / 1024).toFixed(1)} KB`
            : `${(usageBytes / (1024 * 1024)).toFixed(2)} MB`
        return { usageBytes, quotaBytes, formattedUsage }
      } catch {
        // ignore
      }
    }
    return { usageBytes: 0, quotaBytes: 0, formattedUsage: '< 1 MB' }
  }

  /**
   * Clear all records from IndexedDB
   */
  public async clearAll(): Promise<void> {
    if (dbClient.isSupported()) {
      try {
        await dbClient.clear(STORES.ENTRIES)
        await dbClient.clear(STORES.SYNC_QUEUE)
      } catch {
        // ignore
      }
    }
    this.fallbackRepo.clearAll()
  }
}

export const indexedDbRepository = new IndexedDbEntryRepository()

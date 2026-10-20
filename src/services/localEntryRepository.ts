import type {
  BaseEntry,
  CreateEntryInput,
  UpdateEntryInput,
} from '../types'

export interface EntryValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface EntryRepository {
  getAll(filter?: import('../types').EntryFilter): Promise<BaseEntry[]>
  getById(id: string): Promise<BaseEntry | null>
  create(input: CreateEntryInput): Promise<BaseEntry>
  update(id: string, input: UpdateEntryInput): Promise<BaseEntry>
  delete(id: string): Promise<boolean>
  toggleFavorite(id: string): Promise<BaseEntry>
  togglePin(id: string): Promise<BaseEntry>
  toggleArchive(id: string): Promise<BaseEntry>
}

const STORAGE_KEY = 'life_in_frames_entries_v1'

export class LocalEntryRepository implements EntryRepository {
  private inMemoryCache: BaseEntry[] = []
  private isLoaded = false

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        this.inMemoryCache = JSON.parse(raw)
      } else {
        this.inMemoryCache = []
      }
    } catch (err) {
      console.warn('Unable to read from local storage, using in-memory store:', err)
      this.inMemoryCache = []
    }
    this.isLoaded = true
  }

  private persistToStorage(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryCache))
    } catch (err) {
      console.warn('Unable to write to local storage:', err)
    }
  }

  public getInitialEntriesSync(): BaseEntry[] {
    if (!this.isLoaded) {
      this.loadFromStorage()
    }
    return [...this.inMemoryCache]
  }

  public validate(input: Partial<CreateEntryInput>): EntryValidationResult {
    const errors: Record<string, string> = {}

    if (!input.title || input.title.trim() === '') {
      errors.title = 'Title is required'
    }

    if (!input.categoryId) {
      errors.categoryId = 'Category selection is required'
    }

    if (!input.eventDate || input.eventDate.trim() === '') {
      errors.eventDate = 'Event date is required'
    } else {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(input.eventDate)) {
        errors.eventDate = 'Event date must follow YYYY-MM-DD format'
      }
    }

    if (input.rating !== undefined && (input.rating < 1 || input.rating > 5)) {
      errors.rating = 'Rating must be between 1 and 5'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  public async getAll(filter?: import('../types').EntryFilter): Promise<BaseEntry[]> {
    if (!this.isLoaded) {
      this.loadFromStorage()
    }
    let entries = [...this.inMemoryCache]

    if (filter) {
      if (filter.categoryId && filter.categoryId !== 'all') {
        entries = entries.filter((e) => e.categoryId === filter.categoryId)
      }
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
      if (filter.sortOrder === 'oldest') {
        entries.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      } else {
        entries.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      }
    }

    return entries
  }

  public async getById(id: string): Promise<BaseEntry | null> {
    const entry = this.inMemoryCache.find((e) => e.id === id)
    return entry ? { ...entry } : null
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

    this.inMemoryCache.unshift(newEntry)
    this.persistToStorage()
    return { ...newEntry }
  }

  public async update(id: string, input: UpdateEntryInput): Promise<BaseEntry> {
    const index = this.inMemoryCache.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error(`Entry with id "${id}" not found`)
    }

    const existing = this.inMemoryCache[index]
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

    this.inMemoryCache[index] = updated
    this.persistToStorage()
    return { ...updated }
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.inMemoryCache.length
    this.inMemoryCache = this.inMemoryCache.filter((e) => e.id !== id)
    const wasDeleted = this.inMemoryCache.length < initialLength
    if (wasDeleted) {
      this.persistToStorage()
    }
    return wasDeleted
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

  // Clear helper for tests
  public clearAll(): void {
    this.inMemoryCache = []
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }
}

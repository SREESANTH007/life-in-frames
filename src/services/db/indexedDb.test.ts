import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { dbClient } from './indexedDb'
import { STORES, DB_VERSION } from './schema'
import { IndexedDbEntryRepository } from '../indexedDbRepository'
import { syncQueueService } from './syncQueue'
import type { CreateEntryInput } from '../../types'

describe('Phase 3: IndexedDB Persistence, Migrations, Offline CRUD, & Search', () => {
  let repo: IndexedDbEntryRepository

  beforeEach(async () => {
    repo = new IndexedDbEntryRepository()
    await repo.clearAll()
    await syncQueueService.clear()
  })

  afterEach(async () => {
    await repo.clearAll()
    await syncQueueService.clear()
    dbClient.close()
  })

  it('initializes IndexedDB with versioned schema and all required stores', async () => {
    const db = await dbClient.getDb()
    expect(db.name).toBe('life_in_frames_db')
    expect(db.version).toBe(DB_VERSION)

    // Verify all PRD Section 14 object stores exist
    expect(db.objectStoreNames.contains(STORES.ENTRIES)).toBe(true)
    expect(db.objectStoreNames.contains(STORES.COLLECTIONS)).toBe(true)
    expect(db.objectStoreNames.contains(STORES.SYNC_QUEUE)).toBe(true)
    expect(db.objectStoreNames.contains(STORES.META)).toBe(true)
  })

  it('performs offline CRUD operations in IndexedDB correctly', async () => {
    const input: CreateEntryInput = {
      title: 'Blade Runner 2049',
      categoryId: 'movies',
      eventDate: '2026-10-15',
      notes: 'Masterpiece cinematography by Roger Deakins',
      rating: 5,
      tags: ['cyberpunk', 'sci-fi', 'denis-villeneuve'],
      isFavorite: true,
      metadata: {
        creatorOrDirector: 'Denis Villeneuve',
        releaseYear: 2017,
      },
    }

    // 1. Create
    const created = await repo.create(input)
    expect(created.id).toBeDefined()
    expect(created.title).toBe('Blade Runner 2049')
    expect(created.eventDate).toBe('2026-10-15')
    expect(created.syncState).toBe('offline_only')

    // 2. Read by ID
    const retrieved = await repo.getById(created.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.id).toBe(created.id)
    expect(retrieved?.title).toBe('Blade Runner 2049')
    expect((retrieved?.metadata as { creatorOrDirector?: string })?.creatorOrDirector).toBe('Denis Villeneuve')

    // 3. Read All
    const all = await repo.getAll()
    expect(all.length).toBe(1)
    expect(all[0].id).toBe(created.id)

    // 4. Update
    const updated = await repo.update(created.id, {
      rating: 4,
      notes: 'Updated notes after discussion',
      isPinned: true,
    })
    expect(updated.rating).toBe(4)
    expect(updated.isPinned).toBe(true)
    expect(updated.notes).toBe('Updated notes after discussion')

    // 5. Toggle favorite & pin
    const unfavorited = await repo.toggleFavorite(created.id)
    expect(unfavorited.isFavorite).toBe(false)

    // 6. Delete
    const deleted = await repo.delete(created.id)
    expect(deleted).toBe(true)

    const afterDelete = await repo.getById(created.id)
    expect(afterDelete).toBeNull()

    const allAfterDelete = await repo.getAll()
    expect(allAfterDelete.length).toBe(0)
  })

  it('utilizes indexes for fast filtered queries by category', async () => {
    await repo.create({
      title: 'Klara and the Sun',
      categoryId: 'books',
      eventDate: '2026-05-10',
    })
    await repo.create({
      title: 'Project Hail Mary',
      categoryId: 'books',
      eventDate: '2026-06-12',
    })
    await repo.create({
      title: 'Inception',
      categoryId: 'movies',
      eventDate: '2026-07-01',
    })

    const books = await repo.getAll({ categoryId: 'books' })
    expect(books.length).toBe(2)
    expect(books.every((b) => b.categoryId === 'books')).toBe(true)

    const movies = await repo.getAll({ categoryId: 'movies' })
    expect(movies.length).toBe(1)
    expect(movies[0].title).toBe('Inception')
  })

  it('performs full-text and metadata search locally without server dependencies', async () => {
    await repo.create({
      title: 'Atomic Habits',
      categoryId: 'books',
      eventDate: '2026-01-01',
      notes: 'Make it obvious, attractive, easy, satisfying',
      tags: ['productivity', 'psychology'],
      metadata: { author: 'James Clear' },
    })
    await repo.create({
      title: 'Steve Jobs',
      categoryId: 'books',
      eventDate: '2026-02-01',
      notes: 'Biography by Walter Isaacson',
      tags: ['biography', 'tech', 'apple'],
      metadata: { author: 'Walter Isaacson' },
    })

    // Search by title
    const searchByTitle = await repo.search('Atomic')
    expect(searchByTitle.length).toBe(1)
    expect(searchByTitle[0].title).toBe('Atomic Habits')

    // Search by notes
    const searchByNotes = await repo.search('satisfying')
    expect(searchByNotes.length).toBe(1)
    expect(searchByNotes[0].title).toBe('Atomic Habits')

    // Search by tag
    const searchByTag = await repo.search('tech')
    expect(searchByTag.length).toBe(1)
    expect(searchByTag[0].title).toBe('Steve Jobs')

    // Search by structured metadata
    const searchByAuthor = await repo.search('Isaacson')
    expect(searchByAuthor.length).toBe(1)
    expect(searchByAuthor[0].title).toBe('Steve Jobs')
  })

  it('tracks offline mutations in the durable sync queue', async () => {
    const entry = await repo.create({
      title: 'The Matrix',
      categoryId: 'movies',
      eventDate: '2026-04-10',
    })

    let pending = await syncQueueService.getPending()
    expect(pending.length).toBe(1)
    expect(pending[0].operation).toBe('create')
    expect(pending[0].entityId).toBe(entry.id)

    // Update
    await repo.update(entry.id, { rating: 5 })
    pending = await syncQueueService.getPending()
    expect(pending.length).toBe(2)
    expect(pending[1].operation).toBe('update')

    // Delete (tombstone)
    await repo.delete(entry.id)
    pending = await syncQueueService.getPending()
    expect(pending.length).toBe(3)
    expect(pending[2].operation).toBe('delete')
    expect(pending[2].entityId).toBe(entry.id)
  })

  it('exports and imports machine-readable JSON archive correctly', async () => {
    await repo.create({
      title: 'Arrival',
      categoryId: 'movies',
      eventDate: '2026-08-20',
      notes: 'Linguistic masterpiece',
      rating: 5,
      tags: ['sci-fi', 'linguistics'],
    })

    // Export archive
    const jsonStr = await repo.exportArchive()
    const parsed = JSON.parse(jsonStr)

    expect(parsed.version).toBe('1.0')
    expect(parsed.totalEntries).toBe(1)
    expect(parsed.entries[0].title).toBe('Arrival')

    // Clear and restore
    await repo.clearAll()
    const beforeImport = await repo.getAll()
    expect(beforeImport.length).toBe(0)

    const importResult = await repo.importArchive(jsonStr)
    expect(importResult.imported).toBe(1)
    expect(importResult.failed).toBe(0)

    const restored = await repo.getAll()
    expect(restored.length).toBe(1)
    expect(restored[0].title).toBe('Arrival')
    expect(restored[0].rating).toBe(5)
  })
})

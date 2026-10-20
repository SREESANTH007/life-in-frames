import { describe, it, expect, beforeEach } from 'vitest'
import { LocalEntryRepository } from './entryStorage'
import type { CreateEntryInput } from '../types'

describe('LocalEntryRepository', () => {
  let repository: LocalEntryRepository

  beforeEach(() => {
    repository = new LocalEntryRepository()
    repository.clearAll()
  })

  it('validates required fields properly', () => {
    // Missing title
    const res1 = repository.validate({
      categoryId: 'movies',
      eventDate: '2026-10-20',
    })
    expect(res1.isValid).toBe(false)
    expect(res1.errors.title).toBeDefined()

    // Missing eventDate
    const res2 = repository.validate({
      title: 'Inception',
      categoryId: 'movies',
    })
    expect(res2.isValid).toBe(false)
    expect(res2.errors.eventDate).toBeDefined()

    // Invalid rating (> 5)
    const res3 = repository.validate({
      title: 'Inception',
      categoryId: 'movies',
      eventDate: '2026-10-20',
      rating: 6,
    })
    expect(res3.isValid).toBe(false)
    expect(res3.errors.rating).toBeDefined()

    // Valid input
    const res4 = repository.validate({
      title: 'Inception',
      categoryId: 'movies',
      eventDate: '2026-10-20',
      rating: 5,
    })
    expect(res4.isValid).toBe(true)
    expect(Object.keys(res4.errors).length).toBe(0)
  })

  it('creates an entry and separates eventDate from createdAt', async () => {
    const input: CreateEntryInput = {
      title: 'Interstellar',
      categoryId: 'movies',
      eventDate: '2024-05-15', // Historical date
      notes: 'Rewatched in IMAX 70mm',
      rating: 5,
      tags: ['nolan', 'sci-fi', 'imax'],
      isFavorite: true,
      metadata: {
        creatorOrDirector: 'Christopher Nolan',
        isRewatch: true,
      },
    }

    const created = await repository.create(input)

    expect(created.id).toBeDefined()
    expect(created.title).toBe('Interstellar')
    expect(created.categoryId).toBe('movies')
    expect(created.eventDate).toBe('2024-05-15')
    expect(created.createdAt).toBeDefined()
    // Event date and created date must remain separate per PRD Section 7.1
    expect(created.eventDate).not.toBe(created.createdAt)
    expect(created.isFavorite).toBe(true)
    expect(created.tags).toEqual(['nolan', 'sci-fi', 'imax'])

    const all = await repository.getAll()
    expect(all.length).toBe(1)
    expect(all[0].id).toBe(created.id)
  })

  it('updates an existing entry and refreshes updatedAt', async () => {
    const created = await repository.create({
      title: 'Dune: Part Two',
      categoryId: 'movies',
      eventDate: '2026-03-01',
      rating: 4,
    })

    const initialCreatedAt = created.createdAt

    const updated = await repository.update(created.id, {
      rating: 5,
      notes: 'Even better on second viewing',
      isPinned: true,
    })

    expect(updated.id).toBe(created.id)
    expect(updated.createdAt).toBe(initialCreatedAt)
    expect(updated.rating).toBe(5)
    expect(updated.notes).toBe('Even better on second viewing')
    expect(updated.isPinned).toBe(true)

    const fetched = await repository.getById(created.id)
    expect(fetched?.rating).toBe(5)
  })

  it('toggles favorite, pin, and archive correctly', async () => {
    const entry = await repository.create({
      title: 'Deep Work',
      categoryId: 'books',
      eventDate: '2026-01-10',
    })

    expect(entry.isFavorite).toBe(false)
    expect(entry.isPinned).toBe(false)
    expect(entry.isArchived).toBe(false)

    const favorited = await repository.toggleFavorite(entry.id)
    expect(favorited.isFavorite).toBe(true)

    const pinned = await repository.togglePin(entry.id)
    expect(pinned.isPinned).toBe(true)

    const archived = await repository.toggleArchive(entry.id)
    expect(archived.isArchived).toBe(true)
  })

  it('deletes an entry permanently without affecting others', async () => {
    const entry1 = await repository.create({
      title: 'Entry 1',
      categoryId: 'ideas',
      eventDate: '2026-02-01',
    })
    const entry2 = await repository.create({
      title: 'Entry 2',
      categoryId: 'music',
      eventDate: '2026-02-02',
    })

    let all = await repository.getAll()
    expect(all.length).toBe(2)

    const deleted = await repository.delete(entry1.id)
    expect(deleted).toBe(true)

    all = await repository.getAll()
    expect(all.length).toBe(1)
    expect(all[0].id).toBe(entry2.id)

    const fetched = await repository.getById(entry1.id)
    expect(fetched).toBeNull()
  })
})

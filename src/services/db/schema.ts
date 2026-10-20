/**
 * Life in Frames — IndexedDB Database Schema and Versioned Migrations
 * Based on PRD Section 2.4, Section 14.2, and Section 14.4
 */

export const DB_NAME = 'life_in_frames_db'
export const DB_VERSION = 1

export const STORES = {
  ENTRIES: 'entries',
  COLLECTIONS: 'collections',
  SYNC_QUEUE: 'sync_queue',
  META: 'meta',
} as const

export type StoreName = (typeof STORES)[keyof typeof STORES]

export interface Migration {
  version: number
  description: string
  migrate: (db: IDBDatabase, transaction: IDBTransaction) => void
}

/**
 * Versioned database migrations.
 * Each migration is applied sequentially if the database version is upgraded.
 */
export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema: entries, collections, sync_queue, and meta stores with indexes',
    migrate: (db: IDBDatabase) => {
      // 1. Entries object store
      if (!db.objectStoreNames.contains(STORES.ENTRIES)) {
        const entryStore = db.createObjectStore(STORES.ENTRIES, { keyPath: 'id' })
        entryStore.createIndex('by_category', 'categoryId', { unique: false })
        entryStore.createIndex('by_event_date', 'eventDate', { unique: false })
        entryStore.createIndex('by_created_at', 'createdAt', { unique: false })
        entryStore.createIndex('by_favorite', 'isFavorite', { unique: false })
        entryStore.createIndex('by_pinned', 'isPinned', { unique: false })
        entryStore.createIndex('by_archived', 'isArchived', { unique: false })
        entryStore.createIndex('by_sync_state', 'syncState', { unique: false })
      }

      // 2. Collections object store
      if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
        const collectionStore = db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'id' })
        collectionStore.createIndex('by_title', 'title', { unique: false })
        collectionStore.createIndex('by_created_at', 'createdAt', { unique: false })
      }

      // 3. Durable offline sync queue (PRD Section 14.2)
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' })
        syncStore.createIndex('by_timestamp', 'timestamp', { unique: false })
        syncStore.createIndex('by_status', 'status', { unique: false })
        syncStore.createIndex('by_entity_id', 'entityId', { unique: false })
      }

      // 4. Metadata store (for app settings, schema history, and local diagnostics)
      if (!db.objectStoreNames.contains(STORES.META)) {
        db.createObjectStore(STORES.META, { keyPath: 'key' })
      }
    },
  },
]

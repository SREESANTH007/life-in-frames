/**
 * Life in Frames — Promise-based IndexedDB Client with Versioned Migrations
 * Based on PRD Section 2.4, Section 14.1, and Section 14.4
 */

import { DB_NAME, DB_VERSION, MIGRATIONS, type StoreName } from './schema'

class IndexedDbClient {
  private dbInstance: IDBDatabase | null = null
  private connectionPromise: Promise<IDBDatabase> | null = null

  /**
   * Returns whether native IndexedDB is supported and accessible in current environment
   */
  public isSupported(): boolean {
    const idb =
      typeof window !== 'undefined'
        ? window.indexedDB
        : (globalThis as unknown as { indexedDB?: IDBFactory })?.indexedDB
    return typeof idb !== 'undefined' && idb !== null
  }

  /**
   * Opens or returns the active database connection, running migrations if needed
   */
  public async getDb(): Promise<IDBDatabase> {
    if (this.dbInstance) {
      return this.dbInstance
    }

    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const idb = typeof window !== 'undefined' ? window.indexedDB : (globalThis as unknown as { indexedDB: IDBFactory }).indexedDB

      if (!idb) {
        reject(new Error('IndexedDB is not supported in this runtime environment.'))
        return
      }

      const request = idb.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result
        const oldVersion = event.oldVersion
        const transaction = request.transaction!

        // Apply migrations sequentially based on version number
        for (const migration of MIGRATIONS) {
          if (migration.version > oldVersion && migration.version <= DB_VERSION) {
            try {
              migration.migrate(db, transaction)
            } catch (err) {
              console.error(`Migration to version ${migration.version} failed:`, err)
              throw err
            }
          }
        }
      }

      request.onsuccess = () => {
        this.dbInstance = request.result

        // Handle database close or version change from other tabs
        this.dbInstance.onversionchange = () => {
          this.dbInstance?.close()
          this.dbInstance = null
          this.connectionPromise = null
        }

        resolve(this.dbInstance)
      }

      request.onerror = () => {
        this.connectionPromise = null
        reject(request.error || new Error('Failed to open IndexedDB database.'))
      }
    })

    return this.connectionPromise
  }

  /**
   * Retrieve a single record by its key
   */
  public async get<T>(storeName: StoreName, key: IDBValidKey): Promise<T | null> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve((request.result as T) || null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Retrieve all records from an object store
   */
  public async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve((request.result as T[]) || [])
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Retrieve records using an existing index
   */
  public async getAllFromIndex<T>(
    storeName: StoreName,
    indexName: string,
    query?: IDBValidKey | IDBKeyRange
  ): Promise<T[]> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = query !== undefined ? index.getAll(query) : index.getAll()

      request.onsuccess = () => {
        resolve((request.result as T[]) || [])
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Insert or update a record
   */
  public async put<T>(storeName: StoreName, value: T): Promise<T> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(value)

      request.onsuccess = () => {
        resolve(value)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Delete a record by key
   */
  public async delete(storeName: StoreName, key: IDBValidKey): Promise<boolean> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve(true)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Count records in an object store
   */
  public async count(storeName: StoreName): Promise<number> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Clear all records in an object store
   */
  public async clear(storeName: StoreName): Promise<void> {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Close connection (used for testing or migrations)
   */
  public close(): void {
    if (this.dbInstance) {
      this.dbInstance.close()
      this.dbInstance = null
    }
    this.connectionPromise = null
  }
}

export const dbClient = new IndexedDbClient()

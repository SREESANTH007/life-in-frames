/**
 * Life in Frames — Durable Offline Sync Queue
 * Based on PRD Section 14.2 (Synchronization Queue & Tombstones)
 */

import { dbClient } from './indexedDb'
import { STORES } from './schema'

export type SyncOperation = 'create' | 'update' | 'delete'
export type SyncStatus = 'pending' | 'syncing' | 'failed'

export interface SyncQueueItem {
  id: string
  entityId: string
  entityType: 'entry' | 'collection'
  operation: SyncOperation
  timestamp: string
  status: SyncStatus
  payload?: Record<string, unknown>
  retryCount: number
  lastError?: string
}

export class SyncQueueService {
  /**
   * Enqueue a local change for later synchronization with backend
   */
  public async enqueue(
    operation: SyncOperation,
    entityId: string,
    entityType: 'entry' | 'collection' = 'entry',
    payload?: Record<string, unknown>
  ): Promise<SyncQueueItem> {
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      entityId,
      entityType,
      operation,
      timestamp: new Date().toISOString(),
      status: 'pending',
      payload,
      retryCount: 0,
    }

    try {
      if (dbClient.isSupported()) {
        await dbClient.put(STORES.SYNC_QUEUE, item)
      }
    } catch (err) {
      console.warn('Failed to persist sync item to IndexedDB queue:', err)
    }

    return item
  }

  /**
   * Get all pending sync operations in chronological order
   */
  public async getPending(): Promise<SyncQueueItem[]> {
    try {
      if (!dbClient.isSupported()) return []
      const items = await dbClient.getAll<SyncQueueItem>(STORES.SYNC_QUEUE)
      return items.filter((i) => i.status === 'pending')
    } catch {
      return []
    }
  }

  /**
   * Get count of queued offline changes
   */
  public async getPendingCount(): Promise<number> {
    try {
      if (!dbClient.isSupported()) return 0
      const items = await this.getPending()
      return items.length
    } catch {
      return 0
    }
  }

  /**
   * Delete or complete a sync queue item
   */
  public async dequeue(id: string): Promise<boolean> {
    try {
      if (!dbClient.isSupported()) return false
      return await dbClient.delete(STORES.SYNC_QUEUE, id)
    } catch {
      return false
    }
  }

  /**
   * Clear all items in the sync queue
   */
  public async clear(): Promise<void> {
    try {
      if (dbClient.isSupported()) {
        await dbClient.clear(STORES.SYNC_QUEUE)
      }
    } catch {
      // ignore
    }
  }
}

export const syncQueueService = new SyncQueueService()

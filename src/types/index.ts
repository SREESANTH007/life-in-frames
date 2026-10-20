/**
 * Life in Frames — Core Domain Types
 * Based on PRD Section 7 (Universal Entry System) and Section 8 (Archive Categories)
 */

export type CategoryId =
  | 'movies'
  | 'books'
  | 'music'
  | 'memories'
  | 'projects'
  | 'learning'
  | 'places'
  | 'goals'
  | 'finance'
  | 'ideas'
  | 'people'
  | 'custom';

export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  description: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  cssClass: string;
}

export type SyncState = 'synced' | 'pending_sync' | 'sync_error' | 'offline_only';

export interface BaseEntry {
  id: string;
  userId?: string;
  title: string;
  categoryId: CategoryId;
  subCategory?: string;
  eventDate: string; // ISO date string YYYY-MM-DD
  eventTime?: string; // Optional HH:mm
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  notes?: string;
  tags: string[];
  coverImageUrl?: string;
  attachmentUrls?: string[];
  externalUrl?: string;
  relatedEntryIds?: string[];
  collectionIds?: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  syncState: SyncState;
  metadata?: Record<string, unknown>;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  entryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'cinematic';
  defaultSort: 'eventDate_desc' | 'eventDate_asc' | 'created_desc';
  dateFormat: string;
  offlineMode: boolean;
}

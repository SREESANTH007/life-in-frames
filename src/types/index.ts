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

// Category-specific metadata interfaces
export interface MoviesMetadata {
  creatorOrDirector?: string;
  watchedDate?: string;
  isRewatch?: boolean;
  rewatchCount?: number;
  favoriteScene?: string;
  quote?: string;
  releaseYear?: number;
  rating?: number; // 1-5
}

export interface BooksMetadata {
  author?: string;
  readingStatus?: 'want_to_read' | 'reading' | 'completed' | 'paused';
  pagesRead?: number;
  totalPages?: number;
  quote?: string;
  rating?: number; // 1-5
}

export interface MusicMetadata {
  artist?: string;
  album?: string;
  track?: string;
  releaseYear?: number;
  format?: string;
  rating?: number; // 1-5
}

export interface MemoriesMetadata {
  locationName?: string;
  mood?: string;
  eventGroup?: string;
}

export interface ProjectsMetadata {
  projectUrl?: string;
  milestone?: string;
  status?: 'in_progress' | 'completed' | 'paused';
}

export interface LearningMetadata {
  skillOrSubject?: string;
  platform?: string;
  completionStatus?: 'learning' | 'completed';
}

export interface PlacesMetadata {
  locationOrCity?: string;
  visitType?: 'trip' | 'restaurant' | 'event' | 'theatre' | 'other';
  expense?: number;
}

export interface GoalsMetadata {
  targetDate?: string;
  targetMetric?: string;
  isCompleted?: boolean;
  completedDate?: string;
}

export interface FinanceMetadata {
  amount?: number;
  currency?: string;
  expenseType?: 'purchase' | 'investment' | 'subscription' | 'travel' | 'other';
}

export interface IdeasMetadata {
  conceptType?: string;
  nextAction?: string;
}

export interface PeopleMetadata {
  personName?: string;
  relationshipContext?: string;
}

export type EntryMetadata =
  | MoviesMetadata
  | BooksMetadata
  | MusicMetadata
  | MemoriesMetadata
  | ProjectsMetadata
  | LearningMetadata
  | PlacesMetadata
  | GoalsMetadata
  | FinanceMetadata
  | IdeasMetadata
  | PeopleMetadata
  | Record<string, unknown>;

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
  rating?: number; // 1-5 optional universal rating
  coverImageUrl?: string;
  attachmentUrls?: string[];
  externalUrl?: string;
  relatedEntryIds?: string[];
  collectionIds?: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  syncState: SyncState;
  metadata?: EntryMetadata;
}

export interface CreateEntryInput {
  title: string;
  categoryId: CategoryId;
  subCategory?: string;
  eventDate: string; // YYYY-MM-DD
  eventTime?: string; // HH:mm
  notes?: string;
  tags?: string[];
  rating?: number;
  coverImageUrl?: string;
  externalUrl?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  metadata?: EntryMetadata;
}

export interface UpdateEntryInput {
  title?: string;
  categoryId?: CategoryId;
  subCategory?: string;
  eventDate?: string;
  eventTime?: string;
  notes?: string;
  tags?: string[];
  rating?: number;
  coverImageUrl?: string;
  externalUrl?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  metadata?: EntryMetadata;
}

export interface EntryFilter {
  categoryId?: CategoryId | 'all';
  searchQuery?: string;
  tag?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  sortOrder?: 'newest' | 'oldest';
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

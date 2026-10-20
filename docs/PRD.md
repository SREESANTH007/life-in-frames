# LIFE IN FRAMES
## Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** 20 October 2026  
**Product type:** Private, personal life archive and tracking application  
**Primary platform:** Android, distributed through Google Play Store  
**Development approach:** Responsive React web application packaged as an Android app using Capacitor

---

# 1. Product Overview

## 1.1 Product Vision

Life in Frames is a private, personal archive that allows users to record, organize, revisit, and understand the different parts of their lives in one place.

It is a unified space for tracking experiences, interests, memories, learning, entertainment, personal projects, achievements, and everyday moments.

Rather than maintaining separate applications for movies, books, music, memories, goals, and personal notes, users can bring everything together in one chronological archive.

The application should feel like a personal digital time capsule: cinematic, thoughtful, visually polished, private, and enjoyable to use.

## 1.2 Core Principle

**Every meaningful part of life deserves a place in the archive.**

Life in Frames is not a social network, a public profile, or a conventional productivity application.

It is built primarily for one person to document their own life.

## 1.3 Target Audience

- People who enjoy documenting their lives and experiences.
- Film, book, and music enthusiasts.
- People who maintain journals, personal archives, and collections.
- People who want to track personal growth and accomplishments.
- Users who want their records organized chronologically.
- Users who value privacy and offline access.

## 1.4 Product Goals

1. Allow users to record different types of life events in one application.
2. Provide a unified, searchable timeline.
3. Support offline browsing and manual entry.
4. Automatically enrich supported entries with external catalogue information when online.
5. Connect related experiences across categories.
6. Provide meaningful historical summaries and personal statistics.
7. Synchronize user data securely across supported devices.
8. Deliver a polished, responsive interface suitable for Android phones, tablets, and desktop browsers.
9. Publish the application on Google Play Store through Android packaging.
10. Avoid unnecessary complexity, social features, artificial intelligence, and invasive permissions.

---

# 2. Technology Stack

The application must be developed as a **standard React web project**, not React Native and not Expo.

## 2.1 Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router for navigation
- A suitable icon library, such as Lucide
- A consistent shared design system
- IndexedDB for offline-first browser storage
- A reliable data-fetching and caching layer
- Capacitor for packaging the finished web application as an Android application

The project must remain a conventional web application that can run in a browser during development.

## 2.2 Backend

- Node.js
- Express
- TypeScript
- REST API architecture
- Request validation and centralized error handling
- Authentication and authorization middleware
- Structured logging and environment-based configuration

## 2.3 Database

- PostgreSQL as the primary cloud database
- Prisma as the ORM and migration system
- Proper relational data models, foreign keys, indexes, and transaction handling

## 2.4 Offline Storage

- IndexedDB for locally stored application data, cached catalogue information, and queued changes.
- A repository or storage abstraction that separates UI components from persistence details.
- A synchronization queue for changes that must be sent to the backend later.
- A migration strategy for local schema changes.

If testing demonstrates that the packaged Android application requires native SQLite capabilities, a Capacitor-compatible SQLite plugin may replace or supplement IndexedDB behind the same storage abstraction.

The application must not depend on a permanent internet connection for its basic personal-archive functionality.

## 2.5 Media Storage

- Cloudflare R2 for cloud-hosted photographs, videos, and attachments.
- Private object storage by default.
- Short-lived signed URLs for authorized media access.
- Local media references and upload queues for offline operation.

## 2.6 Android Distribution

- Capacitor Android project
- Android Studio for native project configuration and release builds
- Android App Bundle (AAB)
- Google Play Console for testing and publication

The same React application should work in a desktop browser, mobile browser, and packaged Android application.

## 2.7 Explicit Exclusions

- No Expo.
- No React Native.
- No Firebase.
- No AI APIs or AI-generated summaries.
- No public social feed.
- No followers, likes, or public profiles.
- No mandatory online connection for manual record creation.
- No unnecessary location, contacts, or background-tracking permissions.

---

# 3. Platform and Responsive Design

## 3.1 Development Model

The application must first be built as a standard responsive React website.

Capacitor will package the production web build inside an Android application. Native capabilities can be accessed through compatible Capacitor plugins when necessary.

The frontend must not rely on browser-only behavior that prevents it from working inside the packaged Android application.

## 3.2 Responsive Requirements

### Mobile

- Touch-friendly controls and appropriate tap targets.
- Single-column layouts where appropriate.
- Compact navigation designed for portrait screens.
- Bottom navigation for primary sections.
- A prominent, accessible Add action.
- Forms optimized for mobile keyboards.
- Support for Android system insets and safe areas.
- Responsive media cards and timelines.

### Tablet

- Wider layouts and optional multi-column grids.
- Efficient use of available screen space.
- Comfortable touch navigation.

### Desktop

- Sidebar or expanded navigation.
- Multi-column dashboards and collections.
- Keyboard-friendly navigation.
- Wider timeline and calendar layouts.
- Appropriate maximum content widths.

Responsive design must be implemented from the beginning, not added as a final styling step.

---

# 4. Design System

## 4.1 Visual Direction

The interface should have a premium, cinematic, personal-archive aesthetic.

It should feel calm and intentional rather than like a generic administration dashboard.

## 4.2 Default Theme

- Deep charcoal and near-black backgrounds.
- Off-white primary text.
- Muted purple accents.
- Subtle borders and restrained shadows.
- Carefully spaced layouts.
- Elegant typography.
- Rounded cards with consistent radii.
- Smooth, restrained transitions.
- High-quality artwork where available.

## 4.3 Design Rules

1. Prioritize readability and usability over decoration.
2. Maintain consistent spacing, typography, colors, and component behavior.
3. Use category-specific visual treatments without fragmenting the overall design.
4. Provide loading, empty, offline, error, and success states.
5. Respect reduced-motion preferences.
6. Ensure adequate contrast and accessible form labels.
7. Keep screens usable on small Android devices.
8. Avoid excessive animations and unnecessarily heavy effects.

All visual tokens must be defined centrally so the application can be restyled without rewriting individual screens.

---

# 5. Application Navigation

The main navigation should contain:

1. **Home** — personal overview and recent activity.
2. **Timeline** — unified chronological history.
3. **Explore** — discover, browse, and search archive categories.
4. **Archive** — collections, saved items, and archived records.
5. **Add** — a prominent action for creating a new entry.

The exact presentation may vary between mobile and desktop, but the underlying destinations and functionality must remain consistent.

A settings area must be accessible from the application shell.

---

# 6. Home Dashboard

The Home screen should provide a meaningful overview of the user's personal archive.

## 6.1 Required Components

- Current date and personalized greeting.
- Quick-add actions.
- Recently created entries.
- Recently watched movies and television shows.
- Recently read books.
- Recently recorded music entries.
- Recent memories and life events.
- Pinned collections.
- Active goals and progress.
- Upcoming reminders, if configured.
- On This Day historical entries.
- Monthly activity overview.
- Category-level activity summaries.

## 6.2 Home Screen Behavior

- Every item should open its corresponding entry.
- Quick actions should launch the correct creation flow.
- Sections with no data should show helpful empty states.
- Offline status should be communicated clearly.
- Dashboard statistics must be derived from stored records rather than hardcoded sample values.
- Users should be able to customize which supported sections appear on Home.

---

# 7. Universal Entry System

The universal entry system is the foundation of Life in Frames.

Every record should share a common structure while supporting category-specific information.

## 7.1 Common Entry Fields

Each entry should support:

- Unique identifier.
- User identifier.
- Title.
- Category and optional subcategory.
- Event date, including optional time.
- Creation timestamp.
- Last-updated timestamp.
- Description or personal notes.
- Tags.
- Optional cover image or thumbnail.
- Optional photo, video, or document attachments.
- External reference URL.
- Related entries.
- Collection membership.
- Favorite or pinned status.
- Archived status.
- Optional reminder.
- Category-specific metadata.
- Local synchronization status.
- Deletion marker for synchronization.

The event date and creation timestamp must remain separate. A user may record an event today that happened several years ago.

## 7.2 Entry Creation

Users must be able to create a manual entry without an internet connection.

The basic creation flow should allow users to:

1. Select a category.
2. Enter a title.
3. Select the event date.
4. Add notes or a description.
5. Add optional tags and attachments.
6. Save the entry.

Additional metadata should be available without overwhelming the basic form.

## 7.3 Entry Management

Users must be able to:

- View entries.
- Edit existing entries.
- Delete entries.
- Favorite entries.
- Pin entries.
- Archive entries.
- Restore archived entries.
- Duplicate an entry where appropriate.
- Add or remove tags.
- Link related entries.
- Add entries to collections.
- Search within an entry.
- View its creation and modification history where supported.

Deleting an entry must not silently erase unrelated records. Related-entry behavior must be defined explicitly.

---

# 8. Life Archive Categories

The following categories should share the universal entry system but provide specialized fields and workflows.

## 8.1 Movies and Television

### Features

- Search for movies and television shows.
- Retrieve catalogue metadata through TMDB when online.
- Add titles manually when offline or when a title is unavailable.
- Record watched dates.
- Rate movies and shows.
- Write reviews and personal notes.
- Mark favorites.
- Track rewatches.
- Track television seasons and individual episodes.
- Record episode-level viewing dates where appropriate.
- Record favorite scenes and memorable moments.
- Save quotes and observations.
- View personal watch history.
- Filter by genre, year, rating, and watched status.
- Display posters and artwork when available.

### Personal Metadata

- Personal rating.
- Review.
- Watched date.
- Rewatch count or individual watch events.
- Favorite scene.
- Personal tags.
- Viewing context and notes.

Catalogue metadata must remain distinct from the user's personal viewing records.

## 8.2 Books

### Features

- Search books through Google Books when online.
- Add books manually.
- Track reading status: want to read, currently reading, completed, or paused.
- Record start and completion dates.
- Track page progress where available.
- Rate and review books.
- Save quotations.
- Add personal notes.
- Maintain a reading history.

## 8.3 Music

### Features

- Search artists, albums, and tracks through MusicBrainz where available.
- Retrieve cover artwork through Cover Art Archive.
- Add music entries manually.
- Record listening dates.
- Save favorite tracks, albums, and artists.
- Rate and review music.
- Record meaningful listening experiences.
- Save lyrics references or personal observations without reproducing copyrighted lyrics unnecessarily.
- Organize music by genre, mood, artist, and personal tags.

This is a music-tracking and personal-archive feature, not a music-streaming service.

## 8.4 Memories and Media

### Features

- Create memory entries.
- Attach photographs and videos.
- Add captions and descriptions.
- Record the date and optional location of a memory.
- Group related media into events.
- Add tags and related entries.
- Browse memories chronologically.
- Mark important memories as favorites.

Location must be optional and manually supplied unless a future, explicitly authorized feature requires otherwise.

## 8.5 Projects and Creations

### Features

- Track personal and professional projects.
- Record project descriptions, start dates, and completion dates.
- Save repository links and other URLs.
- Track milestones.
- Record achievements and lessons learned.
- Attach screenshots and relevant documents.
- Link projects to learning records or memories.

## 8.6 Learning and Knowledge

### Features

- Save articles, tutorials, courses, and resources.
- Record skills being learned.
- Track progress and completion.
- Write notes and summaries.
- Save external links.
- Tag entries by subject.
- Link learning resources to projects.

## 8.7 Places, Travel, and Experiences

### Features

- Record trips, visits, events, restaurants, theatre visits, and other experiences.
- Save dates, descriptions, photographs, and notes.
- Store optional location details.
- Record expenses where relevant.
- Link a visit to a movie, event, person, or memory.
- Browse experiences chronologically or by location.

## 8.8 Goals and Achievements

### Features

- Create goals.
- Define target dates.
- Track progress.
- Record milestones.
- Mark achievements as completed.
- Attach evidence, notes, or related memories.
- View completed goals and historical progress.

Goals must be optional. The application must remain useful to people who only want to document their lives.

## 8.9 Personal Finance

### Features

- Record expenses and purchases manually.
- Categorize transactions.
- Store amount, currency, date, and notes.
- Track budgets.
- View spending summaries.
- Link purchases to experiences or personal entries.

No bank integration is required. Financial data must be treated as sensitive private information.

## 8.10 Ideas and Discoveries

### Features

- Quickly capture ideas.
- Record discoveries, observations, and inspirations.
- Add notes, links, and attachments.
- Tag ideas.
- Link ideas to projects and other entries.
- Search and revisit saved ideas.

## 8.11 People and Conversations

### Features

- Maintain private notes about meaningful conversations or interactions.
- Link entries to manually created person records.
- Record dates and relevant context.
- Search related interactions.
- Keep these records private to the account.

The application must not import contacts automatically or expose person records publicly.

## 8.12 Custom Categories

Users should be able to create custom categories with:

- Name.
- Icon.
- Accent color.
- Optional description.
- Custom fields.
- Optional default entry template.

Custom categories must use the same underlying entry, search, timeline, and collection infrastructure.

---

# 9. Unified Timeline

The Timeline is one of the application's central features.

## 9.1 Requirements

- Display entries from all categories in chronological order.
- Sort using event date, not creation date, by default.
- Offer newest-first and oldest-first sorting.
- Support daily, weekly, monthly, and yearly navigation.
- Group entries by date.
- Display category icons and relevant thumbnails.
- Open entries directly.
- Support filters by category, tag, date range, favorites, and collections.
- Support pagination or incremental loading for large archives.
- Show appropriate empty and offline states.

## 9.2 Date Handling

- Support dates without times.
- Handle time zones consistently.
- Preserve user-selected historical dates.
- Avoid shifting date-only entries due to UTC conversions.
- Support editing event dates without changing the original creation timestamp.

---

# 10. Calendar

The calendar provides a date-oriented view of the archive.

### Features

- Monthly calendar view.
- Navigate between months and years.
- Indicate dates containing entries.
- View entries for a selected date.
- Filter calendar entries by category.
- Jump to a specific date.
- Create a new entry for a selected date.
- Show birthdays, goals, and reminders only where the user has created or configured them.

The calendar must use actual stored data and work offline.

---

# 11. Search, Filters, and Collections

## 11.1 Global Search

Search across:

- Entry titles.
- Descriptions and personal notes.
- Tags.
- Categories.
- Supported catalogue metadata.
- Collection names.

Search must work on locally available data when offline.

## 11.2 Filters

Provide relevant combinations of:

- Category.
- Date range.
- Tags.
- Rating.
- Favorites.
- Archived status.
- Reading or watching status.
- Completion status.
- Collections.

Category-specific filters must appear only where applicable.

## 11.3 Collections

Users must be able to create named collections containing entries from multiple categories.

Examples include:

- Favorite Films.
- 2026 Memories.
- Books That Changed Me.
- Chennai Theatre Visits.
- Personal Milestones.
- Projects to Remember.

Collections should support descriptions, cover artwork, sorting, and manual ordering where practical.

Collections are organizational tools, not public-sharing features.

---

# 12. Rewind and Personal Statistics

Rewind helps users revisit their history using deterministic calculations over stored data.

No AI-generated summaries are required.

## 12.1 On This Day

Display entries from the same calendar date in previous years.

## 12.2 Monthly Rewind

Provide a monthly overview containing:

- Total entries created or recorded during the month.
- Category distribution.
- Movies and books tracked.
- Memories recorded.
- Goals completed.
- Notable dates and pinned entries.
- Personal highlights selected by the user.

## 12.3 Year in Frames

Generate a yearly recap containing:

- Total entries by category.
- Movies watched and books completed.
- Music entries recorded.
- Memories and experiences.
- Projects and achievements.
- Goal progress.
- Most-used tags.
- Favorite or highest-rated items.
- A chronological list of important events.
- Optional user-selected highlights.

All statistics must be calculated from real data. The application must not invent events, infer sensitive personal characteristics, or present missing data as facts.

## 12.4 Life Chapters

Allow users to organize entries into manually defined periods, such as a college year, a project, a trip, or a personal milestone.

Each chapter can include a title, date range, description, cover, and related entries.

---

# 13. Authentication and Account Management

The application should support a private user account for cloud synchronization.

## 13.1 Authentication

- Registration.
- Login.
- Logout.
- Secure password storage using Argon2id.
- Access tokens with short lifetimes.
- Rotating refresh tokens.
- Session revocation.
- Password reset through a secure verification flow.
- Server-side authorization on every protected resource.

Authentication must be implemented through the application's backend, not Firebase.

## 13.2 Account Settings

- Profile and display preferences.
- Theme preferences.
- Default timeline sorting.
- Date and time settings.
- Sync status.
- Storage usage.
- Data export.
- Account deletion.
- Session management.

Users must be able to use the local application before signing in where practical. Cloud synchronization requires an authenticated account.

---

# 14. Offline-First Architecture

Offline support is a core requirement, not an optional enhancement.

## 14.1 Offline Capabilities

Users must be able to:

- Open the application after it has been installed and loaded.
- Browse previously saved entries.
- Create manual entries.
- Edit entries.
- Delete entries.
- Add and remove tags.
- Organize locally stored collections.
- Browse the timeline and calendar.
- Search locally available records.
- View locally cached catalogue metadata and downloaded media.
- View statistics based on locally available data.

Features requiring new catalogue lookups, cloud authentication, cloud synchronization, or remote media uploads may require internet access.

## 14.2 Synchronization Queue

Each local change must be recorded in a durable queue containing the record identifier, operation, modification timestamp, and synchronization state.

The synchronization system must:

1. Detect connectivity when possible.
2. Retry pending changes safely.
3. Avoid creating duplicate records.
4. Handle temporary server failures.
5. preserve unsynchronized user data.
6. Apply server changes to the local store.
7. Handle deletions through tombstones.
8. Display useful sync status.
9. Resolve conflicts using documented rules.

Last-write-wins may be used for selected simple fields, but the system must avoid silently overwriting meaningful concurrent edits. Where necessary, preserve conflicting versions for user resolution.

## 14.3 Offline Media

- Metadata and text entries must remain usable offline.
- Locally selected media must remain available until upload succeeds, subject to device storage and permission constraints.
- Failed uploads must be retryable.
- Uploads must not silently delete the original local file.
- The UI must distinguish local media from successfully synchronized cloud media.

## 14.4 Data Migration

The storage layer must support versioned migrations so future application updates do not corrupt existing local records.

---

# 15. Backend and API Architecture

## 15.1 REST API

Build a versioned REST API using Node.js, Express, and TypeScript.

The API should include endpoints for:

- Authentication and sessions.
- User settings.
- Entries and category-specific metadata.
- Tags.
- Collections.
- Related-entry relationships.
- Media upload authorization and metadata.
- Synchronization changes.
- Statistics and rewind data where server computation is appropriate.
- Data export and account deletion.

Use a consistent response structure, input validation, appropriate HTTP status codes, and centralized error handling.

## 15.2 Database Design

Use PostgreSQL with Prisma.

Core entities should include:

- User.
- Session or refresh-token record.
- Entry.
- Category.
- Tag.
- Entry-tag relationship.
- Collection.
- Collection-entry relationship.
- Related-entry relationship.
- Media attachment.
- Sync metadata or change records where required.
- User preferences.
- Goal and goal milestone records.
- Financial records and budgets.
- Custom category definitions and fields.

Specialized metadata may be modeled using typed relational tables, structured JSON fields, or a combination, depending on query and validation requirements.

The schema must support multiple categories without creating an entirely separate system for each one.

Every user-owned resource must have explicit ownership checks. Database indexes should support timeline queries, search, date filtering, and synchronization.

## 15.3 Media Uploads

Media should be uploaded directly to private Cloudflare R2 storage using short-lived signed upload URLs issued by the backend.

The backend must verify file metadata, size limits, ownership, and permitted file types. Media retrieval must be authorized.

## 15.4 API Security

- Validate and sanitize input.
- Use parameterized database access through Prisma.
- Apply rate limits to sensitive endpoints.
- Protect authentication and password-reset routes.
- Never expose secrets in frontend code.
- Store credentials in environment variables or a suitable secrets manager.
- Apply secure CORS configuration.
- Avoid logging passwords, tokens, or private notes.
- Use HTTPS in production.
- Enforce user ownership on every protected request.

---

# 16. External Catalogue Integrations

External APIs provide catalogue metadata; they do not replace the application's own database.

## 16.1 TMDB

Used for movie and television search, posters, show metadata, seasons, episodes, genres, and related catalogue information.

The integration must handle attribution, API configuration, rate limits, unavailable results, and caching.

TMDB's applicable licensing and commercial-use requirements must be reviewed before public release or monetization.

## 16.2 Google Books

Used for book search and available metadata such as titles, authors, publication details, identifiers, and cover images.

Handle quota limits, incomplete metadata, missing covers, and manual entry.

## 16.3 MusicBrainz and Cover Art Archive

Used for artist, album, and track metadata and available cover artwork.

Respect MusicBrainz rate limits and its requirement for an identifiable, descriptive User-Agent. Cache results appropriately.

## 16.4 Integration Rules

- Catalogue lookup must not be mandatory for manual entry.
- API failures must not block saving a personal record.
- Cache permitted catalogue responses.
- Keep personal ratings, reviews, dates, and notes separate from external metadata.
- Allow users to correct or supplement catalogue information.
- Review the licensing and attribution terms of every integration before publication.

---

# 17. Privacy and Security

Life in Frames stores a potentially sensitive record of a person's interests, memories, relationships, finances, and activities.

Privacy must be a core design requirement.

## 17.1 Privacy Principles

- Private by default.
- No public profiles.
- No social feed.
- No advertising or analytics SDKs without a separately reviewed need and disclosure.
- No AI processing.
- No unnecessary collection of personal data.
- No automatic contact imports.
- No continuous location tracking.
- No third-party access to personal notes without authorization.

## 17.2 Data Protection

- Use HTTPS for network traffic.
- Securely store authentication credentials and tokens.
- Restrict access to local and cloud data.
- Keep R2 objects private.
- Encrypt backups and protect backup keys.
- Apply least-privilege access controls.
- Ensure one user cannot access another user's data.
- Provide data export and account deletion.
- Define retention and deletion behavior for backups and media.
- Avoid storing secrets in source control or frontend bundles.

Local database encryption should be implemented if the chosen storage solution and threat model support it reliably.

## 17.3 Privacy Documentation

Before release, provide an accurate privacy policy and Google Play Data Safety disclosures covering actual data collection, storage, sharing, retention, and deletion practices.

Do not claim that data is never shared or collected unless the implemented application and its dependencies support that claim.

---

# 18. Backup, Export, and Recovery

Users must have control over their personal archive.

## 18.1 Export

Provide an export flow that can produce a documented, machine-readable archive of personal records, including relevant metadata, tags, relationships, and collection membership.

Where practical, provide a media manifest and associated attachments.

## 18.2 Backup

- Back up cloud database data securely.
- Define a restoration procedure.
- Protect backup credentials and encryption keys.
- Test restoration, not merely backup creation.
- Clearly communicate the distinction between cloud backups and data stored only on the device.

## 18.3 Account Deletion

Deleting an account must initiate deletion of its cloud records and associated media according to the documented retention policy.

The user must be informed of what will be deleted, what may remain temporarily in backups, and whether local copies require a separate action.

---

# 19. Performance and Reliability

The application should remain responsive as the archive grows.

Requirements:

- Paginated or incrementally loaded timeline entries.
- Indexed database queries.
- Debounced search where appropriate.
- Image resizing and thumbnails for efficient display.
- Lazy loading of nonessential content.
- Caching of permitted catalogue metadata.
- Graceful handling of network errors.
- Recovery from interrupted uploads and sync operations.
- Accessible loading and error states.
- No loss of pending local changes when the application closes unexpectedly.

Measure performance on real Android devices, including lower-powered devices.

---

# 20. Testing Strategy

## 20.1 Frontend Tests

Test:

- Shared components.
- Entry forms and validation.
- Navigation.
- Timeline sorting and filtering.
- Search.
- Collections.
- Responsive layouts.
- Loading, error, and empty states.

## 20.2 Backend Tests

Test:

- Registration and login.
- Authentication and authorization.
- CRUD operations.
- User ownership isolation.
- Database constraints.
- Media authorization.
- Synchronization and conflict handling.
- Export and deletion.

## 20.3 Offline Tests

Test scenarios including:

- Creating an entry while offline.
- Closing and reopening the application.
- Editing an unsynchronized record.
- Reconnecting to the internet.
- Retrying a failed upload.
- Handling duplicate synchronization attempts.
- Handling changes made on two devices.
- Recovering from interrupted synchronization.

## 20.4 Device and Browser Tests

Test:

- Android Chrome.
- The packaged Android application.
- Small and large phone screens.
- Tablets.
- Desktop browsers.
- Keyboard navigation and accessibility.
- App restarts, upgrades, and local database migrations.

---

# 21. Google Play Store Release

The application must ultimately be distributed through Google Play Store.

## 21.1 Release Preparation

- Package the React production build using Capacitor.
- Configure the Android application ID, app name, icon, and splash screen.
- Configure permissions only when needed.
- Generate a signed Android App Bundle.
- Configure signing and protect the signing credentials.
- Test release builds on physical devices.
- Set up internal testing before wider release.
- Prepare screenshots, store description, feature graphic, and other required assets.
- Publish a valid privacy policy.
- Complete the applicable Data Safety and content declarations.
- Verify external API licensing and attribution.
- Review current Play Store target API, testing, and submission requirements.

## 21.2 Release Quality

Before publication, confirm:

- No critical crashes.
- Core functionality works offline.
- User data survives restarts.
- Authentication and synchronization work correctly.
- Private data cannot be accessed by other accounts.
- Account deletion and export work.
- The app behaves correctly on supported screen sizes.
- The store listing accurately describes the application.

Capacitor packaging alone does not guarantee Play Store approval. The completed app must satisfy the current Google Play policies.

---

# 22. Development Roadmap

Build the application incrementally using small, verifiable development tasks.

## Phase 1 — Project Foundation

- Create the React + Vite + TypeScript project.
- Configure Tailwind CSS.
- Establish the shared design system.
- Create responsive navigation.
- Set up reusable layout components.
- Add routing and error handling.
- Verify desktop and mobile rendering.

## Phase 2 — Core Interface

- Build Home.
- Build the universal entry creation form.
- Build the entry detail view.
- Build editing and deletion.
- Build reusable cards, forms, and empty states.

## Phase 3 — Local Data

- Implement IndexedDB persistence.
- Add schema versioning and migrations.
- Implement offline CRUD.
- Implement local search and filtering.
- Verify data survives restarts.

## Phase 4 — Timeline and Calendar

- Build the unified timeline.
- Add chronological sorting.
- Add date navigation.
- Build the calendar.
- Add category and date filters.

## Phase 5 — Specialized Categories

- Movies and television.
- Books.
- Music.
- Memories and media.
- Projects and creations.
- Learning and knowledge.
- Places and experiences.
- Goals and achievements.
- Personal finance.
- Ideas and discoveries.
- People and conversations.
- Custom categories.

## Phase 6 — Search and Organization

- Global search.
- Tags.
- Collections.
- Related entries.
- Favorites, pins, and archive.
- Category-specific filters.

## Phase 7 — Rewind and Statistics

- On This Day.
- Monthly rewind.
- Year in Frames.
- Life Chapters.
- Category and activity statistics.

## Phase 8 — Backend and Cloud Storage

- Set up PostgreSQL.
- Configure Prisma and migrations.
- Implement authentication.
- Build the REST API.
- Add media uploads to private R2 storage.
- Connect frontend records to the backend.

## Phase 9 — Offline Synchronization

- Build the sync queue.
- Add retry and idempotency.
- Implement conflict handling.
- Add sync status and error recovery.
- Test multiple-device synchronization.

## Phase 10 — External Integrations

- TMDB.
- Google Books.
- MusicBrainz.
- Cover Art Archive.
- Caching, manual fallbacks, and attribution.

## Phase 11 — Security and Reliability

- Authorization review.
- Privacy and security tests.
- Export and account deletion.
- Backup and restoration tests.
- Performance testing.
- Device compatibility testing.

## Phase 12 — Android and Play Store

- Configure Capacitor Android.
- Test native packaging.
- Configure signing.
- Generate the AAB.
- Complete internal testing.
- Prepare store assets and disclosures.
- Submit for review.

---

# 23. Definition of Done

A feature is not complete merely because its screen looks correct.

A feature is complete when:

1. Its interface is responsive.
2. Its data model is defined where applicable.
3. Its behavior works with real data.
4. Validation and error states are implemented.
5. Offline behavior is supported where required.
6. Data persists correctly.
7. Authorization is enforced for protected server operations.
8. Loading and empty states are handled.
9. Relevant tests pass.
10. Existing functionality is not broken.

Do not substitute hardcoded sample data for a functioning feature unless the task explicitly requests a temporary UI prototype.

---

# 24. Development Rules for AI Coding Tools

The application will be developed incrementally using an AI coding assistant.

Follow these rules throughout implementation:

1. Use the PRD as the source of truth.
2. Build a standard React + Vite + TypeScript web application.
3. Do not use Expo or React Native.
4. Keep the application responsive from the beginning.
5. Do not introduce Firebase or AI services.
6. Do not build the entire product in one prompt.
7. Make one focused change at a time.
8. Inspect the existing project before changing files.
9. Reuse established components and patterns.
10. Do not overwrite working functionality unnecessarily.
11. Run the appropriate build or tests after each meaningful change.
12. Report changed files, completed work, test results, and remaining issues.
13. Never expose API secrets in frontend code.
14. Do not mark incomplete features as finished.
15. Keep frontend, local persistence, backend, and external integrations separated cleanly.
16. Preserve the option to package the web application through Capacitor without rewriting the frontend.

---

# 25. Product Success Criteria

Life in Frames is successful when a user can maintain a reliable personal archive across categories without needing a separate application for every interest.

The core success criteria are:

- Fast and intuitive manual entry.
- Reliable offline access.
- A genuinely useful unified timeline.
- Accurate search and personal statistics.
- Smooth category-specific workflows.
- Secure synchronization and media storage.
- A polished mobile experience.
- Data portability and account control.
- Successful Android packaging and Google Play publication.

**Final product direction:** Life in Frames is a privacy-first, offline-capable, responsive React application, supported by a dedicated backend and packaged for Android using Capacitor. Its purpose is to help users preserve and revisit their lives through a single, unified personal archive.
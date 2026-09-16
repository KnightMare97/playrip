# Personal Music Library — Complete Technical Specification & Implementation Blueprint

**Version:** 1.0.0  
**Status:** Approved Architecture & Implementation Blueprint  
**Target Recurring Cost:** $0.00 / month  
**Infrastructure Stack:** Cloudflare Workers + Cloudflare D1 + Cloudflare Queues + Cloudflare R2 + Oracle Cloud Always Free (Ampere A1) Processor + Telegram Bot API

---

## 1. Executive Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │            INTERNET             │
                      └────────────────┬────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   │                                       │
            [Web Application]                     [Telegram Bot API]
         (React 19 + Tailwind CSS)                 (Webhook Endpoint)
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │      CLOUDFLARE WORKERS       │
                       │    (API Core & Controller)    │
                       └───────┬───────────────┬───────┘
                               │               │
            ┌──────────────────┼───────────────┼──────────────────┐
            ▼                  ▼               ▼                  ▼
     ┌─────────────┐    ┌─────────────┐ ┌─────────────┐    ┌─────────────┐
     │  Cloudflare │    │  Cloudflare │ │  Cloudflare │    │ MusicBrainz │
     │     D1      │    │   Queues    │ │     R2      │    │  & CAA API  │
     │  (Database) │    │  (Dispatch) │ │  (Storage)  │    │  (Catalog)  │
     └─────────────┘    └──────┬──────┘ └─────────────┘    └─────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  ORACLE ALWAYS FREE │
                    │   (Pull Processor)  │
                    │   yt-dlp + ffmpeg   │
                    │   id3 tagger        │
                    └─────────────────────┘
```

---

## 2. Core Architecture Decisions & Invariants

1. **Strict $0/month Cost Model:** Utilizing only free-tier allowances (Cloudflare Workers, D1, R2 10GB standard storage, Queues free tier, Oracle Cloud Always Free 2 OCPU / 12GB RAM).
2. **Decoupled Catalog vs. Media Provider:**
   - Catalog queries, releases, and canonical tracks strictly originate from **MusicBrainz** and **Cover Art Archive**.
   - Media acquisition (e.g. YouTube via `yt-dlp`) occurs only when a job is scheduled and uses a dedicated Matching Engine.
3. **Permanent Library vs. Ephemeral Packages:**
   - **Permanent Library (`library/` in R2):** Canonical MP3 files (capped at source fidelity up to 320 kbps) with embedded ID3v2 tags and cover art. **Zero automatic deletion**.
   - **Packages (`packages/` in R2):** Temporary ZIP archives created on-demand with an automated expiration (48 hours). Deleting expired packages never impacts underlying library files.
4. **Pull-Based Worker ↔ Processor Coordination:**
   - The Oracle processor maintains no inbound public listening ports.
   - The processor periodically polls an authenticated Worker endpoint (`POST /api/processor/claim-job`) with a signed worker secret token, heartbeats every 30 seconds (`POST /api/processor/heartbeat`), and reports task completion.
5. **Storage Guardrails:**
   - Total Quota: 10.0 GB.
   - Warning threshold at 80% (8.0 GB).
   - Critical hard block on new acquisition jobs at 95% (9.5 GB).
   - Manual storage management view highlighting largest artists, albums, and tracks for user-directed deletion.

---

## 3. Database Schema (Cloudflare D1 / SQLite DDL)

```sql
-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS telegram_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    telegram_chat_id INTEGER NOT NULL UNIQUE,
    telegram_username TEXT,
    link_code TEXT,
    code_expires_at INTEGER,
    is_verified INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- 2. Music Catalog (MusicBrainz Mirror / Cache)
CREATE TABLE IF NOT EXISTS artists (
    mbid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_name TEXT,
    disambiguation TEXT,
    country TEXT,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS release_groups (
    mbid TEXT PRIMARY KEY,
    artist_mbid TEXT NOT NULL REFERENCES artists(mbid),
    title TEXT NOT NULL,
    primary_type TEXT,
    first_release_date TEXT,
    cover_art_url TEXT,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS releases (
    mbid TEXT PRIMARY KEY,
    release_group_mbid TEXT NOT NULL REFERENCES release_groups(mbid),
    title TEXT NOT NULL,
    status TEXT,
    date TEXT,
    country TEXT,
    track_count INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recordings (
    mbid TEXT PRIMARY KEY,
    artist_mbid TEXT NOT NULL REFERENCES artists(mbid),
    title TEXT NOT NULL,
    duration_ms INTEGER,
    disambiguation TEXT,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS release_tracks (
    id TEXT PRIMARY KEY,
    release_mbid TEXT NOT NULL REFERENCES releases(mbid),
    recording_mbid TEXT NOT NULL REFERENCES recordings(mbid),
    position INTEGER NOT NULL,
    medium_position INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    duration_ms INTEGER
);

-- 3. Source Match Cache (MusicBrainz Recording -> Source ID)
CREATE TABLE IF NOT EXISTS source_matches (
    recording_mbid TEXT PRIMARY KEY REFERENCES recordings(mbid),
    provider TEXT NOT NULL, -- e.g. 'youtube'
    source_id TEXT NOT NULL, -- e.g. YouTube Video ID
    source_title TEXT NOT NULL,
    source_duration_ms INTEGER NOT NULL,
    confidence_score REAL NOT NULL,
    is_user_verified INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- 4. Permanent Library
CREATE TABLE IF NOT EXISTS library_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    recording_mbid TEXT NOT NULL REFERENCES recordings(mbid),
    release_group_mbid TEXT REFERENCES release_groups(mbid),
    release_mbid TEXT REFERENCES releases(mbid),
    r2_object_key TEXT NOT NULL UNIQUE,
    file_size_bytes INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    bitrate_kbps INTEGER NOT NULL,
    format TEXT DEFAULT 'mp3',
    processing_profile TEXT DEFAULT 'mp3-v1',
    created_at INTEGER NOT NULL
);

-- 5. Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('artist', 'album', 'track')),
    entity_mbid TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE(user_id, entity_type, entity_mbid)
);

-- 6. Jobs, Tasks & Attempts
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    origin TEXT NOT NULL CHECK(origin IN ('web', 'telegram')),
    status TEXT NOT NULL CHECK(status IN ('CREATED', 'QUEUED', 'CLAIMED', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL', 'CANCELLED')),
    total_tracks INTEGER NOT NULL,
    completed_tracks INTEGER DEFAULT 0,
    failed_tracks INTEGER DEFAULT 0,
    claimed_by TEXT, -- processor node ID
    claim_token TEXT,
    claimed_at INTEGER,
    last_heartbeat INTEGER,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
);

CREATE TABLE IF NOT EXISTS job_tasks (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    recording_mbid TEXT NOT NULL REFERENCES recordings(mbid),
    release_mbid TEXT REFERENCES releases(mbid),
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'MATCHING', 'DOWNLOADING', 'PROCESSING', 'TAGGING', 'UPLOADING', 'COMPLETED', 'FAILED', 'SKIPPED')),
    source_id TEXT,
    error_message TEXT,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
);

-- 7. Packages (Temporary Export ZIPs)
CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    job_id TEXT REFERENCES jobs(id),
    title TEXT NOT NULL,
    r2_object_key TEXT NOT NULL UNIQUE,
    file_size_bytes INTEGER NOT NULL,
    track_count INTEGER NOT NULL,
    download_count INTEGER DEFAULT 0,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
```

---

## 4. Job Lifecycle & State Transitions

```
  [User requests Download (Web / Telegram)]
                    │
                    ▼
               ┌─────────┐
               │ CREATED │ ── (Storage check: if > 95% -> REJECT)
               └────┬────┘
                    │
                    ▼
               ┌─────────┐
               │ QUEUED  │ <─────────────────────┐
               └────┬────┘                       │
                    │ (Processor claims job)     │ (Heartbeat lost > 90s)
                    ▼                            │
               ┌─────────┐                       │
               │ CLAIMED │ ──────────────────────┤
               └────┬────┘                       │
                    │ (Processor starts task)    │
                    ▼                            │
             ┌────────────┐                      │
             │ PROCESSING │ ─────────────────────┘
             └──────┬─────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 (All tracks ok)         (Some failed / skipped)
 ┌───────────┐           ┌─────────┐
 │ COMPLETED │           │ PARTIAL │
 └─────┬─────┘           └────┬────┘
       │                      │
       └──────────┬───────────┘
                  ▼
          ┌──────────────┐
          │ ZIP PACKAGE  │ ── (Expires in 48h, auto-deleted)
          └──────────────┘
```

---

## 5. Processor ↔ Cloudflare API Protocol

1. **Claim Job:**
   - `POST /api/processor/claim-job`
   - Headers: `Authorization: Bearer <PROCESSOR_SECRET>`
   - Response:
     ```json
     {
       "job_id": "job_12345",
       "claim_token": "token_abc",
       "tasks": [
         {
           "task_id": "task_1",
           "recording_mbid": "mbid_1",
           "artist": "Black Sabbath",
           "album": "Paranoid",
           "track": "Iron Man",
           "track_number": 4,
           "year": "1970",
           "genre": "Heavy Metal",
           "cover_art_url": "https://coverartarchive.org/...",
           "known_source_id": "5s7_Wbi474E"
         }
       ]
     }
     ```
2. **Heartbeat:**
   - `POST /api/processor/heartbeat`
   - Payload: `{ "job_id": "...", "claim_token": "...", "node_id": "oracle-arm-01" }`
3. **Task Completion:**
   - `POST /api/processor/complete-task`
   - Payload includes upload confirmation, file size, bitrate, and duration.

---

## 6. R2 Storage Key Hierarchy

```
library/
  artists/{artist_mbid}/
    albums/{release_group_mbid}/
      {track_number:02d} - {sanitized_title}_{recording_mbid}.mp3

covers/
  {release_group_mbid}/front.jpg

packages/
  {user_id}/{package_id}/{sanitized_album_or_batch_title}.zip
```

---

## 7. Telegram Bot Commands & Interactions

- `/start`: Welcome message, library statistics, help.
- `/search <query>`: Universal search with inline buttons (Artist / Album / Track).
- `/link <code>`: Link Telegram account using 6-digit one-time code generated from Web Settings.
- `/library`: Browse saved artists and albums.
- `/queue`: Live status of ongoing processing jobs with dynamic progress bar.
- `/storage`: Check R2 storage usage (GB and percentage) with threshold warnings.
- Callback Queries: Interactive multi-selection, album downloading, and ZIP link generation.

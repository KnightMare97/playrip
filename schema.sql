-- Cloudflare D1 Database Schema for Personal Music Library
-- Run with: npx wrangler d1 execute <DB_NAME> --file=./schema.sql

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
    provider TEXT NOT NULL,
    source_id TEXT NOT NULL,
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
    claimed_by TEXT,
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

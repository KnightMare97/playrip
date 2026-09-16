/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavigationTab = 
  | 'search' 
  | 'library' 
  | 'bookmarks' 
  | 'queue' 
  | 'history' 
  | 'storage' 
  | 'settings';

export interface Artist {
  mbid: string;
  name: string;
  country?: string;
  disambiguation?: string;
  type?: string;
  albumsCount?: number;
}

export interface Track {
  mbid: string;
  title: string;
  durationMs: number;
  position: number;
  artistName: string;
  artistMbid?: string;
  albumTitle?: string;
  albumMbid?: string;
  coverUrl?: string;
  audioUrl?: string; // Preview/demo stream
  inLibrary?: boolean;
}

export interface Album {
  mbid: string; // Release group MBID
  title: string;
  artistName: string;
  artistMbid: string;
  firstReleaseDate: string;
  primaryType: string;
  coverArtUrl?: string;
  trackCount: number;
  tracks?: Track[];
  inLibrary?: boolean;
}

export interface SelectedItem {
  id: string; // Unique key e.g. "track:mbid" or "album:mbid"
  type: 'album' | 'track';
  title: string;
  artist: string;
  coverUrl?: string;
  durationMs?: number;
  albumTitle?: string;
  albumMbid?: string;
  trackMbid?: string;
}

export type TaskStatus = 
  | 'PENDING'
  | 'MATCHING'
  | 'DOWNLOADING'
  | 'PROCESSING'
  | 'TAGGING'
  | 'UPLOADING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export interface JobTask {
  id: string;
  recordingMbid: string;
  trackTitle: string;
  artistName: string;
  albumTitle: string;
  status: TaskStatus;
  progressPercent: number; // 0 - 100
  sourceCandidate?: string;
  bitrateKbps?: number;
  fileSizeBytes?: number;
  error?: string;
}

export type JobStatus = 
  | 'CREATED'
  | 'QUEUED'
  | 'CLAIMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'PARTIAL'
  | 'CANCELLED';

export interface Job {
  id: string;
  origin: 'web' | 'telegram';
  title: string;
  status: JobStatus;
  totalTracks: number;
  completedTracks: number;
  failedTracks: number;
  claimedBy?: string;
  createdAt: number;
  completedAt?: number;
  tasks: JobTask[];
  generatedPackageId?: string;
}

export interface Package {
  id: string;
  jobId?: string;
  title: string;
  r2ObjectKey: string;
  fileSizeBytes: number;
  trackCount: number;
  expiresAt: number; // Timestamp (48 hours)
  createdAt: number;
  downloadCount: number;
}

export interface LibraryItem {
  id: string;
  recordingMbid: string;
  title: string;
  artist: string;
  artistMbid: string;
  album: string;
  albumMbid: string;
  durationMs: number;
  bitrateKbps: number;
  fileSizeBytes: number;
  coverArtUrl?: string;
  audioUrl?: string;
  year?: string;
  genre?: string;
  trackNumber: number;
  addedAt: number;
}

export interface Bookmark {
  id: string;
  entityType: 'artist' | 'album' | 'track';
  entityMbid: string;
  title: string;
  subtitle: string;
  coverUrl?: string;
  createdAt: number;
}

export interface StorageStats {
  totalBytes: number;
  maxBytes: number; // 10 GB = 10,737,418,240 bytes
  libraryBytes: number;
  packagesBytes: number;
  warningThresholdBytes: number; // 8.0 GB
  criticalThresholdBytes: number; // 9.5 GB
}

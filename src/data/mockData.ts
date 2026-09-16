/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LibraryItem, Package, Job, Bookmark, StorageStats } from '../types';

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib_1',
    recordingMbid: 'rec-bs-01',
    title: 'War Pigs / Luke’s Wall',
    artist: 'Black Sabbath',
    artistMbid: 'art-bs',
    album: 'Paranoid',
    albumMbid: 'rg-bs-paranoid',
    durationMs: 474000,
    bitrateKbps: 320,
    fileSizeBytes: 18960000,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1970',
    genre: 'Heavy Metal',
    trackNumber: 1,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'lib_2',
    recordingMbid: 'rec-bs-02',
    title: 'Paranoid',
    artist: 'Black Sabbath',
    artistMbid: 'art-bs',
    album: 'Paranoid',
    albumMbid: 'rg-bs-paranoid',
    durationMs: 172000,
    bitrateKbps: 320,
    fileSizeBytes: 6880000,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1970',
    genre: 'Heavy Metal',
    trackNumber: 2,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'lib_3',
    recordingMbid: 'rec-bs-03',
    title: 'Planet Caravan',
    artist: 'Black Sabbath',
    artistMbid: 'art-bs',
    album: 'Paranoid',
    albumMbid: 'rg-bs-paranoid',
    durationMs: 270000,
    bitrateKbps: 320,
    fileSizeBytes: 10800000,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1970',
    genre: 'Heavy Metal',
    trackNumber: 3,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'lib_4',
    recordingMbid: 'rec-bs-04',
    title: 'Iron Man',
    artist: 'Black Sabbath',
    artistMbid: 'art-bs',
    album: 'Paranoid',
    albumMbid: 'rg-bs-paranoid',
    durationMs: 356000,
    bitrateKbps: 320,
    fileSizeBytes: 14240000,
    coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1970',
    genre: 'Heavy Metal',
    trackNumber: 4,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'lib_5',
    recordingMbid: 'rec-pf-01',
    title: 'Time',
    artist: 'Pink Floyd',
    artistMbid: 'art-pf',
    album: 'The Dark Side of the Moon',
    albumMbid: 'rg-pf-dsotm',
    durationMs: 425000,
    bitrateKbps: 320,
    fileSizeBytes: 17000000,
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1973',
    genre: 'Progressive Rock',
    trackNumber: 4,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'lib_6',
    recordingMbid: 'rec-pf-02',
    title: 'Money',
    artist: 'Pink Floyd',
    artistMbid: 'art-pf',
    album: 'The Dark Side of the Moon',
    albumMbid: 'rg-pf-dsotm',
    durationMs: 382000,
    bitrateKbps: 320,
    fileSizeBytes: 15280000,
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    year: '1973',
    genre: 'Progressive Rock',
    trackNumber: 6,
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg_1',
    jobId: 'job_hist_1',
    title: 'Black Sabbath - Paranoid [Complete Album]',
    r2ObjectKey: 'packages/user_1/pkg_1/Black_Sabbath_-_Paranoid.zip',
    fileSizeBytes: 50880000,
    trackCount: 4,
    expiresAt: Date.now() + 1000 * 60 * 60 * 38, // 38 hours remaining
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    downloadCount: 2,
  },
  {
    id: 'pkg_2',
    jobId: 'job_hist_2',
    title: 'Pink Floyd - Dark Side of the Moon [Selected]',
    r2ObjectKey: 'packages/user_1/pkg_2/Pink_Floyd_-_DSOTM_Selection.zip',
    fileSizeBytes: 32280000,
    trackCount: 2,
    expiresAt: Date.now() + 1000 * 60 * 60 * 14, // 14 hours remaining
    createdAt: Date.now() - 1000 * 60 * 60 * 34,
    downloadCount: 1,
  }
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm_1',
    entityType: 'album',
    entityMbid: 'rg-bs-paranoid',
    title: 'Paranoid',
    subtitle: 'Black Sabbath (1970)',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'bm_2',
    entityType: 'artist',
    entityMbid: 'art-pf',
    title: 'Pink Floyd',
    subtitle: 'United Kingdom • Progressive Rock',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
  }
];

export const INITIAL_HISTORY_JOBS: Job[] = [
  {
    id: 'job_hist_1',
    origin: 'web',
    title: 'Black Sabbath — Paranoid (4 tracks)',
    status: 'COMPLETED',
    totalTracks: 4,
    completedTracks: 4,
    failedTracks: 0,
    claimedBy: 'oracle-ampere-01',
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    completedAt: Date.now() - 1000 * 60 * 60 * 10 + 45000,
    generatedPackageId: 'pkg_1',
    tasks: [
      {
        id: 't_1',
        recordingMbid: 'rec-bs-01',
        trackTitle: 'War Pigs',
        artistName: 'Black Sabbath',
        albumTitle: 'Paranoid',
        status: 'COMPLETED',
        progressPercent: 100,
        bitrateKbps: 320,
        fileSizeBytes: 18960000,
        sourceCandidate: 'yt:5s7_Wbi474E',
      },
      {
        id: 't_2',
        recordingMbid: 'rec-bs-02',
        trackTitle: 'Paranoid',
        artistName: 'Black Sabbath',
        albumTitle: 'Paranoid',
        status: 'COMPLETED',
        progressPercent: 100,
        bitrateKbps: 320,
        fileSizeBytes: 6880000,
        sourceCandidate: 'yt:0qanF-91aJo',
      },
      {
        id: 't_3',
        recordingMbid: 'rec-bs-03',
        trackTitle: 'Planet Caravan',
        artistName: 'Black Sabbath',
        albumTitle: 'Paranoid',
        status: 'COMPLETED',
        progressPercent: 100,
        bitrateKbps: 320,
        fileSizeBytes: 10800000,
        sourceCandidate: 'yt:r5Z87KjV4v8',
      },
      {
        id: 't_4',
        recordingMbid: 'rec-bs-04',
        trackTitle: 'Iron Man',
        artistName: 'Black Sabbath',
        albumTitle: 'Paranoid',
        status: 'COMPLETED',
        progressPercent: 100,
        bitrateKbps: 320,
        fileSizeBytes: 14240000,
        sourceCandidate: 'yt:9LjbMVXjJJs',
      }
    ]
  }
];

export const INITIAL_STORAGE: StorageStats = {
  totalBytes: 83160000 + 83160000, // ~166 MB initial demo
  maxBytes: 10 * 1024 * 1024 * 1024, // 10 GB
  libraryBytes: 83160000,
  packagesBytes: 83160000,
  warningThresholdBytes: 8 * 1024 * 1024 * 1024, // 8.0 GB (80%)
  criticalThresholdBytes: 9.5 * 1024 * 1024 * 1024, // 9.5 GB (95%)
};

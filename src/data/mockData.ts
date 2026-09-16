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

export const INITIAL_PACKAGES: Package[] = [];

export const INITIAL_BOOKMARKS: Bookmark[] = [];

export const INITIAL_HISTORY_JOBS: Job[] = [];


export const INITIAL_STORAGE: StorageStats = {
  totalBytes: 83160000 + 83160000, // ~166 MB initial demo
  maxBytes: 25 * 1024 * 1024 * 1024, // 25 GB Storj DCS Free Tier
  libraryBytes: 83160000,
  packagesBytes: 83160000,
  warningThresholdBytes: 20 * 1024 * 1024 * 1024, // 20.0 GB (80%)
  criticalThresholdBytes: 23.75 * 1024 * 1024 * 1024, // 23.75 GB (95%)
};

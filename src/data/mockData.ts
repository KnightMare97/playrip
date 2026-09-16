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
    id: 'job_hist_paranoid',
    origin: 'web',
    title: 'Paranoid',
    albumTitle: 'Paranoid',
    artistName: 'Black Sabbath',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/35/da/ac/35daac19-0b65-315f-c0ed-510031059999/mzi.sxreuckg.jpg/600x600bb.jpg',
    status: 'PROCESSING',
    totalTracks: 8,
    completedTracks: 1,
    failedTracks: 0,
    claimedBy: 'cloud-runner-01',
    createdAt: Date.now() - 1000 * 60 * 15,
    totalDurationFormatted: '41:47 total',
    activeTaskText: '1/8 · War Pigs / Luke\'s Wall',
    allTracksList: [
      { position: 1, title: 'War Pigs / Luke\'s Wall', durationFormatted: '7:54' },
      { position: 2, title: 'Paranoid', durationFormatted: '2:48' },
      { position: 3, title: 'Planet Caravan', durationFormatted: '4:29' },
      { position: 4, title: 'Iron Man', durationFormatted: '5:55' },
      { position: 5, title: 'Electric Funeral', durationFormatted: '4:50' },
      { position: 6, title: 'Hand of Doom', durationFormatted: '7:08' },
      { position: 7, title: 'Rat Salad', durationFormatted: '2:30' },
      { position: 8, title: 'Jack the Stripper / Fairies Wear Boots', durationFormatted: '6:13' },
    ],
    tasks: [
      {
        id: 't_1',
        recordingMbid: 'rec-bs-01',
        trackTitle: 'War Pigs / Luke\'s Wall',
        artistName: 'Black Sabbath',
        albumTitle: 'Paranoid',
        status: 'PROCESSING',
        progressPercent: 35,
        bitrateKbps: 320,
        fileSizeBytes: 18960000,
        sourceCandidate: 'yt:5s7_Wbi474E',
      }
    ]
  },
  {
    id: 'job_hist_getlucky',
    origin: 'web',
    title: 'Get Lucky',
    albumTitle: 'Get Lucky',
    artistName: 'Daft Punk, Pharrell Williams & Nile Rodgers',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    status: 'COMPLETED',
    totalTracks: 1,
    completedTracks: 1,
    failedTracks: 0,
    claimedBy: 'cloud-runner-01',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
    completedAt: Date.now() - 1000 * 60 * 60 * 24 * 80 + 20000,
    generatedPackageId: 'pkg_getlucky',
    totalDurationFormatted: '6:10 total',
    allTracksList: [
      { position: 1, title: 'Get Lucky', durationFormatted: '6:10' }
    ],
    tasks: [
      {
        id: 't_gl_1',
        recordingMbid: 'rec-gl-01',
        trackTitle: 'Get Lucky',
        artistName: 'Daft Punk',
        albumTitle: 'Get Lucky',
        status: 'COMPLETED',
        progressPercent: 100,
        bitrateKbps: 320,
        fileSizeBytes: 14800000,
      }
    ]
  }
];

export const INITIAL_STORAGE: StorageStats = {
  totalBytes: 83160000 + 83160000, // ~166 MB initial demo
  maxBytes: 25 * 1024 * 1024 * 1024, // 25 GB Storj DCS Free Tier
  libraryBytes: 83160000,
  packagesBytes: 83160000,
  warningThresholdBytes: 20 * 1024 * 1024 * 1024, // 20.0 GB (80%)
  criticalThresholdBytes: 23.75 * 1024 * 1024 * 1024, // 23.75 GB (95%)
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artist, Album, Track } from '../types';

const MB_BASE_URL = 'https://musicbrainz.org/ws/2';

// Pre-packaged catalog fallback for smooth instant browsing & offline resilience
const CURATED_CATALOG: { artists: Artist[]; albums: Album[]; tracks: Track[] } = {
  artists: [
    {
      mbid: 'art-bs',
      name: 'Black Sabbath',
      country: 'GB',
      disambiguation: 'English heavy metal band formed in Birmingham in 1968',
      type: 'Group',
      albumsCount: 19,
    },
    {
      mbid: 'art-pf',
      name: 'Pink Floyd',
      country: 'GB',
      disambiguation: 'English progressive rock band formed in London in 1965',
      type: 'Group',
      albumsCount: 15,
    },
    {
      mbid: 'art-lz',
      name: 'Led Zeppelin',
      country: 'GB',
      disambiguation: 'English rock band formed in London in 1968',
      type: 'Group',
      albumsCount: 9,
    },
    {
      mbid: 'art-met',
      name: 'Metallica',
      country: 'US',
      disambiguation: 'American heavy metal band formed in 1981',
      type: 'Group',
      albumsCount: 11,
    },
    {
      mbid: 'art-queen',
      name: 'Queen',
      country: 'GB',
      disambiguation: 'British rock band formed in London in 1970',
      type: 'Group',
      albumsCount: 15,
    },
    {
      mbid: 'art-eminem',
      name: 'Eminem',
      country: 'US',
      disambiguation: 'Marshall Bruce Mathers III, American rapper, songwriter, and record producer',
      type: 'Person',
      albumsCount: 12,
    }
  ],
  albums: [
    {
      mbid: 'rg-eminem-mmlp2',
      title: 'The Marshall Mathers LP2',
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      firstReleaseDate: '2013-11-05',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      trackCount: 16,
    },
    {
      mbid: 'rg-bs-paranoid',
      title: 'Paranoid',
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      firstReleaseDate: '1970-09-18',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      trackCount: 8,
    },
    {
      mbid: 'rg-bs-mor',
      title: 'Master of Reality',
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      firstReleaseDate: '1971-07-21',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      trackCount: 8,
    },
    {
      mbid: 'rg-pf-dsotm',
      title: 'The Dark Side of the Moon',
      artistName: 'Pink Floyd',
      artistMbid: 'art-pf',
      firstReleaseDate: '1973-03-01',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      trackCount: 10,
    },
    {
      mbid: 'rg-pf-animals',
      title: 'Animals',
      artistName: 'Pink Floyd',
      artistMbid: 'art-pf',
      firstReleaseDate: '1977-01-23',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
      trackCount: 5,
    },
    {
      mbid: 'rg-lz-iv',
      title: 'Led Zeppelin IV',
      artistName: 'Led Zeppelin',
      artistMbid: 'art-lz',
      firstReleaseDate: '1971-11-08',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
      trackCount: 8,
    },
    {
      mbid: 'rg-met-rtl',
      title: 'Ride the Lightning',
      artistName: 'Metallica',
      artistMbid: 'art-met',
      firstReleaseDate: '1984-07-27',
      primaryType: 'Album',
      coverArtUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
      trackCount: 8,
    }
  ],
  tracks: [
    {
      mbid: 'rec-em-01',
      title: 'Bad Guy',
      durationMs: 434000,
      position: 1,
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      albumTitle: 'The Marshall Mathers LP2',
      albumMbid: 'rg-eminem-mmlp2',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-em-03',
      title: 'Survival',
      durationMs: 272000,
      position: 3,
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      albumTitle: 'The Marshall Mathers LP2',
      albumMbid: 'rg-eminem-mmlp2',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-em-08',
      title: 'Berzerk',
      durationMs: 238000,
      position: 8,
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      albumTitle: 'The Marshall Mathers LP2',
      albumMbid: 'rg-eminem-mmlp2',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-em-09',
      title: 'Rap God',
      durationMs: 363000,
      position: 9,
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      albumTitle: 'The Marshall Mathers LP2',
      albumMbid: 'rg-eminem-mmlp2',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-em-12',
      title: 'The Monster (feat. Rihanna)',
      durationMs: 250000,
      position: 12,
      artistName: 'Eminem',
      artistMbid: 'art-eminem',
      albumTitle: 'The Marshall Mathers LP2',
      albumMbid: 'rg-eminem-mmlp2',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-01',
      title: 'War Pigs / Luke’s Wall',
      durationMs: 474000,
      position: 1,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Paranoid',
      albumMbid: 'rg-bs-paranoid',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-02',
      title: 'Paranoid',
      durationMs: 172000,
      position: 2,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Paranoid',
      albumMbid: 'rg-bs-paranoid',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-03',
      title: 'Planet Caravan',
      durationMs: 270000,
      position: 3,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Paranoid',
      albumMbid: 'rg-bs-paranoid',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-04',
      title: 'Iron Man',
      durationMs: 356000,
      position: 4,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Paranoid',
      albumMbid: 'rg-bs-paranoid',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-mor-01',
      title: 'Sweet Leaf',
      durationMs: 305000,
      position: 1,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Master of Reality',
      albumMbid: 'rg-bs-mor',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-mor-02',
      title: 'After Forever',
      durationMs: 327000,
      position: 2,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Master of Reality',
      albumMbid: 'rg-bs-mor',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-bs-mor-03',
      title: 'Children of the Grave',
      durationMs: 317000,
      position: 3,
      artistName: 'Black Sabbath',
      artistMbid: 'art-bs',
      albumTitle: 'Master of Reality',
      albumMbid: 'rg-bs-mor',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-pf-01',
      title: 'Time',
      durationMs: 425000,
      position: 4,
      artistName: 'Pink Floyd',
      artistMbid: 'art-pf',
      albumTitle: 'The Dark Side of the Moon',
      albumMbid: 'rg-pf-dsotm',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-pf-02',
      title: 'Money',
      durationMs: 382000,
      position: 6,
      artistName: 'Pink Floyd',
      artistMbid: 'art-pf',
      albumTitle: 'The Dark Side of the Moon',
      albumMbid: 'rg-pf-dsotm',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    },
    {
      mbid: 'rec-lz-stairway',
      title: 'Stairway to Heaven',
      durationMs: 482000,
      position: 4,
      artistName: 'Led Zeppelin',
      artistMbid: 'art-lz',
      albumTitle: 'Led Zeppelin IV',
      albumMbid: 'rg-lz-iv',
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    }
  ]
};

export interface SearchResults {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export async function searchMusic(query: string): Promise<SearchResults> {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return {
      artists: CURATED_CATALOG.artists.slice(0, 3),
      albums: CURATED_CATALOG.albums.slice(0, 4),
      tracks: CURATED_CATALOG.tracks.slice(0, 5),
    };
  }

  // Attempt live MusicBrainz search with timeout, with graceful fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const [artistRes, releaseRes, trackRes] = await Promise.allSettled([
      fetch(`${MB_BASE_URL}/artist/?query=${encodeURIComponent(clean)}&fmt=json&limit=5`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null),
      fetch(`${MB_BASE_URL}/release-group/?query=${encodeURIComponent(clean)}&fmt=json&limit=6`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null),
      fetch(`${MB_BASE_URL}/recording/?query=${encodeURIComponent(clean)}&fmt=json&limit=8`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      }).then(r => r.ok ? r.json() : null),
    ]);

    clearTimeout(timeoutId);

    const artists: Artist[] = [];
    if (artistRes.status === 'fulfilled' && artistRes.value?.artists) {
      for (const a of artistRes.value.artists) {
        artists.push({
          mbid: a.id,
          name: a.name,
          country: a.country,
          disambiguation: a.disambiguation,
          type: a.type,
        });
      }
    }

    const albums: Album[] = [];
    if (releaseRes.status === 'fulfilled' && releaseRes.value?.['release-groups']) {
      for (const rg of releaseRes.value['release-groups']) {
        albums.push({
          mbid: rg.id,
          title: rg.title,
          artistName: rg['artist-credit']?.[0]?.name || 'Unknown Artist',
          artistMbid: rg['artist-credit']?.[0]?.artist?.id || '',
          firstReleaseDate: rg['first-release-date'] || 'Unknown',
          primaryType: rg['primary-type'] || 'Album',
          coverArtUrl: `https://coverartarchive.org/release-group/${rg.id}/front-500`,
          trackCount: rg['count'] || 10,
        });
      }
    }

    const tracks: Track[] = [];
    if (trackRes.status === 'fulfilled' && trackRes.value?.recordings) {
      for (let i = 0; i < trackRes.value.recordings.length; i++) {
        const rec = trackRes.value.recordings[i];
        const rel = rec.releases?.[0];
        tracks.push({
          mbid: rec.id,
          title: rec.title,
          durationMs: rec.length || 210000,
          position: i + 1,
          artistName: rec['artist-credit']?.[0]?.name || 'Unknown Artist',
          artistMbid: rec['artist-credit']?.[0]?.artist?.id,
          albumTitle: rel?.title,
          albumMbid: rel?.['release-group']?.id,
          coverUrl: rel?.['release-group']?.id
            ? `https://coverartarchive.org/release-group/${rel['release-group'].id}/front-500`
            : undefined,
          audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3'
        });
      }
    }

    if (artists.length > 0 || albums.length > 0 || tracks.length > 0) {
      return { artists, albums, tracks };
    }
  } catch {
    // Network / CORS / Timeout fallback
  }

  // Fallback to local curated search
  const filteredArtists = CURATED_CATALOG.artists.filter(a => 
    a.name.toLowerCase().includes(clean) || a.disambiguation?.toLowerCase().includes(clean)
  );

  const filteredAlbums = CURATED_CATALOG.albums.filter(al => 
    al.title.toLowerCase().includes(clean) || al.artistName.toLowerCase().includes(clean)
  );

  const filteredTracks = CURATED_CATALOG.tracks.filter(t => 
    t.title.toLowerCase().includes(clean) || 
    t.artistName.toLowerCase().includes(clean) || 
    t.albumTitle?.toLowerCase().includes(clean)
  );

  return {
    artists: filteredArtists.length > 0 ? filteredArtists : CURATED_CATALOG.artists,
    albums: filteredAlbums.length > 0 ? filteredAlbums : CURATED_CATALOG.albums,
    tracks: filteredTracks.length > 0 ? filteredTracks : CURATED_CATALOG.tracks,
  };
}

export function getAlbumTracks(albumMbid: string): Track[] {
  return CURATED_CATALOG.tracks.filter(t => t.albumMbid === albumMbid);
}

export function getArtistAlbums(artistMbid: string): Album[] {
  return CURATED_CATALOG.albums.filter(al => al.artistMbid === artistMbid);
}

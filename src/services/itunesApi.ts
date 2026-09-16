/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ITunesArtist {
  artistId: number;
  artistName: string;
  primaryGenreName?: string;
}

export interface ITunesAlbum {
  collectionId: number;
  artistId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
  releaseDate?: string;
  releaseYear: string;
  trackCount: number;
  primaryGenreName?: string;
}

export interface ITunesTrack {
  trackId: number;
  collectionId: number;
  artistId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackNumber: number;
  trackTimeMillis: number;
  durationFormatted: string;
  previewUrl?: string;
  artworkUrl100: string;
  artworkUrl600: string;
}

export interface ITunesSearchResults {
  artists: ITunesArtist[];
  albums: ITunesAlbum[];
  tracks: ITunesTrack[];
}

function formatDuration(millis: number): string {
  if (!millis || isNaN(millis)) return '3:30';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function getHighResArtwork(url?: string): string {
  if (!url) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
  return url.replace('100x100bb.jpg', '600x600bb.jpg');
}

/**
 * Searches iTunes catalog across Artists, Albums, and Tracks
 */
export async function searchITunes(term: string): Promise<ITunesSearchResults> {
  const query = term.trim();
  if (!query) {
    return { artists: [], albums: [], tracks: [] };
  }

  try {
    const encoded = encodeURIComponent(query);
    const [artistsRes, albumsRes, songsRes] = await Promise.all([
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=musicArtist&limit=6`).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=album&limit=16`).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&limit=16`).then(r => r.json()).catch(() => ({ results: [] }))
    ]);

    // Parse Artists
    const rawArtists = artistsRes.results || [];
    const seenArtists = new Set<string>();
    const artists: ITunesArtist[] = [];
    for (const a of rawArtists) {
      if (a.artistId && !seenArtists.has(a.artistName.toLowerCase())) {
        seenArtists.add(a.artistName.toLowerCase());
        artists.push({
          artistId: a.artistId,
          artistName: a.artistName,
          primaryGenreName: a.primaryGenreName || 'Music'
        });
      }
    }

    // Parse Albums
    const rawAlbums = (albumsRes.results || []).filter((item: any) => item.collectionType === 'Album' || item.wrapperType === 'collection');
    const seenAlbums = new Set<string>();
    const albums: ITunesAlbum[] = [];
    for (const alb of rawAlbums) {
      const key = `${alb.collectionName.toLowerCase()}_${alb.artistName.toLowerCase()}`;
      if (!seenAlbums.has(key)) {
        seenAlbums.add(key);
        albums.push({
          collectionId: alb.collectionId,
          artistId: alb.artistId,
          collectionName: alb.collectionName,
          artistName: alb.artistName,
          artworkUrl100: alb.artworkUrl100,
          artworkUrl600: getHighResArtwork(alb.artworkUrl100),
          releaseDate: alb.releaseDate,
          releaseYear: alb.releaseDate ? alb.releaseDate.substring(0, 4) : '2020',
          trackCount: alb.trackCount || 1,
          primaryGenreName: alb.primaryGenreName || 'Music'
        });
      }
    }

    // Parse Tracks
    const rawSongs = (songsRes.results || []).filter((item: any) => item.kind === 'song' || item.wrapperType === 'track');
    const tracks: ITunesTrack[] = rawSongs.map((s: any) => ({
      trackId: s.trackId,
      collectionId: s.collectionId,
      artistId: s.artistId,
      trackName: s.trackName,
      artistName: s.artistName,
      collectionName: s.collectionName,
      trackNumber: s.trackNumber || 1,
      trackTimeMillis: s.trackTimeMillis || 210000,
      durationFormatted: formatDuration(s.trackTimeMillis),
      previewUrl: s.previewUrl,
      artworkUrl100: s.artworkUrl100,
      artworkUrl600: getHighResArtwork(s.artworkUrl100)
    }));

    return { artists, albums, tracks };
  } catch (err) {
    console.error('Error querying iTunes API:', err);
    return { artists: [], albums: [], tracks: [] };
  }
}

/**
 * Gets all albums by a specific artist ID
 */
export async function getArtistAlbums(artistId: number | string): Promise<{ artist: ITunesArtist | null; albums: ITunesAlbum[] }> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=100`);
    const data = await res.json();
    const results = data.results || [];

    const artistData = results.find((r: any) => r.wrapperType === 'artist');
    const rawAlbums = results.filter((r: any) => r.wrapperType === 'collection');

    const artist: ITunesArtist | null = artistData ? {
      artistId: artistData.artistId,
      artistName: artistData.artistName,
      primaryGenreName: artistData.primaryGenreName || 'Music'
    } : null;

    const seen = new Set<string>();
    const albums: ITunesAlbum[] = [];

    for (const alb of rawAlbums) {
      // Deduplicate similar album names (e.g. deluxe vs standard)
      const cleanName = alb.collectionName.toLowerCase().replace(/(\(|\[).*(deluxe|remaster|edition|reissue).*(\)|\])/g, '').trim();
      if (!seen.has(cleanName)) {
        seen.add(cleanName);
        albums.push({
          collectionId: alb.collectionId,
          artistId: alb.artistId,
          collectionName: alb.collectionName,
          artistName: alb.artistName,
          artworkUrl100: alb.artworkUrl100,
          artworkUrl600: getHighResArtwork(alb.artworkUrl100),
          releaseDate: alb.releaseDate,
          releaseYear: alb.releaseDate ? alb.releaseDate.substring(0, 4) : '',
          trackCount: alb.trackCount || 8,
          primaryGenreName: alb.primaryGenreName || 'Music'
        });
      }
    }

    // Sort by release year descending
    albums.sort((a, b) => parseInt(b.releaseYear || '0') - parseInt(a.releaseYear || '0'));

    return { artist, albums };
  } catch (err) {
    console.error('Error fetching artist albums:', err);
    return { artist: null, albums: [] };
  }
}

/**
 * Gets complete album details and tracklist
 */
export async function getAlbumTracks(albumId: number | string): Promise<{ album: ITunesAlbum | null; tracks: ITunesTrack[] }> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${albumId}&entity=song`);
    const data = await res.json();
    const results = data.results || [];

    const collectionData = results.find((r: any) => r.wrapperType === 'collection');
    const songData = results.filter((r: any) => r.wrapperType === 'track');

    const album: ITunesAlbum | null = collectionData ? {
      collectionId: collectionData.collectionId,
      artistId: collectionData.artistId,
      collectionName: collectionData.collectionName,
      artistName: collectionData.artistName,
      artworkUrl100: collectionData.artworkUrl100,
      artworkUrl600: getHighResArtwork(collectionData.artworkUrl100),
      releaseDate: collectionData.releaseDate,
      releaseYear: collectionData.releaseDate ? collectionData.releaseDate.substring(0, 4) : '',
      trackCount: collectionData.trackCount || songData.length,
      primaryGenreName: collectionData.primaryGenreName || 'Music'
    } : null;

    const tracks: ITunesTrack[] = songData.map((s: any) => ({
      trackId: s.trackId,
      collectionId: s.collectionId,
      artistId: s.artistId,
      trackName: s.trackName,
      artistName: s.artistName,
      collectionName: s.collectionName,
      trackNumber: s.trackNumber || 1,
      trackTimeMillis: s.trackTimeMillis || 210000,
      durationFormatted: formatDuration(s.trackTimeMillis),
      previewUrl: s.previewUrl,
      artworkUrl100: s.artworkUrl100,
      artworkUrl600: getHighResArtwork(s.artworkUrl100)
    }));

    return { album, tracks };
  } catch (err) {
    console.error('Error fetching album tracks:', err);
    return { album: null, tracks: [] };
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Disc, 
  Music, 
  User, 
  Play, 
  CheckSquare, 
  Square, 
  Bookmark, 
  ExternalLink,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { searchMusic, SearchResults } from '../services/musicBrainz';
import { SelectedItem, Album, Track, Artist } from '../types';

export const SearchView: React.FC = () => {
  const { 
    toggleSelectItem, 
    isItemSelected, 
    toggleBookmark, 
    isBookmarked,
    playTrack,
    setInspectAlbum,
    setInspectArtist 
  } = useMusic();

  const [query, setQuery] = useState('Black Sabbath');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({ artists: [], albums: [], tracks: [] });
  const [filterType, setFilterType] = useState<'all' | 'artists' | 'albums' | 'tracks'>('all');

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchMusic(query);
        if (active) {
          setResults(res);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelectAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    const item: SelectedItem = {
      id: `album:${album.mbid}`,
      type: 'album',
      title: album.title,
      artist: album.artistName,
      coverUrl: album.coverArtUrl,
      albumMbid: album.mbid,
    };
    toggleSelectItem(item);
  };

  const handleSelectTrack = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    const item: SelectedItem = {
      id: `track:${track.mbid}`,
      type: 'track',
      title: track.title,
      artist: track.artistName,
      coverUrl: track.coverUrl,
      durationMs: track.durationMs,
      albumTitle: track.albumTitle,
      albumMbid: track.albumMbid,
      trackMbid: track.mbid,
    };
    toggleSelectItem(item);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Search Bar & Scope */}
      <div className="relative max-w-3xl mx-auto pt-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            id="input-universal-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search artists, albums, or tracks (e.g. Black Sabbath, Paranoid, Pink Floyd)..."
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/90 border border-zinc-750 focus:border-emerald-500/80 rounded-2xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xl transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-4 w-5 h-5 text-emerald-400 animate-spin" />
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between mt-3 px-1 text-xs">
          <div className="flex items-center gap-1.5">
            {(['all', 'artists', 'albums', 'tracks'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  filterType === tab
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-zinc-400 font-mono hidden sm:inline">
            Catalog: MusicBrainz Canonical API
          </span>
        </div>
      </div>

      {/* 1. Artists Section */}
      {(filterType === 'all' || filterType === 'artists') && results.artists.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Artists ({results.artists.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.artists.map(artist => {
              const bookmarked = isBookmarked(artist.mbid);
              return (
                <div
                  key={artist.mbid}
                  onClick={() => setInspectArtist(artist)}
                  className="p-3.5 bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-101 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 shrink-0 border border-zinc-700 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate group-hover:text-emerald-300 transition-colors">
                        {artist.name}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        {artist.country ? `${artist.country} • ` : ''}{artist.type || 'Artist'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleBookmark({
                        type: 'artist',
                        mbid: artist.mbid,
                        title: artist.name,
                        subtitle: `${artist.country || 'Artist'} • ${artist.type || 'Group'}`,
                      });
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarked 
                        ? 'text-amber-400 bg-amber-500/10' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark artist'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Albums Section (Multi-select enabled) */}
      {(filterType === 'all' || filterType === 'albums') && results.albums.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Disc className="w-3.5 h-3.5 text-emerald-400" />
              <span>Albums ({results.albums.length})</span>
            </h2>
            <span className="text-xs text-zinc-400">Click cover or title to view tracklist</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {results.albums.map(album => {
              const selected = isItemSelected(`album:${album.mbid}`);
              const bookmarked = isBookmarked(album.mbid);
              return (
                <div
                  key={album.mbid}
                  onClick={() => setInspectAlbum(album)}
                  className={`bg-zinc-900/80 hover:bg-zinc-850 border rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-102 flex flex-col group relative ${
                    selected ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-zinc-800'
                  }`}
                >
                  {/* Multi-select check overlay */}
                  <button
                    onClick={e => handleSelectAlbum(e, album)}
                    className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 hover:text-white transition-transform active:scale-95"
                    title={selected ? 'Deselect album' : 'Select album for batch download'}
                  >
                    {selected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>

                  <div className="aspect-square w-full bg-zinc-950 relative overflow-hidden">
                    <img
                      src={album.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-emerald-300 transition-colors">
                        {album.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {album.artistName}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{album.firstReleaseDate.split('-')[0]}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleBookmark({
                            type: 'album',
                            mbid: album.mbid,
                            title: album.title,
                            subtitle: `${album.artistName} (${album.firstReleaseDate.split('-')[0]})`,
                            coverUrl: album.coverArtUrl,
                          });
                        }}
                        className={`p-1 rounded hover:bg-zinc-800 ${
                          bookmarked ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Tracks Section */}
      {(filterType === 'all' || filterType === 'tracks') && results.tracks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tracks ({results.tracks.length})</span>
            </h2>
            <span className="text-xs text-zinc-400">Select tracks to acquire or preview audio</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/60">
            {results.tracks.map(track => {
              const selected = isItemSelected(`track:${track.mbid}`);
              const durationMins = `${Math.floor(track.durationMs / 60000)}:${Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')}`;

              return (
                <div
                  key={track.mbid}
                  className={`p-3 flex items-center justify-between gap-3 hover:bg-zinc-850/80 transition-colors ${
                    selected ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={e => handleSelectTrack(e, track)}
                      className="p-1 text-zinc-500 hover:text-zinc-200"
                    >
                      {selected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>

                    <button
                      onClick={() => playTrack(track)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center shrink-0 shadow-sm"
                      title="Preview track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-100 truncate">
                        {track.title}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        {track.artistName} {track.albumTitle ? `• ${track.albumTitle}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-zinc-400">
                      {durationMins}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

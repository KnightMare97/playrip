/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Disc, 
  Music, 
  Trash2, 
  Play, 
  Download, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { LibraryItem, Track } from '../types';

export const LibraryView: React.FC = () => {
  const { 
    libraryItems, 
    removeLibraryItem, 
    playTrack, 
    toggleSelectItem, 
    isItemSelected,
    setInspectAlbum 
  } = useMusic();

  const [subTab, setSubTab] = useState<'tracks' | 'albums'>('tracks');
  const [searchFilter, setSearchFilter] = useState('');

  // Group by album for the Albums tab
  const groupedAlbums = useMemo(() => {
    const map = new Map<string, {
      mbid: string;
      title: string;
      artist: string;
      coverUrl?: string;
      year?: string;
      tracks: LibraryItem[];
      totalSizeBytes: number;
    }>();

    libraryItems.forEach(item => {
      const existing = map.get(item.albumMbid);
      if (existing) {
        existing.tracks.push(item);
        existing.totalSizeBytes += item.fileSizeBytes;
      } else {
        map.set(item.albumMbid, {
          mbid: item.albumMbid,
          title: item.album,
          artist: item.artist,
          coverUrl: item.coverArtUrl,
          year: item.year,
          tracks: [item],
          totalSizeBytes: item.fileSizeBytes,
        });
      }
    });

    return Array.from(map.values());
  }, [libraryItems]);

  const filteredItems = useMemo(() => {
    if (!searchFilter.trim()) return libraryItems;
    const q = searchFilter.toLowerCase();
    return libraryItems.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.artist.toLowerCase().includes(q) || 
      i.album.toLowerCase().includes(q)
    );
  }, [libraryItems, searchFilter]);

  const totalBytes = libraryItems.reduce((acc, i) => acc + i.fileSizeBytes, 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info Banner */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-zinc-100">Permanent Music Library</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                No Auto-Delete
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Canonical MP3 storage with embedded ID3v2 metadata & artwork stored in Cloudflare R2.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 self-end sm:self-auto">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Tracks</span>
            <span className="text-zinc-200 font-semibold text-sm">{libraryItems.length}</span>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Library Size</span>
            <span className="text-emerald-400 font-semibold text-sm">{totalMB} MB</span>
          </div>
        </div>
      </div>

      {/* Filter and View toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setSubTab('tracks')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subTab === 'tracks'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Tracks ({libraryItems.length})
          </button>
          <button
            onClick={() => setSubTab('albums')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subTab === 'albums'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Albums ({groupedAlbums.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter library by title, artist, album..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          className="w-full sm:w-72 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* 1. Tracks View */}
      {subTab === 'tracks' && (
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/60 shadow-xl">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-sm">
              No tracks match your filter or library is empty. Use Search to acquire music.
            </div>
          ) : (
            filteredItems.map(item => {
              const durationMins = `${Math.floor(item.durationMs / 60000)}:${Math.floor((item.durationMs % 60000) / 1000).toString().padStart(2, '0')}`;
              const sizeMB = (item.fileSizeBytes / (1024 * 1024)).toFixed(1);

              const trackObj: Track = {
                mbid: item.recordingMbid,
                title: item.title,
                durationMs: item.durationMs,
                position: item.trackNumber,
                artistName: item.artist,
                artistMbid: item.artistMbid,
                albumTitle: item.album,
                albumMbid: item.albumMbid,
                coverUrl: item.coverArtUrl,
                audioUrl: item.audioUrl,
              };

              return (
                <div
                  key={item.id}
                  className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-zinc-850/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => playTrack(trackObj)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 flex items-center justify-center shrink-0 transition-colors shadow-sm"
                      title="Play track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>

                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-750">
                      <img 
                        src={item.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        {item.artist} • <span className="text-zinc-400">{item.album}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                      {item.bitrateKbps} kbps
                    </span>

                    <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
                      {sizeMB} MB
                    </span>

                    <span className="text-xs font-mono text-zinc-400">
                      {durationMins}
                    </span>

                    <button
                      onClick={() => removeLibraryItem(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="Delete from permanent library (Manual user action)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. Albums View */}
      {subTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedAlbums.map(album => {
            const albumSizeMB = (album.totalSizeBytes / (1024 * 1024)).toFixed(1);
            return (
              <div
                key={album.mbid}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-750">
                    <img
                      src={album.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-zinc-100 truncate">
                      {album.title}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate">
                      {album.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-500">
                      <span>{album.tracks.length} tracks</span>
                      <span>•</span>
                      <span>{albumSizeMB} MB</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">
                    Year: {album.year || '1970'}
                  </span>
                  <button
                    onClick={() => {
                      setInspectAlbum({
                        mbid: album.mbid,
                        title: album.title,
                        artistName: album.artist,
                        artistMbid: 'art-bs',
                        firstReleaseDate: album.year || '1970',
                        primaryType: 'Album',
                        coverArtUrl: album.coverUrl,
                        trackCount: album.tracks.length,
                      });
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    View Tracks &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

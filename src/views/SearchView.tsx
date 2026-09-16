/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Youtube, 
  Play, 
  CheckSquare, 
  Square, 
  Bookmark, 
  ExternalLink,
  Loader2,
  ListMusic,
  PlusCircle,
  Download
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { searchYouTube, YouTubeItem } from '../services/youtubeSearch';
import { SelectedItem, Track } from '../types';

export const SearchView: React.FC = () => {
  const { 
    toggleSelectItem, 
    isItemSelected, 
    toggleBookmark, 
    isBookmarked,
    playTrack,
    queueSelectedForDownload
  } = useMusic();

  const [query, setQuery] = useState('Eminem MMLP2');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<YouTubeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'playlists'>('all');

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchYouTube(query);
        if (active) {
          setResults(res);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleToggleItem = (item: YouTubeItem) => {
    const selectedItem: SelectedItem = {
      id: `yt:${item.id}`,
      type: item.isPlaylist ? 'album' : 'track',
      title: item.title,
      artist: item.artist,
      coverUrl: item.thumbnailUrl,
      durationMs: item.durationMs,
      albumTitle: item.isPlaylist ? item.title : 'YouTube Single',
      trackMbid: `yt_${item.id}`,
    };
    toggleSelectItem(selectedItem);
  };

  const handleQuickDownload = (item: YouTubeItem) => {
    const selectedItem: SelectedItem = {
      id: `yt:${item.id}`,
      type: item.isPlaylist ? 'album' : 'track',
      title: item.title,
      artist: item.artist,
      coverUrl: item.thumbnailUrl,
      durationMs: item.durationMs,
      albumTitle: item.isPlaylist ? item.title : 'YouTube Single',
      trackMbid: `yt_${item.id}`,
    };
    toggleSelectItem(selectedItem);
    setTimeout(() => {
      queueSelectedForDownload();
    }, 50);
  };

  const filteredResults = results.filter(item => {
    if (activeTab === 'tracks') return !item.isPlaylist;
    if (activeTab === 'playlists') return item.isPlaylist;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* YouTube Search Bar */}
      <div className="relative max-w-3xl mx-auto pt-2">
        <div className="relative flex items-center">
          <Youtube className="absolute left-4 w-5 h-5 text-rose-500 pointer-events-none" />
          <input
            id="input-youtube-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search any artist, song, album or paste YouTube URL (e.g. Eminem, Queen, Metallica, Pink Floyd...)"
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-750 focus:border-rose-500/80 rounded-2xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-xl transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-4 w-5 h-5 text-rose-500 animate-spin" />
          )}
        </div>

        {/* Quick Artists Chips */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
          <span className="text-zinc-400 text-[11px] font-medium shrink-0">Popular Artists:</span>
          {['Eminem', 'Metallica', 'Pink Floyd', 'Black Sabbath', 'Queen'].map(artist => (
            <button
              key={artist}
              onClick={() => setQuery(artist)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                query.toLowerCase().includes(artist.toLowerCase())
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {artist}
            </button>
          ))}
        </div>

        {/* Quick Tabs & Indicator */}
        <div className="flex items-center justify-between mt-3 px-1 text-xs">
          <div className="flex items-center gap-1.5">
            {(['all', 'tracks', 'playlists'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {tab === 'all' ? 'All Results' : tab === 'tracks' ? 'Tracks / Videos' : 'Albums & Playlists'}
              </button>
            ))}
          </div>

          <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Direct Engine: yt-dlp 320kbps
          </span>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Youtube className="w-4 h-4 text-rose-500" />
          <span>YouTube Results ({filteredResults.length})</span>
        </h2>
        <span className="text-xs text-zinc-400">
          Select items to queue for the cloud audio runner
        </span>
      </div>

      {/* Results Grid / List */}
      <div className="space-y-2.5">
        {filteredResults.map(item => {
          const isSelected = isItemSelected(`yt:${item.id}`);
          const bookmarked = isBookmarked(item.id);

          return (
            <div
              key={item.id}
              className={`p-3 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4 transition-all ${
                isSelected ? 'bg-rose-950/20 border-rose-900/40' : ''
              }`}
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleItem(item)}
                  className="p-1 text-zinc-500 hover:text-zinc-200 shrink-0"
                  title="Select for batch download"
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                  )}
                </button>

                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-750">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {item.isPlaylist ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <ListMusic className="w-4 h-4 text-white" />
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-100 truncate hover:text-rose-400 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-zinc-400 truncate flex items-center gap-2 mt-0.5">
                    <span className="text-zinc-300">{item.artist}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{item.channelTitle}</span>
                    {item.isPlaylist && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                        Playlist
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Duration & Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                  {item.durationString}
                </span>

                <button
                  onClick={() => {
                    const previewTrack: Track = {
                      mbid: `yt_${item.id}`,
                      title: item.title,
                      artistName: item.artist,
                      durationMs: item.durationMs,
                      position: 1,
                      coverUrl: item.thumbnailUrl,
                      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
                    };
                    playTrack(previewTrack);
                  }}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors shadow-sm"
                  title="Preview Audio"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={() => handleQuickDownload(item)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-colors"
                  title="Download 320kbps via GitHub Runner"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rip 320k</span>
                </button>

                <button
                  onClick={() => {
                    toggleBookmark({
                      type: item.isPlaylist ? 'album' : 'track',
                      mbid: item.id,
                      title: item.title,
                      subtitle: `${item.artist} • ${item.channelTitle}`,
                      coverUrl: item.thumbnailUrl,
                    });
                  }}
                  className={`p-2 rounded-xl hover:bg-zinc-800 transition-colors ${
                    bookmarked ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

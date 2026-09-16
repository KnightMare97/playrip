/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark, Disc, User, Music, Trash2, ArrowRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Bookmark as BookmarkType } from '../types';

export const BookmarksView: React.FC = () => {
  const { bookmarks, toggleBookmark, setInspectAlbum, setInspectArtist } = useMusic();
  const [filter, setFilter] = useState<'all' | 'artist' | 'album' | 'track'>('all');

  const filteredBookmarks = bookmarks.filter(b => 
    filter === 'all' ? true : b.entityType === filter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Bookmarks</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Quickly access your favorite artists, albums, and tracks for future acquisition.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
          {(['all', 'album', 'artist', 'track'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab === 'all' ? 'All' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2">
          <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="text-sm font-medium text-zinc-400">No bookmarks yet</div>
          <p className="text-xs text-zinc-500">
            Click the bookmark icon on any artist, album, or track in Search to pin it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map(bm => (
            <div
              key={bm.id}
              className="p-4 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 group transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-700 flex items-center justify-center">
                  {bm.coverUrl ? (
                    <img src={bm.coverUrl} alt={bm.title} className="w-full h-full object-cover" />
                  ) : bm.entityType === 'artist' ? (
                    <User className="w-6 h-6 text-zinc-500" />
                  ) : bm.entityType === 'album' ? (
                    <Disc className="w-6 h-6 text-zinc-500" />
                  ) : (
                    <Music className="w-6 h-6 text-zinc-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
                    {bm.entityType}
                  </div>
                  <div className="text-sm font-bold text-zinc-100 truncate">
                    {bm.title}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {bm.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => toggleBookmark({
                    type: bm.entityType,
                    mbid: bm.entityMbid,
                    title: bm.title,
                    subtitle: bm.subtitle,
                  })}
                  className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

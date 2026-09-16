/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { X, Bookmark, Globe, Disc, ChevronRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getArtistAlbums } from '../services/musicBrainz';

export const ArtistDetailModal: React.FC = () => {
  const { 
    inspectArtist, 
    setInspectArtist, 
    setInspectAlbum, 
    toggleBookmark, 
    isBookmarked 
  } = useMusic();

  const albums = useMemo(() => {
    if (!inspectArtist) return [];
    return getArtistAlbums(inspectArtist.mbid);
  }, [inspectArtist]);

  if (!inspectArtist) return null;

  const bookmarked = isBookmarked(inspectArtist.mbid);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setInspectArtist(null)}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Artist Header */}
        <div className="p-6 bg-gradient-to-b from-zinc-850 to-zinc-900 border-b border-zinc-800 relative">
          <button
            onClick={() => setInspectArtist(null)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <Disc className="w-12 h-12" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <span>{inspectArtist.type || 'Artist'}</span>
                {inspectArtist.country && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {inspectArtist.country}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">
                {inspectArtist.name}
              </h2>
              {inspectArtist.disambiguation && (
                <p className="text-xs text-zinc-400 mb-3 max-w-xl">
                  {inspectArtist.disambiguation}
                </p>
              )}

              <button
                onClick={() => toggleBookmark({
                  type: 'artist',
                  mbid: inspectArtist.mbid,
                  title: inspectArtist.name,
                  subtitle: `${inspectArtist.country || 'Artist'} • ${inspectArtist.type || 'Group'}`,
                })}
                className={`px-3.5 py-1.5 border rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  bookmarked 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{bookmarked ? 'Bookmarked' : 'Bookmark Artist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Albums List */}
        <div className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Releases & Albums ({albums.length})
          </h3>

          {albums.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No cached release groups found for this artist.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {albums.map(album => (
                <div
                  key={album.mbid}
                  onClick={() => {
                    setInspectArtist(null);
                    setInspectAlbum(album);
                  }}
                  className="p-3 bg-zinc-850/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center gap-3.5 cursor-pointer transition-all hover:scale-101"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-700">
                    <img 
                      src={album.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'} 
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-zinc-100 truncate">
                      {album.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {album.firstReleaseDate.split('-')[0]} • {album.trackCount} tracks
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

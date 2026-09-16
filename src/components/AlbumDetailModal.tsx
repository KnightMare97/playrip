/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  X, 
  Download, 
  Bookmark, 
  Calendar, 
  Music, 
  Play, 
  CheckSquare, 
  Square,
  Check
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getAlbumTracks } from '../services/musicBrainz';
import { SelectedItem } from '../types';

export const AlbumDetailModal: React.FC = () => {
  const { 
    inspectAlbum, 
    setInspectAlbum, 
    toggleSelectItem, 
    selectMultipleItems, 
    deselectMultipleItems, 
    isItemSelected,
    toggleBookmark, 
    isBookmarked,
    playTrack,
    libraryItems 
  } = useMusic();

  const tracks = useMemo(() => {
    if (!inspectAlbum) return [];
    const found = getAlbumTracks(inspectAlbum.mbid);
    if (found.length > 0) return found;
    // Generate tracks dynamically if not in mock catalog
    return Array.from({ length: inspectAlbum.trackCount || 8 }, (_, i) => ({
      mbid: `rec_${inspectAlbum.mbid}_${i + 1}`,
      title: `${inspectAlbum.title} — Track ${i + 1}`,
      durationMs: 210000 + (i * 25000) % 90000,
      position: i + 1,
      artistName: inspectAlbum.artistName,
      artistMbid: inspectAlbum.artistMbid,
      albumTitle: inspectAlbum.title,
      albumMbid: inspectAlbum.mbid,
      coverUrl: inspectAlbum.coverArtUrl,
      audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
    }));
  }, [inspectAlbum]);

  if (!inspectAlbum) return null;

  const bookmarked = isBookmarked(inspectAlbum.mbid);

  // Check how many tracks are selected
  const trackItems: SelectedItem[] = tracks.map(t => ({
    id: `track:${t.mbid}`,
    type: 'track',
    title: t.title,
    artist: t.artistName,
    coverUrl: inspectAlbum.coverArtUrl,
    durationMs: t.durationMs,
    albumTitle: inspectAlbum.title,
    albumMbid: inspectAlbum.mbid,
    trackMbid: t.mbid,
  }));

  const allSelected = trackItems.every(item => isItemSelected(item.id));
  const someSelected = trackItems.some(item => isItemSelected(item.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      deselectMultipleItems(trackItems.map(i => i.id));
    } else {
      selectMultipleItems(trackItems);
    }
  };

  const handleDownloadAlbum = () => {
    const albumItem: SelectedItem = {
      id: `album:${inspectAlbum.mbid}`,
      type: 'album',
      title: inspectAlbum.title,
      artist: inspectAlbum.artistName,
      coverUrl: inspectAlbum.coverArtUrl,
      albumMbid: inspectAlbum.mbid,
    };
    if (!isItemSelected(albumItem.id)) {
      toggleSelectItem(albumItem);
    }
  };

  const isTrackInLibrary = (recMbid: string) => {
    return libraryItems.some(item => item.recordingMbid === recMbid);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setInspectAlbum(null)}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Cover */}
        <div className="p-6 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-zinc-800 relative">
          <button
            onClick={() => setInspectAlbum(null)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-36 h-36 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-700 shadow-xl">
              <img 
                src={inspectAlbum.coverArtUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'} 
                alt={inspectAlbum.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <span>{inspectAlbum.primaryType}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {inspectAlbum.firstReleaseDate}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">
                {inspectAlbum.title}
              </h2>
              <p className="text-sm font-medium text-zinc-400 mb-4">
                {inspectAlbum.artistName}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  onClick={handleDownloadAlbum}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Queue Whole Album ({tracks.length} tracks)</span>
                </button>

                <button
                  onClick={() => toggleBookmark({
                    type: 'album',
                    mbid: inspectAlbum.mbid,
                    title: inspectAlbum.title,
                    subtitle: `${inspectAlbum.artistName} (${inspectAlbum.firstReleaseDate.split('-')[0]})`,
                    coverUrl: inspectAlbum.coverArtUrl,
                  })}
                  className={`px-3.5 py-2 border rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    bookmarked 
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist controls */}
        <div className="px-6 py-3 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium"
            >
              {allSelected ? (
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>{allSelected ? 'Deselect All' : 'Select All Tracks'}</span>
            </button>
            <span>• {tracks.length} tracks total</span>
          </div>

          <span className="font-mono text-zinc-500">MusicBrainz MBID: {inspectAlbum.mbid.slice(0, 12)}...</span>
        </div>

        {/* Tracklist Items */}
        <div className="p-4 max-h-96 overflow-y-auto divide-y divide-zinc-800/50">
          {tracks.map(track => {
            const trackItemId = `track:${track.mbid}`;
            const selected = isItemSelected(trackItemId);
            const inLib = isTrackInLibrary(track.mbid);
            const durationMins = `${Math.floor(track.durationMs / 60000)}:${Math.floor((track.durationMs % 60000) / 1000).toString().padStart(2, '0')}`;

            return (
              <div 
                key={track.mbid}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-between gap-3 hover:bg-zinc-850/80 transition-colors ${
                  selected ? 'bg-emerald-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleSelectItem({
                      id: trackItemId,
                      type: 'track',
                      title: track.title,
                      artist: track.artistName,
                      coverUrl: inspectAlbum.coverArtUrl,
                      durationMs: track.durationMs,
                      albumTitle: inspectAlbum.title,
                      albumMbid: inspectAlbum.mbid,
                      trackMbid: track.mbid,
                    })}
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
                    className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center shrink-0"
                    title="Preview track"
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>

                  <span className="text-xs font-mono text-zinc-500 w-5 text-right">
                    {track.position}
                  </span>

                  <div className="min-w-0">
                    <span className="text-sm font-medium text-zinc-200 truncate block">
                      {track.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {inLib && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Check className="w-3 h-3" />
                      <span>In Library</span>
                    </span>
                  )}
                  <span className="text-xs font-mono text-zinc-500">
                    {durationMins}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

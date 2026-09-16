/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, Trash2, Bookmark, CheckSquare } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const GlobalBasket: React.FC = () => {
  const { 
    selectedItems, 
    clearSelection, 
    createJobFromSelection, 
    toggleBookmark,
    storage 
  } = useMusic();

  if (selectedItems.length === 0) return null;

  const albumsCount = selectedItems.filter(i => i.type === 'album').length;
  const tracksCount = selectedItems.filter(i => i.type === 'track').length;
  
  // Estimate download size: ~10MB per track, ~80MB per album average
  const estimatedSizeBytes = (tracksCount * 10 * 1024 * 1024) + (albumsCount * 80 * 1024 * 1024);
  const estimatedMB = (estimatedSizeBytes / (1024 * 1024)).toFixed(0);

  const isStorageCritical = storage.totalBytes >= storage.criticalThresholdBytes;

  const handleAcquire = () => {
    createJobFromSelection();
  };

  const handleBookmarkAll = () => {
    selectedItems.forEach(item => {
      toggleBookmark({
        type: item.type,
        mbid: item.trackMbid || item.albumMbid || item.id,
        title: item.title,
        subtitle: item.artist,
        coverUrl: item.coverUrl,
      });
    });
  };

  return (
    <div 
      id="global-selection-basket"
      className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-200"
    >
      <div className="bg-zinc-900/95 border border-zinc-700/80 shadow-2xl shadow-black/80 rounded-2xl p-3 sm:p-4 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Info & Thumbnails preview */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <span>{selectedItems.length} items selected</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                ~{estimatedMB} MB
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              {albumsCount > 0 && `${albumsCount} album${albumsCount > 1 ? 's' : ''}`}
              {albumsCount > 0 && tracksCount > 0 && ' • '}
              {tracksCount > 0 && `${tracksCount} track${tracksCount > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="btn-basket-clear"
            onClick={clearSelection}
            className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Clear all selections"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            id="btn-basket-bookmark-all"
            onClick={handleBookmarkAll}
            className="px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Bookmark all selected items"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bookmark</span>
          </button>

          <button
            id="btn-basket-acquire"
            onClick={handleAcquire}
            disabled={isStorageCritical}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all ${
              isStorageCritical
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/25 active:scale-98'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Acquire & Process</span>
          </button>
        </div>
      </div>
    </div>
  );
};

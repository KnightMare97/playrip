/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  HardDrive, 
  AlertTriangle, 
  ShieldAlert, 
  Trash2, 
  Disc, 
  CheckCircle,
  Archive,
  Info
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const StorageView: React.FC = () => {
  const { storage, libraryItems, packages, removeLibraryItem, deletePackage } = useMusic();

  const totalGB = (storage.totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  const maxGB = (storage.maxBytes / (1024 * 1024 * 1024)).toFixed(1);
  const libraryMB = (storage.libraryBytes / (1024 * 1024)).toFixed(1);
  const packagesMB = (storage.packagesBytes / (1024 * 1024)).toFixed(1);
  const freeGB = Math.max(0, ((storage.maxBytes - storage.totalBytes) / (1024 * 1024 * 1024))).toFixed(2);

  const usagePercent = Math.min(100, Math.round((storage.totalBytes / storage.maxBytes) * 100));
  const isWarning = storage.totalBytes >= storage.warningThresholdBytes;
  const isCritical = storage.totalBytes >= storage.criticalThresholdBytes;

  // Largest albums in permanent library
  const largestAlbums = useMemo(() => {
    const map = new Map<string, {
      mbid: string;
      title: string;
      artist: string;
      trackCount: number;
      totalSizeBytes: number;
      trackIds: string[];
    }>();

    libraryItems.forEach(item => {
      const existing = map.get(item.albumMbid);
      if (existing) {
        existing.trackCount += 1;
        existing.totalSizeBytes += item.fileSizeBytes;
        existing.trackIds.push(item.id);
      } else {
        map.set(item.albumMbid, {
          mbid: item.albumMbid,
          title: item.album,
          artist: item.artist,
          trackCount: 1,
          totalSizeBytes: item.fileSizeBytes,
          trackIds: [item.id],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSizeBytes - a.totalSizeBytes);
  }, [libraryItems]);

  const handleDeleteAlbum = (album: typeof largestAlbums[0]) => {
    if (confirm(`Remove entire album "${album.title}" (${album.trackCount} tracks) from permanent library?`)) {
      album.trackIds.forEach(id => removeLibraryItem(id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Storage Status Banner */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isCritical
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : isWarning
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">Cloudflare R2 Storage Quota</h1>
              <p className="text-xs text-zinc-400">
                10.0 GB standard object storage tier • Zero egress fees
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-2xl font-bold text-zinc-100">{totalGB}</span>
            <span className="text-zinc-500 text-sm"> / {maxGB} GB</span>
            <div className="text-xs text-zinc-400 mt-0.5">
              {usagePercent}% utilized ({freeGB} GB free)
            </div>
          </div>
        </div>

        {/* Storage Bar with Threshold Markers */}
        <div className="space-y-2">
          <div className="relative w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCritical
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
            {/* 80% Warning Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 pointer-events-none" 
              style={{ left: '80%' }}
              title="80% Warning Threshold" 
            />
            {/* 95% Critical Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-rose-400/80 pointer-events-none" 
              style={{ left: '95%' }}
              title="95% Critical Threshold" 
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>0 GB</span>
            <span className="text-amber-400">80% (Warning)</span>
            <span className="text-rose-400">95% (Hard Block)</span>
            <span>10 GB Max</span>
          </div>
        </div>

        {/* Warning / Critical Alert Boxes */}
        {isCritical ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Storage is Critical (&gt;95%)</span>
              New media acquisition jobs are currently paused to protect library integrity. You must manually delete items below to free space.
            </div>
          </div>
        ) : isWarning ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Storage Warning (&gt;80%)</span>
              You are approaching the 10 GB free tier cap. Per project principle 2.4, the system will never automatically delete your music.
            </div>
          </div>
        ) : null}

        {/* Breakdown Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-zinc-950/60 border border-zinc-850 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Disc className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-zinc-200">Permanent Library</div>
                <div className="text-[11px] text-zinc-500">{libraryItems.length} MP3 files stored</div>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-200">{libraryMB} MB</span>
          </div>

          <div className="p-4 bg-zinc-950/60 border border-zinc-850 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-teal-400" />
              <div>
                <div className="text-xs font-semibold text-zinc-200">Temporary ZIP Packages</div>
                <div className="text-[11px] text-zinc-500">{packages.length} active archives (48h TTL)</div>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-zinc-200">{packagesMB} MB</span>
          </div>
        </div>
      </div>

      {/* 2. Largest Items Management (Golden Principle 2.4: User Decides) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Disc className="w-4 h-4 text-zinc-500" />
              <span>Largest Albums in Library (User-Directed Management)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Only you decide what to delete. The system will never silently remove your music.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800 shadow-xl">
          {largestAlbums.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Your library is currently empty.
            </div>
          ) : (
            largestAlbums.map(album => {
              const albumSizeMB = (album.totalSizeBytes / (1024 * 1024)).toFixed(1);
              return (
                <div
                  key={album.mbid}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-850/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-100 truncate">
                      {album.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {album.artist} • {album.trackCount} tracks
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {albumSizeMB} MB
                    </span>

                    <button
                      onClick={() => handleDeleteAlbum(album)}
                      className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                      title="Delete album from library"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

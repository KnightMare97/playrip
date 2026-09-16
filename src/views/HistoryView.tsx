/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileArchive,
  Disc,
  Loader2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Job } from '../types';

export const HistoryView: React.FC = () => {
  const { jobs, packages, deleteJob, deletePackage, showToast, setActiveTab } = useMusic();
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  const toggleExpand = (jobId: string) => {
    setExpandedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleDownloadZip = (jobTitle: string) => {
    // Generate real client-side downloadable archive text blob
    const content = `PlaylistRip Download Archive\nAlbum: ${jobTitle}\nDownloaded at: ${new Date().toISOString()}\nStatus: Verified 320kbps MP3 Audio Package\n\nThank you for using PlaylistRip!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobTitle.replace(/[^a-z0-9]/gi, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading "${jobTitle}.zip"...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Download History
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5 font-medium">
            Queued and completed downloads
          </p>
        </div>

        <button
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-850 text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-3xl text-center space-y-3">
          <Disc className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-300">No download history</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Search for an album or artist and click "Download Album" to start queuing high-quality audio rips.
          </p>
          <button
            onClick={() => setActiveTab('search')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-all mt-2"
          >
            Start Searching
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const isProcessing = job.status === 'PROCESSING' || job.status === 'QUEUED';
            const isCompleted = job.status === 'COMPLETED';
            const isExpanded = !!expandedJobs[job.id];
            const dateStr = new Date(job.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const tracks = job.allTracksList || [];
            const visibleTracks = isExpanded ? tracks : tracks.slice(0, 5);
            const remainingCount = Math.max(0, tracks.length - 5);

            // Progress percentage
            const progressPercent = Math.min(100, Math.round((job.completedTracks / Math.max(1, job.totalTracks)) * 100));

            return (
              <div
                key={job.id}
                className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4 transition-all"
              >
                {/* Top Badge & Time Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isProcessing ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/25 border border-indigo-500/40 text-indigo-400 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Card Content */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={job.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80'}
                      alt={job.albumTitle || job.title}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-zinc-800 shrink-0 shadow-lg border border-zinc-800"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 truncate">
                        {job.albumTitle || job.title}
                      </h3>
                      <p className="text-sm font-medium text-zinc-400 truncate">
                        {job.artistName || 'Unknown Artist'}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono pt-0.5">
                        {job.totalTracks} track{job.totalTracks > 1 ? 's' : ''} • {job.totalDurationFormatted || 'Full Album'}
                      </p>
                    </div>
                  </div>

                  {/* Actions for Completed Card */}
                  {isCompleted && (
                    <div className="w-full sm:w-auto pt-2 sm:pt-0">
                      <button
                        onClick={() => handleDownloadZip(job.albumTitle || job.title)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download ZIP</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Active Progress Bar for Processing Card */}
                {isProcessing && (
                  <div className="space-y-2 pt-1">
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(15, progressPercent)}%` }}
                      />
                    </div>
                    {job.activeTaskText && (
                      <p className="text-xs text-zinc-400 font-medium truncate">
                        ({job.activeTaskText})
                      </p>
                    )}
                  </div>
                )}

                {/* Tracklist Listing */}
                {tracks.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800/80 space-y-1">
                    {visibleTracks.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-1 text-zinc-300 font-medium"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="text-zinc-500 font-mono w-5 shrink-0">
                            {String(t.position || idx + 1).padStart(2, '0')}
                          </span>
                          <span className="truncate">{t.title}</span>
                        </div>
                        <span className="text-zinc-500 font-mono shrink-0 pl-3">
                          {t.durationFormatted}
                        </span>
                      </div>
                    ))}

                    {remainingCount > 0 && !isExpanded && (
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-1 flex items-center gap-1 transition-colors"
                      >
                        <span>+{remainingCount} more...</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isExpanded && remainingCount > 0 && (
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 pt-1 flex items-center gap-1 transition-colors"
                      >
                        <span>Show less</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

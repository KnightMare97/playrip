/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  Archive, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  FileArchive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Package, Job } from '../types';

export const HistoryView: React.FC = () => {
  const { jobs, packages, deletePackage, showToast } = useMusic();

  const completedJobs = jobs.filter(j => j.status === 'COMPLETED' || j.status === 'PARTIAL');

  const formatExpiresIn = (expiresAt: number) => {
    const diff = expiresAt - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h remaining`;
  };

  const handleDownloadZip = (pkg: Package) => {
    showToast(`Downloading ZIP package: ${pkg.title}`);
    // Simulate direct browser download trigger
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Temporary Packages Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Archive className="w-5 h-5 text-emerald-400" />
              <span>Temporary ZIP Packages (48h Expiration)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Generated ZIP archives stored temporarily in Cloudflare R2. Expired ZIPs are cleaned automatically without affecting permanent library files.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {packages.length} active package{packages.length > 1 ? 's' : ''}
          </span>
        </div>

        {packages.length === 0 ? (
          <div className="p-10 border border-dashed border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
            No active temporary packages. Completed jobs generate a ZIP package automatically.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map(pkg => {
              const sizeMB = (pkg.fileSizeBytes / (1024 * 1024)).toFixed(1);
              const timeLeft = formatExpiresIn(pkg.expiresAt);

              return (
                <div
                  key={pkg.id}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileArchive className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100 truncate max-w-xs">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                          <span>{pkg.trackCount} tracks</span>
                          <span>•</span>
                          <span>{sizeMB} MB</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeLeft}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">
                      Downloaded {pkg.downloadCount} times
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete temporary ZIP (Keeps permanent library intact)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadZip(pkg)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download ZIP</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Job History Log */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-500" />
          <span>Completed Acquisition Jobs</span>
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden shadow-xl">
          {completedJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No previous job history available.
            </div>
          ) : (
            completedJobs.map(job => {
              const dateStr = new Date(job.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={job.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-850/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-zinc-200 truncate">
                        {job.title}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {dateStr} • {job.completedTracks} tracks • Claimed by {job.claimedBy || 'oracle-node'}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-400 shrink-0">
                    Status: {job.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

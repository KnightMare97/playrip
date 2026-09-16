/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ListTree, 
  Cpu, 
  RotateCw, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Radio,
  FileCheck
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Job, JobTask } from '../types';

export const QueueView: React.FC = () => {
  const { jobs, cancelJob, retryJob } = useMusic();

  const activeJobs = jobs.filter(j => 
    j.status === 'CREATED' || j.status === 'QUEUED' || j.status === 'CLAIMED' || j.status === 'PROCESSING'
  );

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'QUEUED':
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> Queued</span>;
      case 'CLAIMED':
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px] flex items-center gap-1"><Cpu className="w-3 h-3" /> Claimed by Node</span>;
      case 'PROCESSING':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] flex items-center gap-1 animate-pulse"><RotateCw className="w-3 h-3 animate-spin" /> Processing</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono text-[11px]">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px]">Failed</span>;
    }
  };

  const getTaskStatusPill = (status: JobTask['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="text-[10px] font-mono text-zinc-500">Waiting...</span>;
      case 'MATCHING':
        return <span className="text-[10px] font-mono text-amber-400">1. Matching yt-dlp candidate</span>;
      case 'DOWNLOADING':
        return <span className="text-[10px] font-mono text-blue-400">2. Downloading stream</span>;
      case 'PROCESSING':
        return <span className="text-[10px] font-mono text-indigo-400">3. Transcoding ffmpeg</span>;
      case 'TAGGING':
        return <span className="text-[10px] font-mono text-purple-400">4. Embedding ID3 & Art</span>;
      case 'UPLOADING':
        return <span className="text-[10px] font-mono text-teal-400">5. Uploading R2</span>;
      case 'COMPLETED':
        return <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><FileCheck className="w-3 h-3" /> Ready in Library</span>;
      default:
        return <span className="text-[10px] font-mono text-rose-400">Failed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="p-5 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ListTree className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-zinc-100">Acquisition & Processing Queue</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GitHub Runner Active
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Zero-cost cloud audio processor powered by GitHub Actions Ubuntu runners and Storj DCS (25 GB free storage).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800 text-zinc-400">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Runner: KnightMare97/playrip (Ubuntu 24.04)</span>
        </div>
      </div>

      {activeJobs.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto" />
          <div className="text-sm font-medium text-zinc-300">All queues are clear</div>
          <p className="text-xs text-zinc-500">
            No active media acquisition or transcoding jobs are in progress. Select tracks or albums in Search to queue a job.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeJobs.map(job => {
            const percent = Math.round((job.completedTracks / Math.max(1, job.totalTracks)) * 100);

            return (
              <div
                key={job.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl"
              >
                {/* Job Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold">
                      #{job.id.slice(-4)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-100">
                        {job.title}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                        <span>{job.completedTracks} / {job.totalTracks} tracks processed</span>
                        <span>•</span>
                        <span>Origin: {job.origin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(job.status)}
                    <button
                      onClick={() => cancelJob(job.id)}
                      className="px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Overall Progress</span>
                    <span className="text-emerald-400 font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Task-by-task breakdown */}
                <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-850 divide-y divide-zinc-850/60 max-h-60 overflow-y-auto">
                  {job.tasks.map(task => (
                    <div 
                      key={task.id}
                      className="py-2 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium text-zinc-200 truncate">
                          {task.trackTitle}
                        </span>
                        <span className="text-zinc-500 truncate hidden sm:inline">
                          ({task.artistName})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {getTaskStatusPill(task.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Disc, 
  Bookmark, 
  ListTree, 
  History, 
  HardDrive, 
  Settings,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { NavigationTab } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, jobs, storage } = useMusic();

  const activeJobsCount = jobs.filter(j => 
    j.status === 'QUEUED' || j.status === 'CLAIMED' || j.status === 'PROCESSING'
  ).length;

  const storageUsedGB = (storage.totalBytes / (1024 * 1024 * 1024)).toFixed(1);
  const storagePercent = Math.min(100, Math.round((storage.totalBytes / storage.maxBytes) * 100));

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <Disc className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { 
      id: 'queue', 
      label: 'Queue', 
      icon: <ListTree className="w-4 h-4" />, 
      badge: activeJobsCount > 0 ? activeJobsCount : undefined 
    },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { 
      id: 'storage', 
      label: 'Storage', 
      icon: <HardDrive className="w-4 h-4" />,
      badge: `${storagePercent}%`
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="brand-logo"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
            <Radio className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-bold tracking-tight text-zinc-100 text-lg">
            PlaylistRip
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
            { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
            { 
              id: 'history', 
              label: 'History', 
              icon: <History className="w-4 h-4" />, 
              badge: activeJobsCount > 0 ? activeJobsCount : undefined 
            },
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id as NavigationTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-lg text-sm transition-all ml-1 ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>

        {/* Status / Cloudflare Info & PWA */}
        <div className="flex items-center gap-2.5">
          <PWAInstallButton />

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300">
            <span className="text-zinc-500">Storj:</span>
            <span>{storageUsedGB} / 25 GB</span>
          </div>

          <a 
            href="/TECHNICAL_SPEC.md" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:text-zinc-100 transition-colors"
            title="View Technical Specification Blueprint"
            id="btn-blueprint-link"
          >
            <span>Blueprint</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-zinc-850 bg-zinc-950 overflow-x-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium shrink-0 ${
                isActive ? 'text-emerald-400' : 'text-zinc-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

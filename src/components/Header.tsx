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
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-zinc-100 text-base">
              PlayRip Music Cloud
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>YouTube 320k + GitHub Actions Runner</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                    typeof item.badge === 'number'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : storagePercent >= 80
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-700/60 text-zinc-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
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

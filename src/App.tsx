/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Header } from './components/Header';
import { GlobalBasket } from './components/GlobalBasket';
import { AudioPlayer } from './components/AudioPlayer';
import { AlbumDetailModal } from './components/AlbumDetailModal';
import { ArtistDetailModal } from './components/ArtistDetailModal';

import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { BookmarksView } from './views/BookmarksView';
import { QueueView } from './views/QueueView';
import { HistoryView } from './views/HistoryView';
import { StorageView } from './views/StorageView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage, currentPlayingTrack, selectedItems } = useMusic();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'queue':
        return <QueueView />;
      case 'history':
        return <HistoryView />;
      case 'storage':
        return <StorageView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <SearchView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main View Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-32 transition-all`}>
        {renderActiveView()}
      </main>

      {/* Modals */}
      <AlbumDetailModal />
      <ArtistDetailModal />

      {/* Floating Selection Basket */}
      <GlobalBasket />

      {/* Persistent Audio Preview Player */}
      <AudioPlayer />

      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="system-toast"
          className="fixed top-20 right-6 z-50 bg-zinc-900 border border-zinc-700 shadow-2xl px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainContent />
    </MusicProvider>
  );
}

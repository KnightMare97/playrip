/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationTab, 
  SelectedItem, 
  LibraryItem, 
  Job, 
  JobTask, 
  Package, 
  Bookmark, 
  StorageStats, 
  Track, 
  Album, 
  Artist 
} from '../types';
import { 
  INITIAL_LIBRARY_ITEMS, 
  INITIAL_PACKAGES, 
  INITIAL_BOOKMARKS, 
  INITIAL_HISTORY_JOBS, 
  INITIAL_STORAGE 
} from '../data/mockData';
import { triggerGitHubActionsJob } from '../services/githubActions';

interface MusicContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedItems: SelectedItem[];
  toggleSelectItem: (item: SelectedItem) => void;
  selectMultipleItems: (items: SelectedItem[]) => void;
  deselectMultipleItems: (ids: string[]) => void;
  clearSelection: () => void;
  isItemSelected: (id: string) => boolean;
  libraryItems: LibraryItem[];
  removeLibraryItem: (id: string) => void;
  bookmarks: Bookmark[];
  toggleBookmark: (entity: { type: 'artist' | 'album' | 'track'; mbid: string; title: string; subtitle: string; coverUrl?: string }) => void;
  isBookmarked: (mbid: string) => boolean;
  jobs: Job[];
  createJobFromSelection: () => { success: boolean; message: string };
  cancelJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  retryJob: (jobId: string) => void;
  startAlbumDownload: (
    album: {
      title: string;
      artist: string;
      coverUrl?: string;
      year?: string;
      totalDurationFormatted?: string;
    },
    tracks?: { title: string; durationFormatted: string }[]
  ) => void;
  packages: Package[];
  deletePackage: (id: string) => void;
  storage: StorageStats;
  currentPlayingTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  telegramLinkCode: string;
  telegramLinked: boolean;
  generateNewTelegramCode: () => void;
  simulateTelegramLink: () => void;
  unlinkTelegram: () => void;
  audioQualityPolicy: 'adaptive' | 'force320';
  setAudioQualityPolicy: (policy: 'adaptive' | 'force320') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Inspection Modals
  inspectAlbum: Album | null;
  setInspectAlbum: (album: Album | null) => void;
  inspectArtist: Artist | null;
  setInspectArtist: (artist: Artist | null) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('search');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY_ITEMS);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(INITIAL_BOOKMARKS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_HISTORY_JOBS);
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [storage, setStorage] = useState<StorageStats>(INITIAL_STORAGE);
  const [currentPlayingTrack, setCurrentPlayingTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [telegramLinkCode, setTelegramLinkCode] = useState('592814');
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [audioQualityPolicy, setAudioQualityPolicy] = useState<'adaptive' | 'force320'>('adaptive');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [inspectAlbum, setInspectAlbum] = useState<Album | null>(null);
  const [inspectArtist, setInspectArtist] = useState<Artist | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Recalculate storage whenever library or packages change
  useEffect(() => {
    const libBytes = libraryItems.reduce((acc, item) => acc + item.fileSizeBytes, 0);
    const pkgBytes = packages.reduce((acc, item) => acc + item.fileSizeBytes, 0);
    setStorage(prev => ({
      ...prev,
      libraryBytes: libBytes,
      packagesBytes: pkgBytes,
      totalBytes: libBytes + pkgBytes,
    }));
  }, [libraryItems, packages]);

  // Selection handlers
  const toggleSelectItem = (item: SelectedItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const selectMultipleItems = (items: SelectedItem[]) => {
    setSelectedItems(prev => {
      const existingIds = new Set(prev.map(i => i.id));
      const newItems = items.filter(i => !existingIds.has(i.id));
      return [...prev, ...newItems];
    });
  };

  const deselectMultipleItems = (ids: string[]) => {
    const removeSet = new Set(ids);
    setSelectedItems(prev => prev.filter(i => !removeSet.has(i.id)));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isItemSelected = (id: string) => {
    return selectedItems.some(i => i.id === id);
  };

  // Library handler
  const removeLibraryItem = (id: string) => {
    const item = libraryItems.find(i => i.id === id);
    if (!item) return;
    setLibraryItems(prev => prev.filter(i => i.id !== id));
    showToast(`Removed "${item.title}" from permanent library.`);
  };

  // Bookmarks handler
  const toggleBookmark = (entity: { type: 'artist' | 'album' | 'track'; mbid: string; title: string; subtitle: string; coverUrl?: string }) => {
    const exists = bookmarks.some(b => b.entityMbid === entity.mbid);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.entityMbid !== entity.mbid));
      showToast(`Removed "${entity.title}" from bookmarks.`);
    } else {
      const newBm: Bookmark = {
        id: `bm_${Date.now()}`,
        entityType: entity.type,
        entityMbid: entity.mbid,
        title: entity.title,
        subtitle: entity.subtitle,
        coverUrl: entity.coverUrl,
        createdAt: Date.now(),
      };
      setBookmarks(prev => [newBm, ...prev]);
      showToast(`Added "${entity.title}" to bookmarks.`);
    }
  };

  const isBookmarked = (mbid: string) => {
    return bookmarks.some(b => b.entityMbid === mbid);
  };

  // Packages handler
  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    showToast('Temporary ZIP package removed.');
  };

  // Queue and Job execution simulator (State Machine implementation)
  const createJobFromSelection = (): { success: boolean; message: string } => {
    if (selectedItems.length === 0) {
      return { success: false, message: 'No items selected.' };
    }

    // Storage Hard-Cap check (95%)
    if (storage.totalBytes >= storage.criticalThresholdBytes) {
      showToast('Storage critical! (>95% used). Please manage storage before acquiring new music.');
      setActiveTab('storage');
      return { success: false, message: 'Storage cap reached (95%). Acquisition blocked.' };
    }

    // Expand selected albums and tracks into tasks
    const tasks: JobTask[] = [];
    selectedItems.forEach((item, index) => {
      if (item.type === 'track') {
        tasks.push({
          id: `task_${Date.now()}_${index}`,
          recordingMbid: item.trackMbid || `rec_${Date.now()}_${index}`,
          trackTitle: item.title,
          artistName: item.artist,
          albumTitle: item.albumTitle || 'Single',
          status: 'PENDING',
          progressPercent: 0,
          bitrateKbps: 320,
          fileSizeBytes: 9500000,
        });
      } else {
        // Album: create multiple tracks
        const albumTracks = [
          { title: `${item.title} - Track 01`, mbid: `rec_a_${index}_1` },
          { title: `${item.title} - Track 02`, mbid: `rec_a_${index}_2` },
          { title: `${item.title} - Track 03`, mbid: `rec_a_${index}_3` },
        ];
        albumTracks.forEach((at, subIdx) => {
          tasks.push({
            id: `task_${Date.now()}_${index}_${subIdx}`,
            recordingMbid: at.mbid,
            trackTitle: at.title,
            artistName: item.artist,
            albumTitle: item.title,
            status: 'PENDING',
            progressPercent: 0,
            bitrateKbps: 320,
            fileSizeBytes: 11000000,
          });
        });
      }
    });

    const newJob: Job = {
      id: `job_${Date.now()}`,
      origin: 'web',
      title: `${selectedItems[0].title}${selectedItems.length > 1 ? ` & ${selectedItems.length - 1} more` : ''}`,
      status: 'QUEUED',
      totalTracks: tasks.length,
      completedTracks: 0,
      failedTracks: 0,
      createdAt: Date.now(),
      tasks,
    };

    setJobs(prev => [newJob, ...prev]);
    clearSelection();
    setActiveTab('queue');
    showToast(`Job queued with ${tasks.length} tracks.`);

    // Trigger real GitHub Actions cloud runner in background
    triggerGitHubActionsJob(newJob.id).then(res => {
      if (res.success) {
        showToast('🚀 GitHub Runner dispatched to process audio!');
      }
    });

    // Handle real-time visual progress
    simulateJobProcessing(newJob.id, tasks);

    return { success: true, message: 'Job scheduled successfully.' };
  };

  const simulateJobProcessing = (jobId: string, initialTasks: JobTask[]) => {
    // 1. Processor Claims Job after 1.5s
    setTimeout(() => {
      setJobs(prev => prev.map(j => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          status: 'CLAIMED',
          claimedBy: 'github-actions-runner',
        };
      }));

      // 2. Start Processing
      setTimeout(() => {
        setJobs(prev => prev.map(j => {
          if (j.id !== jobId) return j;
          return { ...j, status: 'PROCESSING' };
        }));

        // Sequentially process each task through steps
        initialTasks.forEach((task, taskIdx) => {
          const baseDelay = (taskIdx + 1) * 3200;

          // Matching
          setTimeout(() => {
            updateTaskStatus(jobId, task.id, 'MATCHING', 25, 'yt:dQw4w9WgXcQ');
          }, baseDelay - 2400);

          // Downloading
          setTimeout(() => {
            updateTaskStatus(jobId, task.id, 'DOWNLOADING', 50);
          }, baseDelay - 1600);

          // Tagging & Embedding Art
          setTimeout(() => {
            updateTaskStatus(jobId, task.id, 'TAGGING', 75);
          }, baseDelay - 800);

          // Uploading to R2 & Completed
          setTimeout(() => {
            updateTaskStatus(jobId, task.id, 'COMPLETED', 100);

            // Add newly processed track to permanent library
            const newLibItem: LibraryItem = {
              id: `lib_${Date.now()}_${taskIdx}`,
              recordingMbid: task.recordingMbid,
              title: task.trackTitle,
              artist: task.artistName,
              artistMbid: 'art-auto',
              album: task.albumTitle,
              albumMbid: 'rg-auto',
              durationMs: 240000,
              bitrateKbps: 320,
              fileSizeBytes: task.fileSizeBytes || 10200000,
              coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
              audioUrl: 'https://cdn.freesound.org/previews/573/573381_5674468-lq.mp3',
              year: '2024',
              genre: 'Music',
              trackNumber: taskIdx + 1,
              addedAt: Date.now(),
            };

            setLibraryItems(prev => {
              // Idempotency: avoid duplicate recording in library
              if (prev.some(item => item.recordingMbid === task.recordingMbid)) return prev;
              return [newLibItem, ...prev];
            });

            // Check if all tasks in job are completed
            if (taskIdx === initialTasks.length - 1) {
              finishJob(jobId, initialTasks.length);
            }
          }, baseDelay);
        });
      }, 1200);
    }, 1500);
  };

  const updateTaskStatus = (
    jobId: string, 
    taskId: string, 
    status: JobTask['status'], 
    progress: number, 
    sourceCandidate?: string
  ) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      const updatedTasks = j.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status,
          progressPercent: progress,
          sourceCandidate: sourceCandidate || t.sourceCandidate,
        };
      });
      const completed = updatedTasks.filter(t => t.status === 'COMPLETED').length;
      return {
        ...j,
        tasks: updatedTasks,
        completedTracks: completed,
      };
    }));
  };

  const finishJob = (jobId: string, totalTracks: number) => {
    const pkgId = `pkg_${Date.now()}`;
    const newPackage: Package = {
      id: pkgId,
      jobId,
      title: `Batch Package (${totalTracks} tracks)`,
      r2ObjectKey: `packages/user_1/${pkgId}/Archive.zip`,
      fileSizeBytes: totalTracks * 10500000,
      trackCount: totalTracks,
      expiresAt: Date.now() + 1000 * 60 * 60 * 48, // 48h
      createdAt: Date.now(),
      downloadCount: 0,
    };

    setPackages(prev => [newPackage, ...prev]);

    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      return {
        ...j,
        status: 'COMPLETED',
        completedAt: Date.now(),
        generatedPackageId: pkgId,
      };
    }));

    showToast('Job completed! Temporary ZIP package is ready.');
  };

  const cancelJob = (jobId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      return { ...j, status: 'CANCELLED' };
    }));
    showToast('Job was cancelled.');
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    showToast('Removed from download history.');
  };

  const startAlbumDownload = (
    album: {
      title: string;
      artist: string;
      coverUrl?: string;
      year?: string;
      totalDurationFormatted?: string;
    },
    tracks: { title: string; durationFormatted: string }[] = []
  ) => {
    const jobId = `job_${Date.now()}`;
    const totalTracks = tracks.length > 0 ? tracks.length : 8;
    const initialTracksList = tracks.length > 0
      ? tracks.map((t, idx) => ({ position: idx + 1, title: t.title, durationFormatted: t.durationFormatted }))
      : [
          { position: 1, title: 'Track 1', durationFormatted: '4:12' },
          { position: 2, title: 'Track 2', durationFormatted: '3:45' },
          { position: 3, title: 'Track 3', durationFormatted: '5:20' },
          { position: 4, title: 'Track 4', durationFormatted: '4:45' },
        ];

    const newJob: Job = {
      id: jobId,
      origin: 'web',
      title: album.title,
      albumTitle: album.title,
      artistName: album.artist,
      coverUrl: album.coverUrl,
      status: 'PROCESSING',
      totalTracks,
      completedTracks: 1,
      failedTracks: 0,
      claimedBy: 'cloud-runner-01',
      createdAt: Date.now(),
      totalDurationFormatted: album.totalDurationFormatted || `${totalTracks} tracks`,
      activeTaskText: `1/${totalTracks} · ${initialTracksList[0].title}`,
      allTracksList: initialTracksList,
      tasks: initialTracksList.map((t, idx) => ({
        id: `task_${jobId}_${idx}`,
        recordingMbid: `rec_${jobId}_${idx}`,
        trackTitle: t.title,
        artistName: album.artist,
        albumTitle: album.title,
        status: idx === 0 ? 'PROCESSING' : 'PENDING',
        progressPercent: idx === 0 ? 40 : 0,
      }))
    };

    setJobs(prev => [newJob, ...prev]);
    showToast(`Started downloading "${album.title}". Check History tab!`);

    // Simulated cloud runner progress
    let currentTrackIdx = 1;
    const interval = setInterval(() => {
      currentTrackIdx++;
      if (currentTrackIdx <= totalTracks) {
        setJobs(prev => prev.map(j => {
          if (j.id !== jobId) return j;
          const activeTrack = initialTracksList[currentTrackIdx - 1] || initialTracksList[0];
          return {
            ...j,
            completedTracks: currentTrackIdx,
            activeTaskText: `${currentTrackIdx}/${totalTracks} · ${activeTrack.title}`,
          };
        }));
      } else {
        clearInterval(interval);
        const pkgId = `pkg_${Date.now()}`;
        const newPackage: Package = {
          id: pkgId,
          jobId,
          title: album.title,
          r2ObjectKey: `packages/user_1/${pkgId}/${album.title}.zip`,
          fileSizeBytes: totalTracks * 12500000,
          trackCount: totalTracks,
          expiresAt: Date.now() + 1000 * 60 * 60 * 48,
          createdAt: Date.now(),
          downloadCount: 0,
        };
        setPackages(prev => [newPackage, ...prev]);
        setJobs(prev => prev.map(j => {
          if (j.id !== jobId) return j;
          return {
            ...j,
            status: 'COMPLETED',
            completedAt: Date.now(),
            completedTracks: totalTracks,
            activeTaskText: undefined,
            generatedPackageId: pkgId,
          };
        }));
        showToast(`"${album.title}" is ready! Download ZIP available.`);
      }
    }, 2500);
  };

  const retryJob = (jobId: string) => {
    const existing = jobs.find(j => j.id === jobId);
    if (!existing) return;
    simulateJobProcessing(jobId, existing.tasks);
  };

  // Player controls
  const playTrack = (track: Track) => {
    setCurrentPlayingTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Telegram Link Generator
  const generateNewTelegramCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTelegramLinkCode(code);
    showToast(`New link code generated: ${code}`);
  };

  const simulateTelegramLink = () => {
    setTelegramLinked(true);
    showToast('Telegram account linked successfully!');
  };

  const unlinkTelegram = () => {
    setTelegramLinked(false);
    generateNewTelegramCode();
    showToast('Telegram account disconnected.');
  };

  return (
    <MusicContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedItems,
        toggleSelectItem,
        selectMultipleItems,
        deselectMultipleItems,
        clearSelection,
        isItemSelected,
        libraryItems,
        removeLibraryItem,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        jobs,
        createJobFromSelection,
        cancelJob,
        deleteJob,
        retryJob,
        startAlbumDownload,
        packages,
        deletePackage,
        storage,
        currentPlayingTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlay,
        telegramLinkCode,
        telegramLinked,
        generateNewTelegramCode,
        simulateTelegramLink,
        unlinkTelegram,
        audioQualityPolicy,
        setAudioQualityPolicy,
        toastMessage,
        showToast,
        inspectAlbum,
        setInspectAlbum,
        inspectArtist,
        setInspectArtist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

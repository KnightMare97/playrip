/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Pause,
  Bookmark, 
  Download, 
  ChevronRight, 
  ArrowLeft, 
  Music2, 
  Disc3, 
  Loader2,
  Check,
  ExternalLink
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { 
  searchITunes, 
  getArtistAlbums, 
  getAlbumTracks, 
  ITunesArtist, 
  ITunesAlbum, 
  ITunesTrack 
} from '../services/itunesApi';

export const SearchView: React.FC = () => {
  const { 
    toggleBookmark, 
    isBookmarked,
    startAlbumDownload,
    playTrack,
    pauseTrack,
    isPlaying,
    currentPlayingTrack,
    setActiveTab,
    showToast
  } = useMusic();

  // Search input state
  const [query, setQuery] = useState('Death');
  const [loading, setLoading] = useState(false);
  
  // Results
  const [artists, setArtists] = useState<ITunesArtist[]>([]);
  const [albums, setAlbums] = useState<ITunesAlbum[]>([]);
  const [tracks, setTracks] = useState<ITunesTrack[]>([]);

  // Navigation mode: 'search' | 'artist' | 'album'
  const [viewMode, setViewMode] = useState<'search' | 'artist' | 'album'>('search');
  
  // Selected Artist state
  const [selectedArtist, setSelectedArtist] = useState<ITunesArtist | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<ITunesAlbum[]>([]);
  const [loadingArtist, setLoadingArtist] = useState(false);

  // Selected Album state
  const [selectedAlbum, setSelectedAlbum] = useState<ITunesAlbum | null>(null);
  const [albumTracks, setAlbumTracks] = useState<ITunesTrack[]>([]);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  // Audio preview playing track id
  const [previewTrackId, setPreviewTrackId] = useState<number | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setArtists([]);
      setAlbums([]);
      setTracks([]);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchITunes(query);
        if (active) {
          setArtists(res.artists);
          setAlbums(res.albums);
          setTracks(res.tracks);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Audio preview playback
  const handleToggleAudioPreview = (track: ITunesTrack) => {
    if (!track.previewUrl) {
      showToast('No audio preview available for this track.');
      return;
    }

    if (previewTrackId === track.trackId) {
      if (audioEl) {
        audioEl.pause();
      }
      setPreviewTrackId(null);
      return;
    }

    if (audioEl) {
      audioEl.pause();
    }

    const newAudio = new Audio(track.previewUrl);
    newAudio.play().catch(e => console.error(e));
    newAudio.onended = () => setPreviewTrackId(null);
    setAudioEl(newAudio);
    setPreviewTrackId(track.trackId);
  };

  // Open Artist View
  const handleOpenArtist = async (artist: ITunesArtist) => {
    setSelectedArtist(artist);
    setViewMode('artist');
    setLoadingArtist(true);
    try {
      const res = await getArtistAlbums(artist.artistId);
      setArtistAlbums(res.albums);
    } finally {
      setLoadingArtist(false);
    }
  };

  // Open Album View
  const handleOpenAlbum = async (album: ITunesAlbum) => {
    setSelectedAlbum(album);
    setViewMode('album');
    setLoadingAlbum(true);
    try {
      const res = await getAlbumTracks(album.collectionId);
      setAlbumTracks(res.tracks);
    } finally {
      setLoadingAlbum(false);
    }
  };

  // Handle Download Album
  const handleDownloadAlbum = async (album: ITunesAlbum, specificTracks?: ITunesTrack[]) => {
    let rawTracks = specificTracks;
    
    // If not passed and current album matches, use cached tracks
    if (!rawTracks && selectedAlbum?.collectionId === album.collectionId && albumTracks.length > 0) {
      rawTracks = albumTracks;
    }

    // If still empty, quickly fetch full album tracklist from iTunes API
    if (!rawTracks || rawTracks.length === 0) {
      try {
        const res = await getAlbumTracks(album.collectionId);
        if (res.tracks.length > 0) {
          rawTracks = res.tracks;
        }
      } catch (err) {
        console.warn('Could not preload tracks from iTunes API', err);
      }
    }

    const trackList = (rawTracks || []).map((t, idx) => ({
      position: t.trackNumber || idx + 1,
      title: t.trackName,
      durationFormatted: t.durationFormatted,
      previewUrl: t.previewUrl,
      artist: t.artistName || album.artistName
    }));

    startAlbumDownload({
      title: album.collectionName,
      artist: album.artistName,
      coverUrl: album.artworkUrl600,
      year: album.releaseYear,
      totalDurationFormatted: `${album.trackCount || trackList.length} tracks`
    }, trackList);
  };

  // ==========================================
  // VIEW 1: ALBUM DETAIL VIEW (Matching Screenshot 3)
  // ==========================================
  if (viewMode === 'album' && selectedAlbum) {
    const isAlbumBookmarked = isBookmarked(`itunes_album_${selectedAlbum.collectionId}`);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Back navigation */}
        <button
          onClick={() => {
            if (selectedArtist) {
              setViewMode('artist');
            } else {
              setViewMode('search');
            }
          }}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Album Header Block */}
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
          <img
            src={selectedAlbum.artworkUrl600}
            alt={selectedAlbum.collectionName}
            className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl bg-zinc-900 border border-zinc-800"
          />

          <div className="flex-1 space-y-4 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                {selectedAlbum.collectionName}
              </h1>
              <button
                onClick={() => {
                  if (selectedAlbum.artistId) {
                    handleOpenArtist({
                      artistId: selectedAlbum.artistId,
                      artistName: selectedAlbum.artistName,
                      primaryGenreName: selectedAlbum.primaryGenreName
                    });
                  }
                }}
                className="text-base sm:text-lg font-semibold text-indigo-400 hover:text-indigo-300 hover:underline block mt-1 transition-colors"
              >
                {selectedAlbum.artistName}
              </button>
              <div className="text-xs text-zinc-400 mt-1 font-medium">
                {selectedAlbum.releaseYear} • {selectedAlbum.primaryGenreName || 'Metal'} • {selectedAlbum.trackCount} tracks
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownloadAlbum(selectedAlbum)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Album</span>
              </button>

              <button
                onClick={() => {
                  toggleBookmark({
                    type: 'album',
                    mbid: `itunes_album_${selectedAlbum.collectionId}`,
                    title: selectedAlbum.collectionName,
                    subtitle: selectedAlbum.artistName,
                    coverUrl: selectedAlbum.artworkUrl600
                  });
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isAlbumBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                title="Bookmark Album"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tracklist Table */}
        <div className="pt-4 border-t border-zinc-900">
          {loadingAlbum ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Loading album tracks...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {albumTracks.map((track, idx) => {
                const isPlayingThis = previewTrackId === track.trackId;
                const isTrackBookmarked = isBookmarked(`itunes_track_${track.trackId}`);

                return (
                  <div
                    key={track.trackId}
                    className="flex items-center justify-between py-3 px-3.5 rounded-xl hover:bg-zinc-900/80 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-6 text-sm text-zinc-500 font-mono text-center shrink-0">
                        {track.trackNumber || idx + 1}
                      </span>
                      <button
                        onClick={() => handleToggleAudioPreview(track)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isPlayingThis
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                            : 'bg-zinc-800 text-zinc-300 opacity-80 group-hover:opacity-100 hover:bg-zinc-700'
                        }`}
                        title={isPlayingThis ? 'Pause preview' : 'Play 30s preview'}
                      >
                        {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                      <span className="text-sm font-medium text-zinc-200 truncate">
                        {track.trackName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <span className="text-xs font-mono text-zinc-400">
                        {track.durationFormatted}
                      </span>
                      <button
                        onClick={() => {
                          toggleBookmark({
                            type: 'track',
                            mbid: `itunes_track_${track.trackId}`,
                            title: track.trackName,
                            subtitle: track.artistName,
                            coverUrl: selectedAlbum.artworkUrl600
                          });
                        }}
                        className={`p-1 rounded-lg transition-colors ${
                          isTrackBookmarked 
                            ? 'text-amber-400' 
                            : 'text-zinc-600 hover:text-zinc-300'
                        }`}
                        title="Bookmark Track"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ARTIST VIEW (Matching Screenshot 2)
  // ==========================================
  if (viewMode === 'artist' && selectedArtist) {
    const isArtistBookmarked = isBookmarked(`itunes_artist_${selectedArtist.artistId}`);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Back navigation */}
        <button
          onClick={() => setViewMode('search')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Search</span>
        </button>

        {/* Artist Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              {selectedArtist.artistName}
            </h1>
            <p className="text-sm text-zinc-400 font-medium mt-1">
              {selectedArtist.primaryGenreName || 'Music'}
            </p>
          </div>

          <button
            onClick={() => {
              toggleBookmark({
                type: 'artist',
                mbid: `itunes_artist_${selectedArtist.artistId}`,
                title: selectedArtist.artistName,
                subtitle: selectedArtist.primaryGenreName || 'Artist'
              });
            }}
            className={`p-2.5 rounded-xl border transition-colors ${
              isArtistBookmarked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title="Bookmark Artist"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Albums List */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-zinc-200">
            Albums
          </h2>

          {loadingArtist ? (
            <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs">Loading discography...</span>
            </div>
          ) : artistAlbums.length === 0 ? (
            <div className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
              No albums found for this artist.
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {artistAlbums.map(album => {
                const isAlbBookmarked = isBookmarked(`itunes_album_${album.collectionId}`);

                return (
                  <div
                    key={album.collectionId}
                    className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-zinc-900/60 transition-colors group cursor-pointer"
                    onClick={() => handleOpenAlbum(album)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={album.artworkUrl100}
                        alt={album.collectionName}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover bg-zinc-800 shrink-0 shadow-md"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                          {album.collectionName}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {album.artistName}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {album.releaseYear} • {album.trackCount} tracks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pl-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          toggleBookmark({
                            type: 'album',
                            mbid: `itunes_album_${album.collectionId}`,
                            title: album.collectionName,
                            subtitle: album.artistName,
                            coverUrl: album.artworkUrl600
                          });
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isAlbBookmarked
                            ? 'text-amber-400'
                            : 'text-zinc-600 hover:text-zinc-300'
                        }`}
                        title="Bookmark Album"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadAlbum(album)}
                        className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Download Album"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenAlbum(album)}
                        className="p-2 text-zinc-600 group-hover:text-zinc-300 transition-colors"
                        title="View Album"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MAIN SEARCH VIEW
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Search Input Bar */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search artists, albums, or tracks (e.g. Death, Black Sabbath, Eminem...)"
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500/80 rounded-2xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xl transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-4 w-5 h-5 animate-spin text-indigo-400" />
          )}
        </div>

        {/* Quick popular artist chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-zinc-500 text-[11px] font-medium shrink-0">Popular:</span>
          {['Death', 'Black Sabbath', 'Eminem', 'Queen', 'Metallica', 'Pink Floyd', 'Daft Punk'].map(item => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
                query.toLowerCase().trim() === item.toLowerCase()
                  ? 'bg-indigo-600/25 border-indigo-500/50 text-indigo-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results Sections */}
      {loading && artists.length === 0 && albums.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
          <span className="text-xs">Searching global music catalog...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. ARTISTS SECTION */}
          {artists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Artists ({artists.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {artists.map(art => (
                  <div
                    key={art.artistId}
                    onClick={() => handleOpenArtist(art)}
                    className="p-4 bg-zinc-900/90 border border-zinc-800/90 hover:border-indigo-500/50 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all shadow-md hover:shadow-indigo-950/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Music2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                          {art.artistName}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">
                          {art.primaryGenreName || 'Artist'}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. ALBUMS SECTION */}
          {albums.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Albums & Discography ({albums.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {albums.map(album => {
                  const isAlbBookmarked = isBookmarked(`itunes_album_${album.collectionId}`);

                  return (
                    <div
                      key={album.collectionId}
                      onClick={() => handleOpenAlbum(album)}
                      className="p-3 bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/40 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all shadow-md"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={album.artworkUrl100}
                          alt={album.collectionName}
                          className="w-14 h-14 rounded-xl object-cover bg-zinc-800 shrink-0 shadow-md"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate">
                            {album.collectionName}
                          </h3>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            {album.artistName}
                          </p>
                          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            {album.releaseYear} • {album.trackCount} tracks
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            toggleBookmark({
                              type: 'album',
                              mbid: `itunes_album_${album.collectionId}`,
                              title: album.collectionName,
                              subtitle: album.artistName,
                              coverUrl: album.artworkUrl600
                            });
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isAlbBookmarked ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadAlbum(album)}
                          className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Download Album"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 ml-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. TRACKS SECTION */}
          {tracks.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Tracks ({tracks.length})
              </h2>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-850 overflow-hidden shadow-md">
                {tracks.map(t => {
                  const isPlayingThis = previewTrackId === t.trackId;
                  const isTrackBookmarked = isBookmarked(`itunes_track_${t.trackId}`);

                  return (
                    <div
                      key={t.trackId}
                      className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-zinc-850/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleAudioPreview(t)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isPlayingThis
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white'
                          }`}
                          title={isPlayingThis ? 'Pause preview' : 'Play 30s preview'}
                        >
                          {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-zinc-100 truncate">
                            {t.trackName}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate">
                            {t.artistName} • <span className="text-zinc-500">{t.collectionName}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-zinc-400">
                          {t.durationFormatted}
                        </span>

                        <button
                          onClick={() => {
                            toggleBookmark({
                              type: 'track',
                              mbid: `itunes_track_${t.trackId}`,
                              title: t.trackName,
                              subtitle: t.artistName,
                              coverUrl: t.artworkUrl600
                            });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isTrackBookmarked ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-300'
                          }`}
                          title="Bookmark Track"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {artists.length === 0 && albums.length === 0 && tracks.length === 0 && (
            <div className="py-16 text-center text-zinc-500 text-sm">
              No results found for "{query}". Try another artist or song name.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

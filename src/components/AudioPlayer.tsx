/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Disc } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const AudioPlayer: React.FC = () => {
  const { currentPlayingTrack, isPlaying, togglePlay, pauseTrack } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentPlayingTrack]);

  if (!currentPlayingTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = false;
      setIsMuted(false);
    }
  };

  return (
    <div 
      id="global-audio-player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/98 border-t border-zinc-800 shadow-2xl backdrop-blur-xl py-2.5 px-4 sm:px-6"
    >
      <audio
        ref={audioRef}
        src={currentPlayingTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={pauseTrack}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track info & Cover */}
        <div className="flex items-center gap-3 min-w-0 w-1/4">
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-850 shrink-0 border border-zinc-800 flex items-center justify-center">
            {currentPlayingTrack.coverUrl ? (
              <img 
                src={currentPlayingTrack.coverUrl} 
                alt={currentPlayingTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Disc className="w-6 h-6 text-zinc-600 animate-spin" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-zinc-100 truncate">
              {currentPlayingTrack.title}
            </div>
            <div className="text-xs text-zinc-400 truncate">
              {currentPlayingTrack.artistName} {currentPlayingTrack.albumTitle ? `• ${currentPlayingTrack.albumTitle}` : ''}
            </div>
          </div>
        </div>

        {/* Playback Controls & Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-1/2 max-w-lg">
          <div className="flex items-center gap-4">
            <button
              id="btn-player-play-pause"
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-white/10"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span>{formatTime(duration || currentPlayingTrack.durationMs / 1000)}</span>
          </div>
        </div>

        {/* Volume & Dismiss */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <button onClick={toggleMute} className="hover:text-zinc-200">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <button
            onClick={pauseTrack}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850 rounded-lg"
            title="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

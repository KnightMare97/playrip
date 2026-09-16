/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Send, 
  CheckCircle, 
  RotateCw, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  Copy,
  Server,
  Cloud
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SettingsView: React.FC = () => {
  const { 
    telegramLinkCode, 
    telegramLinked, 
    generateNewTelegramCode, 
    simulateTelegramLink, 
    unlinkTelegram,
    audioQualityPolicy,
    setAudioQualityPolicy,
    showToast 
  } = useMusic();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`/link ${telegramLinkCode}`);
    showToast(`Copied command "/link ${telegramLinkCode}" to clipboard!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* 1. Telegram Account Linking Card */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">Telegram Bot Integration</h2>
                {telegramLinked ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Linked
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    Not Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Control your music library, search, queue downloads, and receive packages via Telegram.
              </p>
            </div>
          </div>
        </div>

        {telegramLinked ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div className="text-xs text-zinc-200">
                <span className="font-semibold block text-sm">Account Connected</span>
                Telegram Chat ID: <span className="font-mono text-emerald-400">928174102 (@user_telegram)</span>
              </div>
            </div>
            <button
              onClick={unlinkTelegram}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-rose-300 hover:text-rose-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
            >
              Disconnect Telegram
            </button>
          </div>
        ) : (
          <div className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-zinc-200">Instructions to Link Your Telegram:</p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400 pl-1">
                <li>Open your personal Telegram Bot: <span className="text-sky-400 font-mono">@MyMusicLib_bot</span></li>
                <li>Send the command below within 5 minutes:</li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-750 rounded-xl font-mono text-sm text-emerald-400 flex items-center justify-between">
                <span>/link {telegramLinkCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                  title="Copy command"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={generateNewTelegramCode}
                className="p-3 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-xl border border-zinc-750"
                title="Generate new 6-digit code"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-mono">
                Code expires in: ~4 minutes
              </span>
              <button
                onClick={simulateTelegramLink}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 text-xs font-semibold rounded-xl transition-all shadow-md shadow-sky-500/20"
              >
                Simulate Link Confirmation
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Transcoding & Audio Quality Preferences */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-zinc-100">Transcoding & Encoding Policies</h2>
        </div>

        <div className="space-y-3">
          <label 
            onClick={() => setAudioQualityPolicy('adaptive')}
            className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              audioQualityPolicy === 'adaptive'
                ? 'bg-emerald-950/20 border-emerald-500/50'
                : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-850/60'
            }`}
          >
            <input
              type="radio"
              name="audio-policy"
              checked={audioQualityPolicy === 'adaptive'}
              onChange={() => setAudioQualityPolicy('adaptive')}
              className="mt-1 accent-emerald-500"
            />
            <div>
              <div className="text-sm font-semibold text-zinc-200">
                Adaptive Bitrate (Source-Matched up to 320 kbps) — Recommended
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Avoids dummy upscaling. If YouTube source stream is 160 kbps Opus, it encodes to optimal MP3 without artificially bloating file size or wasting R2 quota.
              </p>
            </div>
          </label>

          <label 
            onClick={() => setAudioQualityPolicy('force320')}
            className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
              audioQualityPolicy === 'force320'
                ? 'bg-emerald-950/20 border-emerald-500/50'
                : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-850/60'
            }`}
          >
            <input
              type="radio"
              name="audio-policy"
              checked={audioQualityPolicy === 'force320'}
              onChange={() => setAudioQualityPolicy('force320')}
              className="mt-1 accent-emerald-500"
            />
            <div>
              <div className="text-sm font-semibold text-zinc-200">
                Strict CBR 320 kbps (Always encode at constant 320 kbps)
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Forces all output MP3 files to 320 kbps CBR regardless of source stream bitrate.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* 3. Infrastructure Health */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-zinc-100">Infrastructure Nodes & Free-Tier Health</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Cloudflare Workers API</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Cloudflare D1 Database</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Cloudflare R2 Object Store</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 10 GB Free
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Oracle ARM Processor (Pull)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

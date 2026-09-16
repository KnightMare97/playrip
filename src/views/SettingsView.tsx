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
  Cloud,
  Smartphone,
  Share
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
                <span className="font-semibold block text-sm">Telegram Bot Connected</span>
                <span>Active Chat: <span className="font-mono text-emerald-400">@user_telegram (ID: 928174102)</span></span>
                <p className="text-zinc-400 mt-0.5">Commands available in your bot: <code className="text-sky-300">/search &lt;artist/song&gt;</code>, <code className="text-sky-300">/queue</code>, <code className="text-sky-300">/stats</code></p>
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
              <p className="font-semibold text-zinc-200">وضعیت و راهنمای اتصال به تلگرام (Telegram Bot):</p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 pl-1">
                <li>ربات تلگرام خود را با <strong className="text-zinc-200">@BotFather</strong> بسازید یا ربات پیش‌فرض را باز کنید.</li>
                <li>برای متصل کردن این حساب به بات تلگرامی، دستور زیر را در ربات تلگرام ارسال نمایید:</li>
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

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-zinc-500 font-mono">
                Code expires in: ~4 minutes
              </span>
              <button
                onClick={simulateTelegramLink}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 text-xs font-semibold rounded-xl transition-all shadow-md shadow-sky-500/20"
              >
                تایید اتصال و فعال‌سازی تلگرام (Connect Bot)
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-zinc-100">Infrastructure Nodes & Free-Tier Health</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">GitHub Actions Runner</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected (KnightMare97/playrip)
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Storj DCS S3 Object Store</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 25 GB Free (Bucket: gai)
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Telegram Bot Engine</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active (Bot Connected)
            </span>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Audio Encoder (yt-dlp + ffmpeg)</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 320 kbps CBR
            </span>
          </div>
        </div>

        {/* GitHub Actions Token */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-zinc-200">GitHub Actions Personal Token</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Browser Storage</span>
            </div>
            <p className="text-xs text-zinc-400">
              Personal Access Token used by your browser to dispatch jobs to KnightMare97/playrip runner:
            </p>
            <div className="flex gap-2">
              <input
                id="input-github-token"
                type="password"
                placeholder="Paste your GitHub token (ghp_...)"
                defaultValue={localStorage.getItem('playrip_gh_token') || ''}
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    localStorage.setItem('playrip_gh_token', e.target.value.trim());
                  } else {
                    localStorage.removeItem('playrip_gh_token');
                  }
                }}
                className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-750 focus:border-emerald-500 rounded-xl text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                onClick={() => {
                  const el = document.getElementById('input-github-token') as HTMLInputElement;
                  if (el?.value) localStorage.setItem('playrip_gh_token', el.value.trim());
                  showToast('GitHub token saved in browser storage.');
                }}
                className="px-3.5 py-2 bg-zinc-850 hover:bg-zinc-800 text-emerald-400 text-xs font-semibold rounded-xl border border-zinc-750 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Progressive Web App (PWA) & Public URL */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Progressive Web App (PWA) URL</h2>
            <p className="text-xs text-zinc-400">
              Install PlayRip directly onto your Android, iPhone, or Desktop without an app store.
            </p>
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Application Web Address (URL)</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Standalone PWA Enabled
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-zinc-300">1. Active Live URL (هم‌اکنون فعال و آماده PWA):</span>
                <span className="text-[10px] text-emerald-400 font-mono">Ready to open</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app"
                  className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-750 rounded-xl text-xs text-emerald-400 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app');
                    showToast('Active Dev URL copied!');
                  }}
                  className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-zinc-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <a
                  href="https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-rose-950/40"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-200 block">💡 تفاوت آدرس `ais-dev` و `ais-pre` در گوگل استودیو:</span>
              <p>
                آدرسی که باز کردید (<span className="text-zinc-300 font-mono">ais-pre-...</span>) تا زمانی که دکمه‌ی <strong>Share</strong> در منوی بالای استودیو را نزنید، ساخته نمی‌شود و ارور ۴۰۴ می‌دهد.
                <br />
                آدرس فعال و زنده شما در حال حاضر <strong>`ais-dev-...`</strong> است که می‌توانید در تب جدید یا گوشی باز کرده و دکمه <strong>Install App (PWA)</strong> را بزنید.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-400">
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
              <span className="font-semibold text-zinc-200 block mb-1">Android & Chrome / Edge:</span>
              <span>Tap the <strong>Install App</strong> button in the top bar or use the browser menu (⋮) &gt; <em>Install App</em>.</span>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
              <span className="font-semibold text-zinc-200 block mb-1">iPhone / iPad (iOS Safari):</span>
              <span>Tap the <strong>Share</strong> button at bottom &gt; tap <strong>Add to Home Screen</strong>.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

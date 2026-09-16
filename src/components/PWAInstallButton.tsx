import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // If running in installed standalone app, show subtle status badge
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>PWA Installed</span>
      </div>
    );
  }

  return (
    <>
      {/* Chromium / Android / Desktop Install */}
      {isInstallable ? (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : isIOS ? (
        /* iOS Safari Guide Button */
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-400" />
          <span>Install on iOS</span>
        </button>
      ) : (
        /* Standard Fallback / Standalone Web App Launcher */
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-750 transition-all"
          title="App URL & Installation"
        >
          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">PWA App</span>
        </button>
      )}

      {/* iOS Safari Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Install on iOS (iPhone/iPad)</h3>
                  <p className="text-xs text-zinc-400">Add to your Home Screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono shrink-0 mt-0.5">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone or iPad.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono shrink-0 mt-0.5">2</span>
                <span className="flex items-center gap-1">
                  Tap the <Share className="w-3.5 h-3.5 inline text-blue-400" /> <strong>Share</strong> button at the bottom bar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono shrink-0 mt-0.5">3</span>
                <span className="flex items-center gap-1">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline text-rose-400" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Share / PWA Details Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-zinc-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/icon.svg" alt="PlayRip" className="w-10 h-10 rounded-2xl" />
                <div>
                  <h3 className="text-sm font-semibold">PlayRip Music Cloud PWA</h3>
                  <p className="text-xs text-zinc-400">Web App URL & Direct Link</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-medium">Your Active Web App Address:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app"
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-emerald-400 font-mono focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app');
                    alert('Active Web App URL copied to clipboard!');
                  }}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition-colors"
                >
                  Copy
                </button>
                <a
                  href="https://ais-dev-wx5gbphljja4te3p64anja-307986322384.europe-west1.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-xl transition-colors"
                >
                  Open
                </a>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-1.5 text-xs text-zinc-400">
              <p className="font-semibold text-zinc-200">How to install as an App:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li><strong>Chrome / Edge / Android:</strong> Click the install icon in the URL address bar or select &quot;Install App&quot; in the browser menu.</li>
                <li><strong>iPhone / iPad (Safari):</strong> Tap Share button &gt; &quot;Add to Home Screen&quot;.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

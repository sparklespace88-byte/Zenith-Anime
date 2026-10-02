import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = url || window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('Link Copied!', 'Share link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Watch ${title} on ZenithAnime!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareReddit = () => {
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#0e111a] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">Share Anime</h3>
            <p className="text-xs text-neutral-400 truncate max-w-[200px]">{title}</p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 bg-[#131622] text-neutral-300 text-xs px-3 py-2 rounded-lg border border-white/10 select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <button
            onClick={shareTwitter}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition-all text-center font-medium"
          >
            Twitter / X
          </button>
          <button
            onClick={shareReddit}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition-all text-center font-medium"
          >
            Reddit
          </button>
          <button
            onClick={shareTelegram}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition-all text-center font-medium"
          >
            Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

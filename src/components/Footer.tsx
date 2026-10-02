import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="mt-16 sm:mt-20 border-t border-white/10 bg-[#08090e] text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Flame className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                Zenith<span className="text-purple-400">Anime</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ultra Pro Anime Streaming Experience. High bitrate playback, seasonal catalogs, episode tracking, and dedicated otaku community.
            </p>
          </div>

          {/* Navigation Mirrors */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-purple-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-purple-400 transition-colors">
                  Browse Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile')} className="hover:text-purple-400 transition-colors">
                  My Watchlist & Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Community & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-neutral-200 transition-colors">
                  About ZenithAnime
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-neutral-200 transition-colors">
                  Contact Support & Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Notices */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal & Information</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-neutral-200 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-neutral-200 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('dmca')} className="hover:text-neutral-200 transition-colors">
                  DMCA Compliance & Rights
                </button>
              </li>
              <li>
                <span className="text-[11px] text-neutral-500 block pt-1">
                  ZenithAnime does not store copyrighted files on its servers. All media streamed uses verified open source video samples and authorized streams.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 text-center sm:text-left text-xs">
          <p className="text-neutral-400 font-medium">
            &copy; {new Date().getFullYear()} ZenithAnime. Built with passion for anime fans worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

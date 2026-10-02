/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/Toast';
import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { AnimeDetailView } from './views/AnimeDetailView';
import { WatchView } from './views/WatchView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { DatabaseSqlView, AboutView, ContactView, TermsView, PrivacyView } from './views/StaticPages';

const MainContent: React.FC = () => {
  const { currentView, theme } = useApp();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'browse':
        return <BrowseView />;
      case 'anime-detail':
        return <AnimeDetailView />;
      case 'watch':
        return <WatchView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'database-sql':
        return <DatabaseSqlView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'terms':
      case 'dmca':
        return <TermsView />;
      case 'privacy':
        return <PrivacyView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#f4f6fb] text-slate-800' : 'bg-[#08090d] text-[#e0e6ed]'
    }`}>
      <Navbar
        isExternalSearchOpen={isMobileSearchOpen}
        onSearchOpenChange={setIsMobileSearchOpen}
      />
      <main className="flex-1 pb-16 lg:pb-0">
        {renderView()}
      </main>
      <Footer />
      <MobileBottomNav onOpenSearch={() => setIsMobileSearchOpen(true)} />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

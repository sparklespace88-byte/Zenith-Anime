import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MYSQL_DATABASE_SQL } from '../data/sqlDump';
import { Database, Download, Copy, Check, Send, Shield, Info, FileText } from 'lucide-react';

export const DatabaseSqlView: React.FC = () => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MYSQL_DATABASE_SQL);
    setCopied(true);
    showToast('SQL Copied', 'MySQL schema copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([MYSQL_DATABASE_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zenith_anime_database.sql';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded', 'zenith_anime_database.sql downloaded successfully.', 'success');
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl font-extrabold text-white font-display">
            MySQL Database & PHP Backend Architecture
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400">
          Complete production schema designed with relational integrity, foreign key constraints, indexes, and sample otaku records.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download zenith_anime_database.sql</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
        </button>
      </div>

      {/* PHP PDO Sample connection block */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>PHP PDO Database Connection Guide (config/db.php)</span>
        </h3>
        <p className="text-xs text-neutral-400">
          Use prepared statements and PDO for secure MySQL interactions without SQL injection risk:
        </p>
        <pre className="p-4 rounded-xl bg-[#090b10] border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`<?php
// config/db.php - ZenithAnime Secure PDO Connection
$host = '127.0.0.1';
$db   = 'zenith_anime_db';
$user = 'root';
$pass = ''; // Default XAMPP password is empty
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
    throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}`}
        </pre>
      </div>

      {/* SQL Script View */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
        <h3 className="text-sm font-bold text-white font-display">SQL DDL & Seed Script</h3>
        <pre className="p-4 rounded-xl bg-[#090b10] border border-white/10 text-neutral-300 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto select-all">
          {MYSQL_DATABASE_SQL}
        </pre>
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">About ZenithAnime</h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          ZenithAnime is a next-generation dark streaming platform built for anime purists, offering high-fidelity playback, comprehensive season archives, and interactive otaku discussions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Ultra Dark Design</h3>
          <p className="text-xs text-neutral-400">
            Tailored specifically for nocturnal viewing sessions without retina strain.
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
          <Database className="w-6 h-6 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Relational Architecture</h3>
          <p className="text-xs text-neutral-400">
            Robust data normalization ensuring lightning fast queries and seamless bookmarking.
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
          <Info className="w-6 h-6 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Community First</h3>
          <p className="text-xs text-neutral-400">
            In-depth episode reviews, ratings, and timestamped comment discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message Received', 'Thank you! Our support team will respond shortly.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-white font-display">Contact ZenithAnime Team</h1>
        <p className="text-xs text-neutral-400">
          Have feedback, catalog suggestions, or need assistance? Drop us a note.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-neutral-300 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eren Yeager"
              className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block font-medium text-neutral-300 mb-1">Your Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral-300 mb-1">Subject</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Anime request / Playback question"
            className="w-full bg-[#0d0f17] text-neutral-200 px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral-300 mb-1">Message</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your inquiry..."
            className="w-full bg-[#0d0f17] text-neutral-200 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Message</span>
        </button>
      </form>
    </div>
  );
};

export const TermsView: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white font-display mb-4">Terms of Service</h1>
      <p>
        By accessing ZenithAnime, you agree to comply with our community guidelines and reasonable usage standards.
      </p>
      <h3 className="text-base font-bold text-white pt-2 font-display">1. Acceptable Behavior</h3>
      <p>
        Reviews and comments must remain civil. Hate speech, excessive profanity, harassment, or malicious links will result in immediate suspension.
      </p>
      <h3 className="text-base font-bold text-white pt-2 font-display">2. Account Responsibility</h3>
      <p>
        Users are responsible for safeguarding their login credentials and any activity conducted under their profile.
      </p>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white font-display mb-4">Privacy Policy</h1>
      <p>
        ZenithAnime respects your privacy. We store user preferences, watch history, and watchlist bookmarks strictly to personalize your streaming experience.
      </p>
      <h3 className="text-base font-bold text-white pt-2 font-display">Data Collection & Storage</h3>
      <p>
        Playback timestamps are preserved to allow seamless resumption across sessions. No personal identifiable information is sold or transferred to advertising networks.
      </p>
    </div>
  );
};

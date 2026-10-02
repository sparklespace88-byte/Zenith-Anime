import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Anime, Episode } from '../types';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Tv,
  Check,
  Sparkles
} from 'lucide-react';

interface VideoPlayerProps {
  anime: Anime;
  currentEpisode: Episode;
  onEpisodeChange: (episodeNumber: number) => void;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  anime,
  currentEpisode,
  onEpisodeChange,
  isTheaterMode,
  onToggleTheater
}) => {
  const { recordWatchProgress, getWatchProgress, showToast } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [autoNext, setAutoNext] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Resume playback position on episode change
  useEffect(() => {
    const saved = getWatchProgress(anime.id, currentEpisode.episodeNumber);
    if (videoRef.current) {
      if (saved && saved.progressSeconds > 10 && saved.progressSeconds < (saved.durationSeconds - 20)) {
        videoRef.current.currentTime = saved.progressSeconds;
        setCurrentTime(saved.progressSeconds);
        showToast('Resumed Playback', `Continuing from ${formatTime(saved.progressSeconds)}`, 'info');
      } else {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [anime.id, currentEpisode.episodeNumber]);

  // Periodic watch progress recording
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        const cur = videoRef.current.currentTime;
        const dur = videoRef.current.duration || 1440;
        recordWatchProgress(anime.id, currentEpisode.episodeNumber, cur, dur);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [anime.id, currentEpisode.episodeNumber, isPlaying]);

  // Hide controls after 2.5 seconds of inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen) {
          setShowControls(false);
        }
      }, 2500);
    }
  };

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Volume Change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.85;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipSeconds(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipSeconds(-10);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Video Time Update & Ended handler
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    const hasNext = currentEpisode.episodeNumber < anime.totalEpisodes;
    if (autoNext && hasNext) {
      setCountdown(5);
    }
  };

  // Countdown for auto next
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      onEpisodeChange(currentEpisode.episodeNumber + 1);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, currentEpisode.episodeNumber, onEpisodeChange]);

  const cancelAutoNext = () => {
    setCountdown(null);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSettingsOpen(false);
  };

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    setIsSettingsOpen(false);
    showToast('Quality Changed', `Stream switched to ${quality} (HD)`, 'info');
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const hasPrev = currentEpisode.episodeNumber > 1;
  const hasNext = currentEpisode.episodeNumber < anime.totalEpisodes;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black overflow-hidden group select-none ${
        isFullscreen ? 'h-screen w-screen' : isTheaterMode ? 'aspect-[21/9] max-h-[80vh]' : 'aspect-video rounded-2xl shadow-2xl'
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={currentEpisode.videoUrl}
        poster={currentEpisode.thumbnail || anime.bannerImage}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Auto-Next Episode Floating Banner */}
      {countdown !== null && (
        <div className="absolute top-6 right-6 z-30 glass-panel p-4 rounded-xl border border-purple-500/50 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <div className="text-xs text-purple-300 font-semibold uppercase">Up Next in {countdown}s</div>
            <div className="text-sm font-bold text-white">Episode {currentEpisode.episodeNumber + 1}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCountdown(null);
                onEpisodeChange(currentEpisode.episodeNumber + 1);
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-md"
            >
              Play Now
            </button>
            <button
              onClick={cancelAutoNext}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-neutral-300 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && countdown === null && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-[2px] transition-all"
        >
          <div className="w-20 h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/60 transform hover:scale-110 active:scale-95 transition-all">
            <Play className="w-9 h-9 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Video Overlay Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-16 pb-4 px-4 sm:px-6 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar with seek track */}
        <div className="relative mb-3 flex items-center group/progress">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 transition-all focus:outline-none"
          />
        </div>

        {/* Lower Controls Row */}
        <div className="flex items-center justify-between gap-4 text-white">
          {/* Left: Play/Pause, Rewind, Forward, Volume, Time */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1 sm:p-1.5 hover:text-purple-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
            </button>

            <button
              onClick={() => skipSeconds(-10)}
              className="p-1.5 hover:text-purple-400 transition-colors hidden md:block"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipSeconds(10)}
              className="p-1.5 hover:text-purple-400 transition-colors hidden md:block"
              title="Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Episode Navigation */}
            <button
              onClick={() => onEpisodeChange(currentEpisode.episodeNumber - 1)}
              disabled={!hasPrev}
              className={`p-1 sm:p-1.5 transition-colors ${
                hasPrev ? 'hover:text-purple-400 text-white' : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Previous Episode"
            >
              <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => onEpisodeChange(currentEpisode.episodeNumber + 1)}
              disabled={!hasNext}
              className={`p-1 sm:p-1.5 transition-colors ${
                hasNext ? 'hover:text-purple-400 text-white' : 'text-neutral-600 cursor-not-allowed'
              }`}
              title="Next Episode"
            >
              <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={toggleMute}
                className="p-1 sm:p-1.5 hover:text-purple-400 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="hidden sm:block w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-[10px] sm:text-xs text-neutral-300 font-mono tabular-nums whitespace-nowrap">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-0.5 sm:mx-1 text-neutral-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Auto Next, Quality, Speed, Theater, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto Next Toggle */}
            <button
              onClick={() => setAutoNext(!autoNext)}
              className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all ${
                autoNext
                  ? 'border-purple-500/50 bg-purple-600/20 text-purple-300'
                  : 'border-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Auto-play Next Episode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto Next</span>
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 hover:text-purple-400 transition-colors ${
                  isSettingsOpen ? 'text-purple-400' : 'text-white'
                }`}
                aria-label="Player Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {isSettingsOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-52 glass-panel bg-[#0d0f17]/95 border border-white/10 rounded-xl p-3 shadow-2xl text-xs space-y-3 z-40">
                  {/* Quality Settings */}
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Quality
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {['1080p', '720p', '480p', '360p'].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQualityChange(q)}
                          className={`flex items-center justify-between px-2 py-1 rounded text-left ${
                            selectedQuality === q ? 'bg-purple-600 text-white font-bold' : 'hover:bg-white/5 text-neutral-300'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Playback Speed */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Playback Speed
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-1.5 py-1 text-center rounded ${
                            playbackSpeed === s ? 'bg-purple-600 text-white font-bold' : 'hover:bg-white/5 text-neutral-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theater Mode Toggle */}
            <button
              onClick={onToggleTheater}
              className={`p-1.5 hover:text-purple-400 transition-colors hidden sm:block ${
                isTheaterMode ? 'text-purple-400' : 'text-white'
              }`}
              title={isTheaterMode ? 'Default View' : 'Theater Mode'}
            >
              <Tv className="w-5 h-5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-purple-400 transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

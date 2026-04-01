"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Download, RotateCcw, RotateCw, Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { formatDuration } from "@/utils/format";

interface VideoPlayerProps {
  src: string;
  hlsSrc?: string;
  poster?: string;
  title?: string;
  downloadUrl?: string;
  onTimeUpdate?: (time: number) => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({ src, hlsSrc, poster, title, downloadUrl, onTimeUpdate, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const videoSrc = hlsSrc || src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported() && videoSrc.includes(".m3u8")) {
      const hls = new Hls({ enableWorker: true, startLevel: -1 });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { setIsLoading(false); if (autoPlay) video.play().catch(() => {}); });
      hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setError("Video load error."); });
      hlsRef.current = hls;
    } else {
      video.src = videoSrc;
      setIsLoading(false);
      if (autoPlay) video.play().catch(() => {});
    }
    return () => { hlsRef.current?.destroy(); hlsRef.current = null; };
  }, [videoSrc, autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const set = (fn: () => void) => fn;
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));
    video.addEventListener("waiting", () => setIsLoading(true));
    video.addEventListener("playing", () => setIsLoading(false));
    video.addEventListener("canplay", () => setIsLoading(false));
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));
    video.addEventListener("timeupdate", () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
      if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1));
    });
    video.addEventListener("volumechange", () => { setVolume(video.volume); setIsMuted(video.muted); });
    video.addEventListener("ended", () => setIsPlaying(false));
  }, [onTimeUpdate]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => { if (isPlaying) setShowControls(false); }, 3000);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }, []);

  const toggleMute = useCallback(() => { if (videoRef.current) videoRef.current.muted = !videoRef.current.muted; }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    !document.fullscreenElement ? containerRef.current.requestFullscreen() : document.exitFullscreen();
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = parseFloat(e.target.value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current; if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val; v.muted = val === 0;
  };

  const skip = (s: number) => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + s)); };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  if (error) return (
    <div className="relative aspect-video bg-ps5-surface rounded-xl flex items-center justify-center border border-ps5-border">
      <div className="text-center p-8">
        <p className="text-white font-semibold mb-2">Playback Error</p>
        <p className="text-ps5-text-muted text-sm">{error}</p>
        <button onClick={() => { setError(null); setIsLoading(true); }} className="mt-4 px-4 py-2 bg-ps5-blue text-white text-sm rounded-lg">Retry</button>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-video bg-black rounded-xl overflow-hidden select-none", isFullscreen && "rounded-none")}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      tabIndex={0}
    >
      <video ref={videoRef} className="w-full h-full object-contain" poster={poster} preload="metadata" playsInline onClick={togglePlay} />

      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 size={40} className="text-ps5-blue animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-ps5-blue/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-ps5-blue">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 pointer-events-none" />
            {title && <p className="absolute top-4 left-4 text-white font-semibold text-sm drop-shadow-lg truncate max-w-md">{title}</p>}
            <div className="relative z-10 px-4 pb-4 space-y-2">
              {/* Progress Bar */}
              <div className="relative h-1.5 group/bar cursor-pointer">
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                <div className="absolute top-0 left-0 h-full bg-white/30 rounded-full" style={{ width: `${bufferProgress}%` }} />
                <div className="absolute top-0 left-0 h-full bg-ps5-blue rounded-full" style={{ width: `${progress}%` }} />
                <input type="range" min="0" max={duration || 0} value={currentTime} step="0.1" onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="p-2 text-white hover:text-ps5-blue transition-colors">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button onClick={() => skip(-10)} className="p-1.5 text-white/70 hover:text-white transition-colors"><RotateCcw size={16} /></button>
                <button onClick={() => skip(10)} className="p-1.5 text-white/70 hover:text-white transition-colors"><RotateCw size={16} /></button>
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="p-1.5 text-white/70 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                    <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolume} className="w-20" />
                  </div>
                </div>
                <span className="text-white/80 text-xs font-mono ml-1">{formatDuration(currentTime)} / {formatDuration(duration)}</span>
                <div className="flex-1" />
                <div className="relative">
                  <button onClick={() => setShowSettings(!showSettings)} className="px-2 py-1 text-white/70 hover:text-white text-xs font-mono border border-white/20 rounded">
                    {playbackRate}x
                  </button>
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-full right-0 mb-2 bg-ps5-elevated border border-ps5-border rounded-xl overflow-hidden shadow-2xl">
                        <div className="p-2">
                          <p className="text-ps5-text-muted text-[10px] font-bold uppercase px-2 pb-1">Speed</p>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                            <button key={s} onClick={() => { if (videoRef.current) videoRef.current.playbackRate = s; setPlaybackRate(s); setShowSettings(false); }}
                              className={cn("block w-full text-left px-4 py-1.5 text-sm rounded-lg transition-colors", playbackRate === s ? "text-ps5-blue" : "text-ps5-text-secondary hover:text-white hover:bg-ps5-muted")}>
                              {s}x
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {downloadUrl && (
                  <a href={downloadUrl} download className="p-1.5 text-white/70 hover:text-white transition-colors" title="Download"><Download size={18} /></a>
                )}
                <button onClick={toggleFullscreen} className="p-1.5 text-white/70 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

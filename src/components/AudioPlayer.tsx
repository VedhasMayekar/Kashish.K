import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, SkipBack, Volume2, VolumeX } from "lucide-react";
import type { AudioClip } from "../data/memories";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const BARS = [10, 18, 26, 34, 22, 40, 30, 48, 36, 26, 44, 32, 20, 38, 28, 16];

export default function AudioPlayer({ clip }: { clip: AudioClip }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { try { await a.play(); setPlaying(true); } catch { setPlaying(false); } }
  };
  const restart = () => { const a = audioRef.current; if (a) { a.currentTime = 0; } };
  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted; setMuted(a.muted);
  };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    const v = Number(e.target.value);
    if (a) a.currentTime = v;
    setCurrent(v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
      className="glass-card mx-auto mt-10 w-full max-w-xl rounded-3xl p-5"
      aria-label={clip.label}
    >
      <audio ref={audioRef} src={clip.src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          type="button" onClick={toggle} aria-label={playing ? "Pause voice note" : "Play voice note"}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/70 to-fuchsia-400/40 text-white shadow-[0_0_28px_rgba(216,180,254,0.45)] transition hover:scale-105"
        >
          {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{clip.label}</p>
          <p className="text-xs text-violet-200/70">{clip.note}</p>
          <div className="mt-2 flex h-6 items-end gap-[3px]" aria-hidden="true">
            {BARS.map((hgt, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-violet-300/70"
                style={{
                  height: `${hgt}px`,
                  animation: playing ? `eq ${0.7 + (i % 5) * 0.13}s ease-in-out ${i * 0.05}s infinite alternate` : "none",
                }}
              />
            ))}
            <style>{`@keyframes eq { from { transform: scaleY(0.35); } to { transform: scaleY(1); } }`}</style>
          </div>
        </div>
      </div>

      <input
        type="range" min={0} max={duration || 0} step={0.1} value={current}
        onChange={seek} aria-label="Seek"
        className="mt-4 w-full accent-violet-400"
      />
      <div className="mt-1 flex items-center justify-between text-xs tabular-nums text-violet-200/80">
        <span>{fmt(current)}</span>
        <span>{fmt(duration)}</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={restart} aria-label="Back to start"
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-violet-100 transition hover:bg-white/10">
          <SkipBack className="h-3.5 w-3.5" /> Restart
        </button>
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-violet-100 transition hover:bg-white/10">
          {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {muted ? "Muted" : "Sound"}
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-violet-200/80">
          Volume
          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume" className="w-24 accent-violet-400"
          />
        </label>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import { BGM_FADE, BGM_SRC, BGM_VOLUME } from "@/lib/audio";

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden
      fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6.5 8.8H3.6a.6.6 0 0 0-.6.6v5.2c0 .3.3.6.6.6h2.9L11 19z" />
      {muted ? (
        <path d="m16 9.5 4.5 5m0-5-4.5 5" />
      ) : (
        <>
          <path d="M15.6 9.2a4 4 0 0 1 0 5.6" />
          <path d="M18.3 6.8a7.6 7.6 0 0 1 0 10.4" opacity="0.75" />
        </>
      )}
    </svg>
  );
}

/**
 * The music control, top right.
 *
 * Always starts silent — browsers block unprompted sound, and a wedding
 * invitation that blares at you is worse than one that waits. The volume eases
 * rather than snapping, and the button removes itself if the track is missing.
 */
export function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => () => {
    if (fade.current) window.clearInterval(fade.current);
  }, []);

  const rampTo = (target: number, onDone?: () => void) => {
    const el = audio.current;
    if (!el) return;
    if (fade.current) window.clearInterval(fade.current);
    const step = 40;
    const delta = (target - el.volume) / ((BGM_FADE * 1000) / step);
    fade.current = window.setInterval(() => {
      const next = el.volume + delta;
      const finished = delta > 0 ? next >= target : next <= target;
      el.volume = Math.min(1, Math.max(0, finished ? target : next));
      if (finished) {
        if (fade.current) window.clearInterval(fade.current);
        fade.current = null;
        onDone?.();
      }
    }, step);
  };

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;

    if (playing) {
      rampTo(0, () => el.pause());
      setPlaying(false);
      return;
    }

    try {
      el.volume = 0;
      await el.play();
      rampTo(BGM_VOLUME);
      setPlaying(true);
    } catch {
      // the browser refused, or there is nothing to play
      setAvailable(false);
    }
  };

  if (!available) return null;

  return (
    <>
      <audio
        ref={audio}
        src={BGM_SRC}
        loop
        preload="none"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        className={`music ${playing ? "music--on" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Turn the music off" : "Play the music"}
        title={playing ? "Turn the music off" : "Play the music"}
      >
        <SpeakerIcon muted={!playing} />
      </button>
    </>
  );
}

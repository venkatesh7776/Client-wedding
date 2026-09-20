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
 * What Chrome actually counts as the visitor being here. Scrolling is *not* on
 * the list — the spec grants a page leave to make noise on a press, a tap or a
 * key, and nothing else — so a guest who only ever spins the trackpad would sit
 * in silence if these were all we waited for.
 */
const ACTIVATING = ["pointerdown", "pointerup", "mousedown", "touchend", "keydown", "click"] as const;

/**
 * Tried as well, since a browser that already trusts the site will take them,
 * and a scroll is the first thing most guests do. A refusal here costs nothing.
 */
const OPPORTUNISTIC = ["wheel", "scroll", "touchstart", "touchmove"] as const;

const GESTURES = [...ACTIVATING, ...OPPORTUNISTIC];

/**
 * The music control, bottom right.
 *
 * It starts on: the track begins with the page and the icon says so. Browsers
 * block unprompted sound, so when the first attempt is refused the control
 * stays lit and the music starts the moment the visitor first presses, taps or
 * types — scrolling does not count, whatever it may look like. Turning it off
 * cancels the wait. The volume eases rather than snapping, and the
 * button removes itself if the track is missing.
 */
export function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [available, setAvailable] = useState(true);
  /* What the visitor has asked for, readable from a listener that was armed
     before they asked. The off switch sets it, and the waiting gesture obeys. */
  const wanted = useRef(true);

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

  const start = async () => {
    const el = audio.current;
    if (!el) return false;
    try {
      el.volume = 0;
      await el.play();
      rampTo(BGM_VOLUME);
      return true;
    } catch {
      return false;
    }
  };

  /* On by default: play at once, and when Chrome refuses, keep listening and
     try again on every gesture until one is accepted. The listeners come off
     only once sound is actually coming out — an earlier version dropped them
     on the first event it saw, which the opening's own scroll would eat, and
     then nothing was left to start the music at all. */
  useEffect(() => {
    let live = true;
    let trying = false;

    const attempt = () => {
      if (!live || trying || !wanted.current) return;
      trying = true;
      void start().then((ok) => {
        trying = false;
        if (ok) disarm();
      });
    };
    const arm = () =>
      GESTURES.forEach((e) => window.addEventListener(e, attempt, { passive: true }));
    const disarm = () => GESTURES.forEach((e) => window.removeEventListener(e, attempt));

    void start().then((ok) => {
      if (!ok && live) arm();
    });

    return () => {
      live = false;
      disarm();
      if (fade.current) window.clearInterval(fade.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;

    if (playing) {
      wanted.current = false;   // and no queued gesture may undo this
      rampTo(0, () => el.pause());
      setPlaying(false);
      return;
    }

    wanted.current = true;
    if (await start()) setPlaying(true);
    else setAvailable(false);
  };

  if (!available) return null;

  return (
    <>
      <audio
        ref={audio}
        src={BGM_SRC}
        loop
        preload="auto"
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

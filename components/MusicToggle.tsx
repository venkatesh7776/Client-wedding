"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BGM_FADE, BGM_SRC, BGM_VOLUME } from "@/lib/audio";
import { ENTER_EVENT } from "@/lib/music";

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
 * The gestures worth trying a start on. Chrome only counts a press, a tap or a
 * key as leave to make noise, but scrolling is what a guest does first and a
 * browser that already trusts the site will accept it, so it is tried too — a
 * refusal costs nothing now that no single event can spend the only chance.
 */
const GESTURES = [
  /* The opening of the invitation, which is the press this page is built
     around and the one that is meant to let the music in. */
  ENTER_EVENT,
  "pointerdown", "pointerup", "mousedown", "touchend", "keydown", "click",
  "wheel", "scroll", "touchstart", "touchmove",
] as const;

/**
 * The music control, bottom right.
 *
 * It asks to play from the first paint and the icon is lit to say so. Chrome
 * will refuse until the guest has pressed, tapped or typed something, so the
 * request stays standing and every gesture is another try, until one is taken.
 *
 * Two rules keep it honest. The icon follows the audio element's own play and
 * pause events, never an assumption about them — so it cannot sit there lit
 * over silence. And the button reads `el.paused` rather than that icon, so a
 * click while nothing is playing always starts the music, whatever the icon
 * happened to be showing.
 */
export function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const fade = useRef<number | null>(null);
  /** The guest's standing wish, which survives a browser's refusal to honour it. */
  const wanted = useRef(true);
  const [lit, setLit] = useState(true);
  const [missing, setMissing] = useState(false);

  const stopFade = () => {
    if (fade.current) window.clearInterval(fade.current);
    fade.current = null;
  };

  /**
   * Eases the volume, and concedes defeat gracefully where it cannot: iOS ignores
   * writes to `volume` altogether, so the ramp watches whether its own last
   * write took, and if it did not, finishes at once rather than spinning
   * forever — which is what used to leave the pause at the end of a fade-out
   * unreached, and the music unstoppable on an iPhone.
   */
  const rampTo = useCallback((target: number, onDone?: () => void) => {
    const el = audio.current;
    if (!el) return;
    stopFade();

    const stepMs = 40;
    const delta = (target - el.volume) / ((BGM_FADE * 1000) / stepMs);
    const finish = () => {
      stopFade();
      el.volume = target;   // ignored on iOS; correct everywhere else
      onDone?.();
    };

    if (!Number.isFinite(delta) || delta === 0) return finish();

    fade.current = window.setInterval(() => {
      const before = el.volume;
      const next = Math.min(1, Math.max(0, before + delta));
      el.volume = next;
      const moved = Math.abs(el.volume - before) > 0.0005;
      const arrived = delta > 0 ? next >= target : next <= target;
      if (arrived || !moved) finish();
    }, stepMs);
  }, []);

  /** Asks to play. True only if sound is genuinely coming out afterwards. */
  const start = useCallback(async () => {
    const el = audio.current;
    if (!el) return false;
    try {
      stopFade();
      el.volume = 0;
      await el.play();
    } catch {
      /* Refused (no user gesture yet) or interrupted by a pause. Either way the
         element itself is the authority on what happened, so fall through. */
    }
    if (el.paused) return false;
    rampTo(BGM_VOLUME);
    return true;
  }, [rampTo]);

  /* On by default: ask once, and if refused, keep asking on every gesture until
     one is taken. Gestures aimed at the control itself are left alone — the
     button's own click would otherwise start the music a moment before the
     click handler decided to stop it, and the track would blip on and off. */
  useEffect(() => {
    let live = true;
    let trying = false;

    const attempt = (event?: Event) => {
      if (!live || trying || !wanted.current) return;
      const target = event?.target;
      if (target instanceof Element && target.closest(".music")) return;
      trying = true;
      void start().then((ok) => {
        trying = false;
        if (ok) disarm();
      });
    };
    const arm = () =>
      GESTURES.forEach((e) => window.addEventListener(e, attempt, { passive: true }));
    const disarm = () => GESTURES.forEach((e) => window.removeEventListener(e, attempt));

    /* Armed before the first try, not after it: the opening attempt has to wait
       on the network, and a guest who clicks during that wait would otherwise
       find nothing listening. */
    arm();
    void start().then((ok) => {
      if (ok) disarm();
    });

    return () => {
      live = false;
      disarm();
      stopFade();
    };
  }, [start]);

  /**
   * The switch. What it does is decided by whether sound is actually playing,
   * not by what the icon shows — a guest who clicks a lit speaker over silence
   * means "I want to hear it", and gets exactly that.
   */
  const toggle = () => {
    const el = audio.current;
    if (!el) return;

    if (!el.paused) {
      wanted.current = false;   // no queued gesture may undo this
      setLit(false);
      rampTo(0, () => el.pause());
      return;
    }

    wanted.current = true;
    setLit(true);
    void start();
  };

  /* The file is missing or undecodable — the only reason to take the control
     away. A refused play is not: that is the browser waiting, not a fault. */
  if (missing) return null;

  const label = lit ? "Turn the music off" : "Play the music";

  return (
    <>
      <audio
        ref={audio}
        src={BGM_SRC}
        loop
        preload="auto"
        onPlay={() => setLit(wanted.current)}
        onPause={() => setLit(false)}
        onError={() => setMissing(true)}
      />
      <button
        type="button"
        className={`music ${lit ? "music--on" : ""}`}
        onClick={toggle}
        aria-pressed={lit}
        aria-label={label}
        title={label}
      >
        <SpeakerIcon muted={!lit} />
      </button>
    </>
  );
}

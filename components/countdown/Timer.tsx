"use client";

import { useEffect, useState } from "react";

import { COUNTDOWN_COPY, NIKKAH_AT } from "@/lib/countdown";

type Parts = [number, number, number, number];

const ZERO: Parts = [0, 0, 0, 0];

function remaining(target: number): Parts {
  const ms = target - Date.now();
  if (ms <= 0) return ZERO;
  const s = Math.floor(ms / 1000);
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
}

/**
 * The ticking clock itself — the widget, not the section around it.
 *
 * Renders zeroes on the server and on the first client paint — identical
 * markup either side, so hydration stays quiet — then starts ticking.
 */
export function Timer() {
  const target = new Date(NIKKAH_AT).getTime();
  const [parts, setParts] = useState<Parts>(ZERO);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setParts(remaining(target));
    setStarted(true);
    const id = window.setInterval(() => setParts(remaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const over = started && target - Date.now() <= 0;

  return (
    <div className="countdown" data-countdown>
      <div className="countdown__frame">
        <span className="countdown__corner countdown__corner--tl" aria-hidden />
        <span className="countdown__corner countdown__corner--tr" aria-hidden />
        <span className="countdown__corner countdown__corner--bl" aria-hidden />
        <span className="countdown__corner countdown__corner--br" aria-hidden />

        {/* The heading above the frame already says what is being counted, so
            the digits are left to speak for themselves. The line returns only
            once the count is done and there is something else to say. */}
        {over && <p className="countdown__title">{COUNTDOWN_COPY.passed}</p>}

        {!over && (
          <ol className="countdown__units">
            {parts.map((value, i) => (
              <li className="countdown__unit" key={COUNTDOWN_COPY.units[i]}>
                <span className="countdown__value">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="countdown__label">{COUNTDOWN_COPY.units[i]}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

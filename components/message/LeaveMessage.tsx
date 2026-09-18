"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { ASSETS } from "@/lib/assets";
import { MESSAGE_COPY, MESSAGE_TO } from "@/lib/messages";

import { Ornament } from "../meet/Ornament";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLAY_ONCE = "play none none none";
const EASE = "power2.out";

/**
 * Section 7 — Leave a Message.
 *
 * Night falls again here: the navy skyline behind, the note written on a sheet
 * of cream stationery laid over it.
 *
 * There is no back end, so the note is handed to the guest's own mail app with
 * everything already written. That is honest: nothing is swallowed by a form
 * that goes nowhere. Set MESSAGE_TO and it is addressed for them too.
 */
export function LeaveMessage() {
  const root = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const nameMissing = touched && name.trim() === "";
  const noteMissing = touched && note.trim() === "";

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (name.trim() === "" || note.trim() === "") return;

    const subject = `A message for Sahla & Abdul Basith — from ${name.trim()}`;
    const body = `${note.trim()}\n\n— ${name.trim()}`;
    window.location.href = `mailto:${MESSAGE_TO ?? ""}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const head = q("[data-message-head] > *:not([data-ornament])");
      gsap.set(head, { opacity: 0, y: 22 });
      gsap.set(q("[data-ornament-rule]"), { opacity: 0, scaleX: 0 });
      gsap.set(q("[data-ornament-star]"), { opacity: 0 });
      gsap.set(q("[data-message-card]"), { opacity: 0, y: 26 });

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 78%", toggleActions: PLAY_ONCE },
        })
        .to(head, { opacity: 1, y: 0, duration: 1.0, ease: EASE, stagger: 0.14 }, 0)
        .to(q("[data-ornament-rule]"), { opacity: 1, scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.35)
        .to(q("[data-ornament-star]"), { opacity: 1, duration: 0.65 }, 0.6)
        .to(q("[data-message-card]"), { opacity: 1, y: 0, duration: 1.0, ease: EASE }, 0.5);
    },
    { scope: root },
  );

  return (
    <section className="message" ref={root} aria-labelledby="message-title">
      <div className="message__backdrop" aria-hidden>
        <img className="message__bgImg" src={ASSETS.messageBackground} alt="" />
        <span className="message__scrim" />
      </div>

      <div className="message__inner">
      <header className="message__head" data-message-head>
        <h2 className="message__title" id="message-title">
          {MESSAGE_COPY.title}
        </h2>
        <Ornament className="message__ornament" />
        <p className="message__intro">{MESSAGE_COPY.intro}</p>
      </header>

      <form className="message__card" data-message-card onSubmit={send} noValidate>
        <p className="message__cardTitle">{MESSAGE_COPY.cardTitle}</p>

        <label className="message__field">
          <span className="message__label">{MESSAGE_COPY.nameLabel}</span>
          <input
            className="message__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={MESSAGE_COPY.nameLabel}
            aria-invalid={nameMissing}
            aria-describedby={nameMissing ? "message-name-error" : undefined}
          />
          {nameMissing && (
            <span className="message__error" id="message-name-error">
              {MESSAGE_COPY.nameError}
            </span>
          )}
        </label>

        <label className="message__field">
          <span className="message__label">Your Message</span>
          <textarea
            className="message__input message__input--area"
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={MESSAGE_COPY.messageLabel}
            aria-invalid={noteMissing}
            aria-describedby={noteMissing ? "message-note-error" : undefined}
          />
          {noteMissing && (
            <span className="message__error" id="message-note-error">
              {MESSAGE_COPY.messageError}
            </span>
          )}
        </label>

        <button className="message__cta" type="submit">
          {MESSAGE_COPY.cta}
        </button>

        <p className="message__status" role="status">
          {sent ? MESSAGE_COPY.sent : ""}
        </p>
      </form>
      </div>
    </section>
  );
}

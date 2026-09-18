import { ASSETS } from "@/lib/assets";
import type { Celebration, Detail } from "@/lib/celebrations";

import { Star } from "../meet/Ornament";
import { CalendarIcon, ClockIcon, PinIcon, RingsIcon } from "./Icons";

function iconFor(label: Detail["label"]) {
  if (label === "Date") return <CalendarIcon />;
  if (label === "Time") return <ClockIcon />;
  if (label === "Location") return <PinIcon />;
  return <RingsIcon />;
}

/**
 * One celebration. The card itself is finished artwork — frame, photograph and
 * all — with a blank panel across its lower half. The text is laid into that
 * panel, whose bounds were measured from the art: it starts 47.9% down and is
 * inset 7.3% either side.
 */
export function EventCard({ event, side }: { event: Celebration; side: "left" | "right" }) {
  return (
    <article className={`event event--${side}`} data-event={event.index}>
      <span className="event__node" aria-hidden data-event-node>
        <Star size={14} />
      </span>

      <div className="event__card" data-event-card>
        <img className="event__art" src={event.art} alt="" aria-hidden />

        {/* Cover: sits over the card, then parts down the middle — the top half
            lifts away, the bottom half drops — to reveal the celebration. */}
        <div className="event__cover" data-cover aria-hidden>
          <span className="event__coverHalf event__coverHalf--top" data-cover-top>
            <img src={ASSETS.thumbnail} alt="" />
          </span>
          <span className="event__coverHalf event__coverHalf--bottom" data-cover-bottom>
            <img src={ASSETS.thumbnail} alt="" />
          </span>
          <span className="event__coverSeam" />
        </div>

        <div className="event__plate">
          <h3 className="event__title">
            <span className="event__titleNum">{event.index}</span>
            <span className="event__titleDot" aria-hidden>
              ·
            </span>
            {event.title}
          </h3>

          <dl className="event__details">
            {event.details.map((d) => (
              <div className="event__row" key={d.label}>
                <dt>
                  <span className="event__rowIcon">{iconFor(d.label)}</span>
                  {d.label}
                </dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}

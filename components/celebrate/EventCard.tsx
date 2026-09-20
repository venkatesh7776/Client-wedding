import type { Celebration } from "@/lib/celebrations";

/**
 * One celebration, in the same stationery language as the venue cards: a gold
 * frame with a second hairline inside it, the inked illustration standing free
 * at its head, then the details as label-and-value on one line each.
 */
export function EventCard({ event }: { event: Celebration }) {
  const rows: [string, string][] = [
    ["Date", event.date],
    ["Time", event.time],
    ...(event.note ? ([["Nikkah", event.note.replace("Nikkah at ", "")]] as [string, string][]) : []),
    ["Venue", event.venue],
  ];

  return (
    <article className="event" data-event={event.index} data-event-card>
      <span className="event__hairline" aria-hidden />
      <span className="event__jali" aria-hidden />

      <span className="event__corner event__corner--tl" aria-hidden />
      <span className="event__corner event__corner--tr" aria-hidden />
      <span className="event__corner event__corner--bl" aria-hidden />
      <span className="event__corner event__corner--br" aria-hidden />

      {/* decorative: the title beneath it already names the celebration */}
      <img
        className="event__crest"
        loading="lazy"
        decoding="async"
        src={event.icon}
        width={event.iconSize.width}
        height={event.iconSize.height}
        alt=""
        aria-hidden
      />

      <h3 className="event__title">
        <span className="event__index">{event.index}</span>
        <span className="event__dot" aria-hidden>
          ·
        </span>
        {event.title}
      </h3>

      <span className="event__rule" aria-hidden>
        <span className="event__ruleLine" />
        <span className="event__ruleGem" />
        <span className="event__ruleLine" />
      </span>

      <dl className="event__details">
        {rows.map(([label, value]) => (
          <div className="event__row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

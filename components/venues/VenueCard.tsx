import type { Venue } from "@/lib/venues";
import { VENUE_COPY } from "@/lib/venues";

import { PinIcon } from "../celebrate/Icons";

/**
 * One venue. The card is finished artwork — arch frame, illustration, corner
 * flourishes and the jali band along the foot — with a blank panel across its
 * lower half. The text is laid into that panel, whose bounds were measured
 * from the art: it begins 49% down and is inset 15% either side.
 */
export function VenueCard({ venue }: { venue: Venue }) {
  const pending = !venue.mapUrl;

  return (
    <article
      className={`venue ${venue.primary ? "venue--primary" : ""} ${pending ? "venue--pending" : ""}`}
      data-venue
    >
      <img className="venue__art" src={venue.art} alt="" aria-hidden />

      <div className="venue__plate">
        <h3 className="venue__occasion" data-venue-line>
          {venue.label}
        </h3>

        <span className="venue__divider" aria-hidden data-venue-divider>
          <span className="venue__dividerRule" />
          <span className="venue__dividerGem" />
          <span className="venue__dividerRule" />
        </span>

        <p className="venue__name" data-venue-line>
          {venue.name ?? VENUE_COPY.pendingName}
        </p>

        {venue.address.length > 0 ? (
          <address className="venue__address" data-venue-line>
            <span className="venue__addressPin" aria-hidden>
              <PinIcon size={16} />
            </span>
            <span className="venue__addressLines">
              {venue.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </address>
        ) : (
          <p className="venue__addressPending" data-venue-line>
            {VENUE_COPY.pendingAddress}
          </p>
        )}

        {venue.mapUrl ? (
          <a
            className="venue__cta"
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-venue-cta
          >
            <PinIcon size={14} />
            {VENUE_COPY.cta}
            <span aria-hidden>→</span>
          </a>
        ) : (
          <span className="venue__cta venue__cta--pending" aria-disabled="true" data-venue-cta>
            <PinIcon size={14} />
            {VENUE_COPY.pendingCta}
          </span>
        )}
      </div>
    </article>
  );
}

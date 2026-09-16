import type { Person } from "@/lib/family";

import { ArchPortrait } from "./ArchPortrait";

export function PersonIntro({ person, side }: { person: Person; side: "bride" | "groom" }) {
  return (
    <article className={`person person--${side}`} data-person={side}>
      <ArchPortrait
        src={person.portrait}
        alt={`Portrait of ${person.name}`}
        label={side === "bride" ? "Bride" : "Groom"}
        side={side}
      />

      <div className="person__info" data-person-info>
        <p className="person__role" data-info-line>
          {person.role}
        </p>
        <h3 className="person__name" data-info-line>
          {person.name}
        </h3>
        <p className="person__relation" data-info-line>
          {person.relation}
        </p>
        <p className="person__parents" data-info-line>
          <span>{person.parents[0]}</span>
          <span className="person__amp" aria-label="and">
            &amp;
          </span>
          <span>{person.parents[1]}</span>
        </p>
      </div>
    </article>
  );
}

import { SECTION, type Person } from "@/lib/family";

import { ArchFrame } from "./ArchFrame";

/**
 * One half of the couple. There is no portrait: the carved arch that used to
 * hold one now frames the words themselves, which is what the section is
 * actually about — the name, then the parentage, then the siblings.
 */
export function PersonIntro({ person, side }: { person: Person; side: "bride" | "groom" }) {
  return (
    <article className={`person person--${side}`} data-person={side}>
      <ArchFrame>
        <p className="person__role" data-info-line>
          {person.role}
        </p>

        <h3 className="person__name" data-info-line>
          {person.name}
        </h3>

        <span className="person__rule person__rule--top" aria-hidden data-info-line />

        <p className="person__relation" data-info-line>
          {person.relation}
        </p>

        <p className="person__parents" data-info-line>
          {person.parents[0]}
          <span className="person__amp" aria-label="and">
            &amp;
          </span>
          {person.parents[1]}
        </p>

        <span className="person__rule" aria-hidden data-info-line />

        <ul className="person__siblings" data-info-line>
          {person.siblings.map((s) => (
            <li key={s.name}>
              {s.name}
              {s.spouse && (
                <span className="person__spouse">
                  {" — "}
                  {SECTION.spouseOf} {s.spouse}
                </span>
              )}
            </li>
          ))}
        </ul>
      </ArchFrame>
    </article>
  );
}

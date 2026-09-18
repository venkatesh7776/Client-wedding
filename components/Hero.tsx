import { ASSETS } from "@/lib/assets";
import { COPY } from "@/lib/copy";

/**
 * Hero — Figma node 73:309, the 100% composition.
 * Hero 25% and Hero 50% (nodes 73:190 / 73:251) are not separate markup: they
 * are the states this one tree passes through on the master timeline.
 */
export function Hero() {
  return (
    <section className="hero" aria-label="Wedding invitation">
      {/* Palace / hero background + sky gradient */}
      <div className="hero__bg" data-hero-bg>
        <div className="hero__bgClip" data-hero-clip>
          <img className="hero__bgImg" data-hero-image src={ASSETS.heroBackground} alt="" aria-hidden />
          <div className="hero__sky" />
        </div>
      </div>

      {/* Figma stacks these back-to-front as: background, Couple, Lamp 1,
          Lamp 2, Pillar 1, Pillar 2, text, date/location — so the pillar vines
          occlude the lamp chains. `.hero__stage` is transformed and therefore
          its own stacking context, so the coordinate space is split in two and
          the pillars sit between the halves. */}
      <div className="hero__stage hero__stage--back">
        {/* Couple */}
        <div className="hero__couple" data-couple>
          <img src={ASSETS.couple} alt={`${COPY.bride} and ${COPY.groom}`} />
        </div>

        {/* Lamp 1 */}
        <div className="hero__lamp hero__lamp--1" data-lamp="1">
          <img src={ASSETS.lamp} alt="" aria-hidden />
        </div>

        {/* Lamp 2 */}
        <div className="hero__lamp hero__lamp--2" data-lamp="2">
          <img src={ASSETS.lamp} alt="" aria-hidden />
        </div>
      </div>

      {/* Pillar 1 */}
      <div className="hero__pillar hero__pillar--left" data-pillar="left">
        <div className="hero__pillarInner">
          <picture>
            <source media="(max-width: 860px)" srcSet={ASSETS.pillarMobile} />
            <img src={ASSETS.pillar} alt="" aria-hidden />
          </picture>
        </div>
      </div>

      {/* Pillar 2 — same source, mirrored */}
      <div className="hero__pillar hero__pillar--right" data-pillar="right">
        <div className="hero__pillarInner">
          <picture>
            <source media="(max-width: 860px)" srcSet={ASSETS.pillarMobile} />
            <img src={ASSETS.pillar} alt="" aria-hidden />
          </picture>
        </div>
      </div>

      <div className="hero__stage hero__stage--front">
        <div className="hero__text">
          <p className="bismillah" data-reveal dir="rtl" lang="ar">
            {COPY.bismillah}
          </p>

          <p className="announcement" data-reveal>
            {COPY.announcement}
          </p>

          <div className="names">
            <p className="name name--first" data-reveal>
              {COPY.bride}
            </p>

            <div className="amp" data-reveal>
              <img className="amp__rule amp__rule--left" src={ASSETS.dividerLeft} alt="" aria-hidden />
              <span className="amp__mark">&amp;</span>
              <img className="amp__rule amp__rule--right" src={ASSETS.dividerRight} alt="" aria-hidden />
            </div>

            <p className="name name--last" data-reveal>
              {COPY.groom}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

import { ASSETS } from "@/lib/assets";
import { COPY } from "@/lib/copy";

/**
 * Loader — Figma node 112:42.
 *
 * The verse and its translation settle in first; only then does the verse
 * itself become the progress indicator, filling with gold from the left. The
 * artwork is used
 * as a mask so the same glyphs can be painted twice, white beneath and gold
 * above, with only the gold layer's clip animating.
 */
export function Loader() {
  return (
    <div className="loader" data-loader>
      <img className="loader__bg" src={ASSETS.loaderBackground} alt="" aria-hidden />

      <div className="loader__content">
        <div
          className="verse"
          data-loader-line
          role="img"
          aria-label={`${COPY.verseMeaning} ${COPY.verseReference}`}
          style={{ "--verse": `url("${ASSETS.verse}")` } as React.CSSProperties}
        >
          <span className="verse__layer verse__base" />
          <span className="verse__layer verse__fill" data-verse-fill />
        </div>

        <p className="loader__meaning" data-loader-line>{COPY.verseMeaning}</p>
        <p className="loader__reference" data-loader-line>{COPY.verseReference}</p>
      </div>
    </div>
  );
}

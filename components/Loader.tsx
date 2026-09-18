import { ASSETS } from "@/lib/assets";
import { COPY } from "@/lib/copy";

import { VerseArt } from "./VerseArt";

/**
 * Loader — Figma node 112:42.
 *
 * The verse and its translation settle in first; only then does the verse
 * itself become the progress indicator, filling with gold from the left. Its
 * outlines are inlined rather than fetched, so they are on screen with the
 * first paint — a loading screen that has to load is no loading screen.
 */
export function Loader() {
  return (
    <div className="loader" data-loader>
      <img className="loader__bg" src={ASSETS.loaderBackground} alt="" aria-hidden />

      <div className="loader__content">
        <div className="verse__frame" data-loader-line role="img" aria-label={`${COPY.verseMeaning} ${COPY.verseReference}`}>
          <VerseArt />
        </div>

        <p className="loader__meaning" data-loader-line>{COPY.verseMeaning}</p>
        <p className="loader__reference" data-loader-line>{COPY.verseReference}</p>
      </div>
    </div>
  );
}

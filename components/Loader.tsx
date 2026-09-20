import { ASSETS } from "@/lib/assets";
import { COPY } from "@/lib/copy";

/**
 * Loader — Figma node 112:42.
 *
 * The verse and its translation settle in first; only then does the verse
 * itself become the progress indicator, filling with gold from the left.
 *
 * It is set in Amiri — a classical naskh cut for Qur'anic typesetting, so the
 * tashkeel sit properly — rather than the flattened outlines it used to be.
 * As live text it also costs nothing to fetch.
 *
 * Nothing proceeds on its own: the verse fills as the first screen loads, and
 * then the guest is asked to open the invitation. That press is what lets the
 * music in — a browser grants a page leave to make sound on a gesture and on
 * nothing else — so the gate is not a formality, it is the thing that makes
 * the music possible at all.
 */
export function Loader({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="loader" data-loader>
      <img className="loader__bg" src={ASSETS.loaderBackground} alt="" aria-hidden />

      <div className="loader__content">
        <p className="verse" data-loader-line dir="rtl" lang="ar">
          <span className="verse__base">{COPY.verse}</span>
          {/* the same words again, gold, revealed by a clip the timeline opens */}
          <span className="verse__fill" data-verse-fill aria-hidden>
            {COPY.verse}
          </span>
        </p>

        <p className="loader__meaning" data-loader-line>{COPY.verseMeaning}</p>
        <p className="loader__reference" data-loader-line>{COPY.verseReference}</p>

        {/* Hidden until the first screen is ready; the timeline reveals it. */}
        <button type="button" className="enter" data-enter onClick={onEnter}>
          <span className="enter__label">{COPY.enter}</span>
        </button>
      </div>
    </div>
  );
}

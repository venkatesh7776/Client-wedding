import { ASSETS } from "@/lib/assets";
import { COPY } from "@/lib/copy";

/**
 * Loader — Figma node 73:217.
 * The gold Loader Ring is the only moving part; it sweeps one clockwise turn
 * and that completion is what hands over to the hero.
 */
export function Loader() {
  return (
    <div className="loader" data-loader>
      <img className="loader__bg" src={ASSETS.loaderBackground} alt="" aria-hidden />

      <p className="loader__verse" dir="rtl" lang="ar">
        {COPY.verse}
      </p>

      <div className="loader__ring">
        <div className="loader__portrait">
          <img src={ASSETS.loaderCouple} alt="" aria-hidden />
        </div>

        {/* rotor spins, flip lives on the child so clockwise stays clockwise */}
        <div className="loader__rotor" data-ring>
          <div className="loader__rotorFlip">
            <img className="loader__arc" src={ASSETS.loaderRing} alt="" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

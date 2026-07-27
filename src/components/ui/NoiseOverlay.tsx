/**
 * Full-page animated SVG-noise grain. The <feTurbulence> seed shifts via CSS
 * keyframes for a subtle live-grain shimmer. Purely decorative.
 */
export default function NoiseOverlay() {
  return (
    <div className="grain-overlay" aria-hidden>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          >
            <animate
              attributeName="seed"
              values="1;7;3;9;2;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

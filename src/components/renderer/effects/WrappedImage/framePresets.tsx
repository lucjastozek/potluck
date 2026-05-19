import type { FramePreset, PresetDef } from "./FramedImage";
import { WobbleFilter, FrameShell } from "./framePresetsHelpers";

export const FRAME_PRESETS: Record<FramePreset, PresetDef> = {
  rainbow: {
    label: "🌈 Rainbow",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={8} />
            <linearGradient
              id={`lg-${uid}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--abspink)" />
              <stop offset="20%" stopColor="var(--abspeach)" />
              <stop offset="40%" stopColor="var(--absyellow)" />
              <stop offset="60%" stopColor="var(--absgreen)" />
              <stop offset="80%" stopColor="var(--absblue)" />
              <stop offset="100%" stopColor="var(--absdarkPurple)" />
            </linearGradient>
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{
            backgroundColor: "var(--abspink)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, var(--abspink), var(--abspeach), var(--absyellow), var(--absgreen), var(--absblue), var(--absdarkPurple))`,
            }}
          />
        </FrameShell>
      </>
    ),
  },
  zigzag: {
    label: "⚡ Zigzag",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={6} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{ backgroundColor: "var(--absgreen)" }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <pattern
                id={`zigzag-${uid}`}
                width="20"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <polyline
                  points="0,8 5,0 10,8 15,0 20,8"
                  fill="none"
                  style={{ stroke: "var(--abscherry)", strokeWidth: 2 }}
                />
                <polyline
                  points="0,18 5,10 10,18 15,10 20,18"
                  fill="none"
                  style={{ stroke: "var(--absorange)", strokeWidth: 2 }}
                />
                <polyline
                  points="0,28 5,20 10,28 15,20 20,28"
                  fill="none"
                  style={{ stroke: "var(--absyellow)", strokeWidth: 2 }}
                />
                <polyline
                  points="0,38 5,30 10,38 15,30 20,38"
                  fill="none"
                  style={{ stroke: "var(--absblue)", strokeWidth: 2 }}
                />
                <polyline
                  points="0,48 5,40 10,48 15,40 20,48"
                  fill="none"
                  style={{ stroke: "var(--absdarkPurple)", strokeWidth: 2 }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#zigzag-${uid})`} />
          </svg>
        </FrameShell>
      </>
    ),
  },
  dots: {
    label: "🟣 Dots",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={9} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{ backgroundColor: "var(--absyellow)" }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 60 60"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <pattern
                id={`dots-${uid}`}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.5" cy="1.5" r="1.2" fill="var(--abscherry)" />
                <circle cx="4.5" cy="4.5" r="1.2" fill="var(--abscherry)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${uid})`} />
          </svg>
        </FrameShell>
      </>
    ),
  },
  stripes: {
    label: "🎨 Stripes",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={7} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{
            background: `repeating-linear-gradient(
            45deg,
            var(--abscherry) 0px, var(--abscherry) 8px,
            var(--absyellow) 8px, var(--absyellow) 16px,
            var(--absgreen) 16px, var(--absgreen) 24px,
            var(--absblue) 24px, var(--absblue) 32px
          )`,
          }}
        />
      </>
    ),
  },
  squiggles: {
    label: "〰️ Squiggles",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={10} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{ backgroundColor: "var(--oppbg)" }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <pattern
                id={`squiggles-${uid}`}
                width="20"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0,8 Q5,3 10,8 Q15,13 20,8"
                  fill="none"
                  style={{
                    stroke: "var(--abscherry)",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                  }}
                />
                <path
                  d="M0,18 Q5,13 10,18 Q15,23 20,18"
                  fill="none"
                  style={{
                    stroke: "var(--absorange)",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                  }}
                />
                <path
                  d="M0,28 Q5,23 10,28 Q15,33 20,28"
                  fill="none"
                  style={{
                    stroke: "var(--absgreen)",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                  }}
                />
                <path
                  d="M0,38 Q5,33 10,38 Q15,43 20,38"
                  fill="none"
                  style={{
                    stroke: "var(--absblue)",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                  }}
                />
                <path
                  d="M0,48 Q5,43 10,48 Q15,53 20,48"
                  fill="none"
                  style={{
                    stroke: "var(--absdarkPurple)",
                    strokeWidth: 1.5,
                    strokeLinecap: "round",
                  }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#squiggles-${uid})`} />
          </svg>
        </FrameShell>
      </>
    ),
  },
  stars: {
    label: "⭐ Stars",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={8} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{ backgroundColor: "var(--absdarkPurple)" }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 60 60"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <pattern
                id={`stars-${uid}`}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="1,1.2 1.3,2.2 2.4,2.2 1.5,2.8 1.8,3.8 1,3.2 0.2,3.8 0.5,2.8 -0.4,2.2 0.7,2.2"
                  fill="var(--absyellow)"
                />
                <polygon
                  points="5,5 5.3,5.8 6.2,5.8 5.5,6.3 5.8,7.1 5,6.6 4.2,7.1 4.5,6.3 3.8,5.8 4.7,5.8"
                  fill="var(--absyellow)"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#stars-${uid})`} />
          </svg>
        </FrameShell>
      </>
    ),
  },
  checkers: {
    label: "♟ Checkers",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={5} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{ backgroundColor: "var(--oppbg)" }}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 32 32"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          >
            <defs>
              <pattern
                id={`checkers-${uid}`}
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <rect width="2" height="2" fill="var(--abscherry)" />
                <rect
                  x="2"
                  y="2"
                  width="2"
                  height="2"
                  fill="var(--abscherry)"
                />
                <rect x="2" width="2" height="2" fill="var(--oppbg)" />
                <rect y="2" width="2" height="2" fill="var(--oppbg)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#checkers-${uid})`} />
          </svg>
        </FrameShell>
      </>
    ),
  },
  neon: {
    label: "🌟 Neon",
    Frame: ({ uid, shape }) => (
      <>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <WobbleFilter uid={uid} scale={6} />
          </defs>
        </svg>
        <FrameShell
          uid={uid}
          shape={shape}
          style={{
            background: `repeating-linear-gradient(
            90deg,
            var(--absdarkPurple) 0px, var(--absdarkPurple) 16px,
            var(--absdarkBlue) 16px, var(--absdarkBlue) 32px,
            var(--absorange) 32px, var(--absorange) 48px,
            var(--absgreen) 48px, var(--absgreen) 64px
          )`,
          }}
        />
      </>
    ),
  },
};

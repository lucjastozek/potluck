import type { ReactNode } from "react";
import type { FrameShape } from "@/components/renderer/effects/WrappedImage/FramedImage";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";

function wobbleClassName(scale: number): string {
  switch (scale) {
    case 5:
      return styles.wobble5;
    case 6:
      return styles.wobble6;
    case 7:
      return styles.wobble7;
    case 8:
      return styles.wobble8;
    case 9:
      return styles.wobble9;
    case 10:
      return styles.wobble10;
    default:
      return "";
  }
}

export function WobbleFilter({
  id,
  scale = 7,
}: {
  id: string;
  scale?: number;
}) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.045"
        numOctaves="4"
        seed="7"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

export function FrameShell({
  shape,
  className,
  children,
}: {
  shape: FrameShape;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${styles.shellBase} ${styles[shape]} ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}

export function FrameCanvas({
  shape,
  wobbleScale,
  shellClassName,
  children,
}: {
  shape: FrameShape;
  wobbleScale: number;
  shellClassName?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <svg width="0" height="0" className={styles.hiddenSvg}>
        <defs>
          <WobbleFilter id={`wobble-${wobbleScale}`} scale={wobbleScale} />
        </defs>
      </svg>
      <FrameShell
        shape={shape}
        className={`${wobbleClassName(wobbleScale)} ${shellClassName ?? ""}`.trim()}
      >
        {children}
      </FrameShell>
    </>
  );
}

export function PatternFrame({
  shape,
  wobbleScale,
  shellClassName,
  viewBox,
  patternId,
  patternWidth,
  patternHeight,
  children,
}: {
  shape: FrameShape;
  wobbleScale: number;
  shellClassName?: string;
  viewBox: string;
  patternId: string;
  patternWidth: string;
  patternHeight: string;
  children: ReactNode;
}) {
  return (
    <FrameCanvas
      shape={shape}
      wobbleScale={wobbleScale}
      shellClassName={shellClassName}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={viewBox}
        preserveAspectRatio="none"
        className={styles.patternSvg}
      >
        <defs>
          <pattern
            id={patternId}
            width={patternWidth}
            height={patternHeight}
            patternUnits="userSpaceOnUse"
          >
            {children}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </FrameCanvas>
  );
}

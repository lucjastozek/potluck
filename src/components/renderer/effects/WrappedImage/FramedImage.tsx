import { useMemo } from "react";
import { FRAME_PRESETS } from "@/components/renderer/effects/WrappedImage/framePresets";

export type FrameShape = "rectangle" | "circle" | "star" | "blob";
export type FramePreset =
  | "rainbow"
  | "zigzag"
  | "dots"
  | "stripes"
  | "squiggles"
  | "stars"
  | "checkers"
  | "neon";

function useUid() {
  return useMemo(() => Math.random().toString(36).slice(2, 8), []);
}

function starClipPoints(n: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(
      `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`,
    );
  }
  return `polygon(${pts.join(", ")})`;
}

const SHAPE_CLIP: Record<FrameShape, React.CSSProperties> = {
  rectangle: { borderRadius: "6px" },
  circle: { borderRadius: "50%" },
  star: { clipPath: starClipPoints(6, 48, 24) },
  blob: { borderRadius: "42% 58% 55% 45% / 48% 42% 58% 52%" },
};

// Each preset returns an SVG <defs> string + a fill/style descriptor for the frame div
export type PresetDef = {
  label: string;
  // Returns JSX for the frame layer given the uid
  Frame: React.FC<{ uid: string; shape: FrameShape }>;
};

const PAD = 12; // frame thickness in px

interface FramedImageProps {
  src: string;
  alt: string;
  framePreset: FramePreset;
  frameShape: FrameShape;
}

export function FramedImage({
  src,
  alt,
  framePreset,
  frameShape,
}: FramedImageProps) {
  const uid = useUid();
  const { Frame } = FRAME_PRESETS[framePreset];
  const shapeStyle = SHAPE_CLIP[frameShape];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: `${PAD}px`,
      }}
    >
      <Frame uid={uid} shape={frameShape} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          ...shapeStyle,
        }}
      >
        <img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

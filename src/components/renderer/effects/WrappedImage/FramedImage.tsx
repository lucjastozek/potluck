import { useMemo } from "react";
import { FRAME_PRESETS } from "@/components/renderer/effects/WrappedImage/framePresets";
import frameStyles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import styles from "@/components/renderer/effects/WrappedImage/WrappedImage.module.css";

export type FrameShape = "rectangle" | "circle" | "star" | "blob";
export type FramePreset =
  | "rainbow"
  | "zigzag"
  | "dots"
  | "stripes"
  | "squiggles"
  | "stars"
  | "checkers";

function useUid() {
  return useMemo(() => Math.random().toString(36).slice(2, 8), []);
}

export type PresetDef = {
  label: string;
  icon: React.ComponentType<{
    fontSize?: "inherit" | "small" | "medium" | "large";
  }>;
  Frame: React.FC<{ uid: string; shape: FrameShape }>;
};

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

  return (
    <div className={styles.framedImageRoot}>
      <Frame uid={uid} shape={frameShape} />
      <div
        className={`${styles.framedImageContent} ${frameStyles[frameShape]}`}
      >
        <img src={src} alt={alt} className={styles.framedImage} />
      </div>
    </div>
  );
}

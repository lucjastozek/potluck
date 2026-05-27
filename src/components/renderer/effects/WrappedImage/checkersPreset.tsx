import GridOnIcon from "@mui/icons-material/GridOn";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { PatternFrame } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const checkersPreset: PresetDef = {
  label: "Checkers",
  icon: GridOnIcon,
  Frame: ({ uid, shape }) => (
    <PatternFrame
      shape={shape}
      wobbleScale={5}
      shellClassName={styles.checkersShell}
      viewBox="0 0 32 32"
      patternId={`checkers-${uid}`}
      patternWidth="4"
      patternHeight="4"
    >
      <rect width="2" height="2" fill="var(--abscherry)" />
      <rect x="2" y="2" width="2" height="2" fill="var(--abscherry)" />
      <rect x="2" width="2" height="2" fill="var(--oppbg)" />
      <rect y="2" width="2" height="2" fill="var(--oppbg)" />
    </PatternFrame>
  ),
};

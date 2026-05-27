import StarOutlineIcon from "@mui/icons-material/StarOutline";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { PatternFrame } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const starsPreset: PresetDef = {
  label: "Stars",
  icon: StarOutlineIcon,
  Frame: ({ uid, shape }) => (
    <PatternFrame
      shape={shape}
      wobbleScale={8}
      shellClassName={styles.starsShell}
      viewBox="0 0 60 60"
      patternId={`stars-${uid}`}
      patternWidth="6"
      patternHeight="6"
    >
      <polygon
        points="1,1.2 1.3,2.2 2.4,2.2 1.5,2.8 1.8,3.8 1,3.2 0.2,3.8 0.5,2.8 -0.4,2.2 0.7,2.2"
        fill="var(--absyellow)"
      />
      <polygon
        points="5,5 5.3,5.8 6.2,5.8 5.5,6.3 5.8,7.1 5,6.6 4.2,7.1 4.5,6.3 3.8,5.8 4.7,5.8"
        fill="var(--absyellow)"
      />
    </PatternFrame>
  ),
};

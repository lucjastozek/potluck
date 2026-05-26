import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import styles from "@/components/renderer/effects/WrappedImage/framePresets.module.css";
import type { PresetDef } from "@/components/renderer/effects/WrappedImage/FramedImage";
import { PatternFrame } from "@/components/renderer/effects/WrappedImage/framePresetsHelpers.tsx";

export const dotsPreset: PresetDef = {
  label: "Dots",
  icon: ScatterPlotOutlinedIcon,
  Frame: ({ uid, shape }) => (
    <PatternFrame
      shape={shape}
      wobbleScale={9}
      shellClassName={styles.dotsShell}
      viewBox="0 0 60 60"
      patternId={`dots-${uid}`}
      patternWidth="6"
      patternHeight="6"
    >
      <circle cx="1.5" cy="1.5" r="1.2" fill="var(--abscherry)" />
      <circle cx="4.5" cy="4.5" r="1.2" fill="var(--abscherry)" />
    </PatternFrame>
  ),
};

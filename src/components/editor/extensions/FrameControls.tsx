import BlurOnIcon from "@mui/icons-material/BlurOn";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import type { ComponentType } from "react";
import styles from "@/components/editor/extensions/ImageNode.module.css";
import { FRAME_PRESETS } from "@/components/renderer/effects/WrappedImage/framePresets";
import type {
  FramePreset,
  FrameShape,
  PresetDef,
} from "@/components/renderer/effects/WrappedImage/FramedImage";

const FRAME_SHAPE_OPTIONS: {
  label: string;
  value: FrameShape;
  icon: ComponentType<{ fontSize?: "inherit" | "small" | "medium" | "large" }>;
}[] = [
  { label: "Rectangle", value: "rectangle", icon: CropSquareIcon },
  { label: "Circle", value: "circle", icon: CircleOutlinedIcon },
  { label: "Star", value: "star", icon: StarOutlineIcon },
  { label: "Blob", value: "blob", icon: BlurOnIcon },
];

export function FramePresetControls({
  activePreset,
  onSelectPreset,
  onRemovePreset,
}: {
  activePreset: FramePreset | null;
  onSelectPreset: (preset: FramePreset) => void;
  onRemovePreset: () => void;
}) {
  return (
    <div className={`${styles.controlGroup} ${styles.framePresetGroup}`}>
      {(Object.entries(FRAME_PRESETS) as [FramePreset, PresetDef][]).map(
        ([presetKey, preset]) => {
          const Icon = preset.icon;

          return (
            <button
              key={presetKey}
              className={`${styles.controlBtn} ${styles.framePresetButton} ${activePreset === presetKey ? styles.controlBtnActive : ""}`}
              onClick={() => onSelectPreset(presetKey)}
              title={preset.label}
              type="button"
            >
              <Icon fontSize="small" />
              <span className={styles.framePresetButtonText}>
                {preset.label}
              </span>
            </button>
          );
        },
      )}

      {activePreset && (
        <button
          className={`${styles.controlBtn} ${styles.frameRemoveButton}`}
          onClick={onRemovePreset}
          title="Remove frame"
          type="button"
        >
          <CloseIcon fontSize="small" />
        </button>
      )}
    </div>
  );
}

export function FrameShapeControls({
  activeShape,
  onSelectShape,
}: {
  activeShape: FrameShape;
  onSelectShape: (shape: FrameShape) => void;
}) {
  return (
    <div className={`${styles.controlGroup} ${styles.frameShapeGroup}`}>
      {FRAME_SHAPE_OPTIONS.map(({ label, value, icon: Icon }) => (
        <button
          key={value}
          className={`${styles.controlBtn} ${styles.frameShapeButton} ${activeShape === value ? styles.controlBtnActive : ""}`}
          onClick={() => onSelectShape(value)}
          title={label}
          type="button"
        >
          <Icon fontSize="small" />
        </button>
      ))}
    </div>
  );
}

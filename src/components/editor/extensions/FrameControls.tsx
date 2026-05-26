import BlurOnIcon from "@mui/icons-material/BlurOn";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
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
  activeShape,
  onSelectPreset,
  onRemovePreset,
  onSelectShape,
}: {
  activePreset: FramePreset | null;
  activeShape: FrameShape;
  onSelectPreset: (preset: FramePreset) => void;
  onRemovePreset: () => void;
  onSelectShape: (shape: FrameShape) => void;
}) {
  return (
    <div className={styles.frameSection}>
      <span className={styles.frameLabel}>Frame</span>

      <div className={styles.framePresetRow}>
        {(Object.entries(FRAME_PRESETS) as [FramePreset, PresetDef][]).map(
          ([presetKey, preset]) => {
            const Icon = preset.icon;
            const isActive = activePreset === presetKey;

            return (
              <button
                key={presetKey}
                className={`${styles.presetPill} ${isActive ? styles.presetPillActive : ""}`}
                onClick={() =>
                  isActive ? onRemovePreset() : onSelectPreset(presetKey)
                }
                title={isActive ? `Remove ${preset.label}` : preset.label}
                type="button"
              >
                <Icon fontSize="inherit" />
                <span>{preset.label}</span>
                {isActive && <span className={styles.presetPillX}>×</span>}
              </button>
            );
          },
        )}
      </div>

      {activePreset && (
        <div className={styles.frameShapeRow}>
          <span className={styles.frameShapeLabel}>Shape</span>
          <div className={styles.frameShapeOptions}>
            {FRAME_SHAPE_OPTIONS.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                className={`${styles.shapePill} ${activeShape === value ? styles.shapePillActive : ""}`}
                onClick={() => onSelectShape(value)}
                title={label}
                type="button"
              >
                <Icon fontSize="inherit" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

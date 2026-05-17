import styles from "@/components/renderer/Renderer.module.css";
import WrappedImage from "@/components/renderer/effects/WrappedImage/WrappedImage";
import { EFFECT_REGISTRY } from "@/components/renderer/effects/registry";
import { renderMarkup } from "@/utils/renderer";

const TEXT_ONLY_TAGS = new Set(["wavy", "rainbow", "typewriter"]);

interface RendererProps {
  markup: string;
  className?: string;
}

export default function Renderer({
  markup,
  className = "",
}: RendererProps): JSX.Element {
  return (
    <div className={`${styles.postBody} ${className}`}>
      {renderMarkup(markup, EFFECT_REGISTRY, TEXT_ONLY_TAGS, WrappedImage)}
    </div>
  );
}

import styles from "@/components/renderer/effects/WrappedImage/WrappedImage.module.css";
import type { ImageComponentProps } from "@/types";
import { useEffect, useState } from "react";

type WrappedImageProps = ImageComponentProps;

function safeClassToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export default function WrappedImage({
  url,
  attrs,
}: WrappedImageProps): JSX.Element {
  const wrap = attrs.wrap ?? "break";
  const widthPercent = Number(attrs.widthPercent ?? 50);
  const alt = attrs.alt ?? "";
  const isFloat = wrap === "left" || wrap === "right";
  const widthClassName = `imageWidth-${widthPercent}`;
  const [imageHeight, setImageHeight] = useState("auto");
  const heightClassName = `imageHeight-${widthPercent}-${safeClassToken(imageHeight)}`;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      setImageHeight(`${(widthPercent / 100 / ratio) * 100}%`);
    };
    img.src = url;
  }, [url, widthPercent]);

  if (!isFloat) {
    return (
      <>
        <style>{`.${widthClassName} { --image-width: ${widthPercent}%; }`}</style>
        <figure
          className={`${styles.imageFigure} ${wrap === "center" ? styles.imageCentered : styles.imageBreak}`}
        >
          <div className={styles.imageWrapper}>
            <img
              src={url}
              alt={alt}
              className={`${styles.imageWrap} ${widthClassName}`}
            />
          </div>
        </figure>
      </>
    );
  }

  return (
    <>
      <style>{`.${widthClassName} { --image-width: ${widthPercent}%; } .${heightClassName} { --image-width: ${widthPercent}%; --image-height: ${imageHeight}; }`}</style>
      <div className={styles.imageWrapper}>
        <img
          src={url}
          alt={alt}
          className={`${styles.imageWrap} ${wrap === "left" ? styles.imageFloatLeft : styles.imageFloatRight} ${widthClassName} ${heightClassName}`}
        />
      </div>
    </>
  );
}

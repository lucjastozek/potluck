import styles from "@/components/renderer/effects/WrappedImage/WrappedImage.module.css";
import type { ImageComponentProps } from "@/types";
import { useEffect, useState } from "react";

type WrappedImageProps = ImageComponentProps;

export default function WrappedImage({
  url,
  attrs,
}: WrappedImageProps): JSX.Element {
  const wrap = attrs.wrap ?? "break";
  const widthPercent = Number(attrs.widthPercent ?? 50);
  const alt = attrs.alt ?? "";
  const isFloat = wrap === "left" || wrap === "right";
  const [imageDimensions, setImageDimensions] = useState<{
    width: string;
    height: string;
  }>({
    width: `${widthPercent}%`,
    height: "auto",
  });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ratio = img.width / img.height;
      setImageDimensions({
        width: `${widthPercent}%`,
        height: `${(widthPercent / 100 / ratio) * 100}%`,
      });
    };
    img.src = url;
  }, [url, widthPercent]);

  if (!isFloat) {
    return (
      <figure
        className={`${styles.imageFigure} ${wrap === "center" ? styles.imageCentered : styles.imageBreak}`}
      >
        <div className={styles.imageWrapper}>
          <img
            src={url}
            alt={alt}
            className={styles.imageWrap}
            style={{ ["--image-width" as string]: `${widthPercent}%` }}
          />
        </div>
      </figure>
    );
  }

  return (
    <div className={styles.imageWrapper}>
      <img
        src={url}
        alt={alt}
        className={`${styles.imageWrap} ${wrap === "left" ? styles.imageFloatLeft : styles.imageFloatRight}`}
        style={
          {
            ["--image-width" as string]: `${widthPercent}%`,
            ["--image-height" as string]: imageDimensions.height,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Options = {
  gap?: number;
  margin?: number;
};

export function useViewportPopoverPosition<T extends HTMLElement>(
  options: Options = {},
): {
  ref: React.RefObject<T>;
  style: CSSProperties;
} {
  const ref = useRef<T>(null);

  const [style, setStyle] = useState<CSSProperties>({
    position: "fixed",
    top: 0,
    left: -9999,
    visibility: "hidden",
  });

  useLayoutEffect(() => {
    const gap = options.gap ?? 6;
    const margin = options.margin ?? 8;

    const place = () => {
      const el = ref.current;
      const anchor = el?.parentElement;
      if (!el || !anchor) return;

      const trigger = Array.from(anchor.children).find(
        (child): child is HTMLButtonElement =>
          child instanceof HTMLButtonElement,
      );
      const triggerContent = trigger?.querySelector(
        "svg, span, img, video, canvas",
      ) as HTMLElement | null;
      const aRect = (
        triggerContent ??
        trigger ??
        anchor
      ).getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const pw = el.offsetWidth;
      const ph = el.offsetHeight;

      // ── Horizontal ───────────────────────────────────────────────────────
      const spaceRight = vw - aRect.right - gap;
      const spaceLeft = aRect.left - gap;

      let left: number;
      if (spaceRight >= pw) {
        left = aRect.right + gap;
      } else if (spaceLeft >= pw) {
        left = aRect.left - gap - pw;
      } else {
        left =
          spaceRight >= spaceLeft ? aRect.right + gap : aRect.left - gap - pw;
      }
      left = Math.max(margin, Math.min(left, vw - pw - margin));

      // ── Vertical ─────────────────────────────────────────────────────────
      let top = aRect.top + aRect.height / 2 - ph / 2;
      top = Math.max(margin, Math.min(top, vh - ph - margin));

      const maxW = vw - left - margin;
      const maxH = vh - top - margin;

      setStyle({
        position: "fixed",
        top,
        left,
        maxWidth: maxW,
        maxHeight: maxH,
        overflow: "auto",
        boxSizing: "border-box",
        visibility: "visible",
      });
    };

    place();

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [options.gap, options.margin]);

  return { ref, style };
}

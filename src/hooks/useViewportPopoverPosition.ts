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
  const [style, setStyle] = useState<CSSProperties>({});

  useLayoutEffect(() => {
    const popover = ref.current;
    if (!popover) return;

    const gap = options.gap ?? 6;
    const margin = options.margin ?? 8;
    let frame = 0;

    const update = () => {
      const current = ref.current;
      const anchor = current?.parentElement;

      if (!current || !anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const popoverRect = current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxWidth = Math.max(viewportWidth - margin * 2, 0);
      const maxHeight = Math.max(viewportHeight - margin * 2, 0);
      const width = Math.min(popoverRect.width, maxWidth);
      const height = Math.min(popoverRect.height, maxHeight);

      let left = anchorRect.left;
      if (left + width > viewportWidth - margin) {
        left = viewportWidth - width - margin;
      }
      left = Math.max(margin, left);

      const spaceBelow = viewportHeight - anchorRect.bottom - gap - margin;
      const spaceAbove = anchorRect.top - gap - margin;
      let top = anchorRect.bottom + gap;

      if (height > spaceBelow && spaceAbove > spaceBelow) {
        top = anchorRect.top - gap - height;
      }

      top = Math.max(margin, Math.min(top, viewportHeight - height - margin));

      setStyle({
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: `calc(100vw - ${margin * 2}px)`,
        maxHeight: `calc(100vh - ${margin * 2}px)`,
        overflow: "auto",
        boxSizing: "border-box",
      });
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(popover);
    if (popover.parentElement) {
      observer.observe(popover.parentElement);
    }

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [options.gap, options.margin]);

  return { ref, style };
}

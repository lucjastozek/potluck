const GIF_BASE_HUE = 330;

export function cssVarToHue(cssVar: string): string {
  const el = document.createElement("span");
  el.style.color = cssVar;
  el.style.display = "none";
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);

  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return "0deg";

  const r = parseInt(match[1]) / 255;
  const g = parseInt(match[2]) / 255;
  const b = parseInt(match[3]) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d === 0) return "0deg";

  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const rotation = (h - GIF_BASE_HUE + 360) % 360;
  return `${rotation}deg`;
}

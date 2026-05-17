import type { EffectComponentProps } from "@/types";

export default function Italic({
  children,
}: EffectComponentProps): JSX.Element {
  return <em>{children}</em>;
}

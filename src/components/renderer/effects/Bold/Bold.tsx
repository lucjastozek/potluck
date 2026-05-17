import type { EffectComponentProps } from "@/types";

export default function Bold({ children }: EffectComponentProps): JSX.Element {
  return <strong>{children}</strong>;
}

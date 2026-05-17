import type { EffectComponentProps } from "@/types";

export default function Code({ children }: EffectComponentProps): JSX.Element {
  return <code>{children}</code>;
}

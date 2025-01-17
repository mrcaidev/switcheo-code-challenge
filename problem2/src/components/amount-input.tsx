import type { ComponentProps } from "react";
import { Input } from "./ui/input.tsx";

type Props = ComponentProps<typeof Input>;

export function AmountInput(props: Props) {
  return (
    <Input
      type="number"
      step={0.01}
      min={0}
      className="w-20 sm:w-28 rounded-r-none"
      {...props}
    />
  );
}

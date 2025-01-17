import type { ComponentProps } from "react";

type Props = ComponentProps<"label">;

export function Label({ children, ...props }: Props) {
  return (
    <label className="w-16 text-sm" {...props}>
      {children}
    </label>
  );
}

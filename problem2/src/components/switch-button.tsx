import { ArrowUpDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button.tsx";

type Props = ComponentProps<typeof Button>;

export function SwitchButton(props: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="switch two currencies"
      {...props}
      className="group"
    >
      <ArrowUpDownIcon className="group-active:scale-y-[-1] transition-transform" />
    </Button>
  );
}

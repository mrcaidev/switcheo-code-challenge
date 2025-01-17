import { EraserIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button.tsx";

type Props = ComponentProps<typeof Button>;

export function ResetButton(props: Props) {
  return (
    <Button variant="secondary" {...props}>
      <EraserIcon />
      Reset
    </Button>
  );
}

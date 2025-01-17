import prices from "@/data/prices.json";
import { type ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.tsx";

type Props = ComponentProps<typeof Select>;

export function CurrencySelect(props: Props) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-36 rounded-l-none">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {prices.map(({ currency }) => (
          <SelectItem key={currency} value={currency}>
            <img
              src={`/currency-icons/${currency}.svg`}
              alt=""
              width={16}
              height={16}
              className="inline-block size-4 mr-2 -translate-y-[1px]"
            />
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

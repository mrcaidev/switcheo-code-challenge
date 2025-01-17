import { MoveRightIcon } from "lucide-react";
import { AmountInput } from "./components/amount-input.tsx";
import { ConfirmDialog } from "./components/confirm-dialog.tsx";
import { CurrencySelect } from "./components/currency-select.tsx";
import { Label } from "./components/label.tsx";
import { ResetButton } from "./components/reset-button.tsx";
import { SwitchButton } from "./components/switch-button.tsx";
import { ThemeToggle } from "./components/theme-toggle.tsx";
import { useSwapper } from "./hooks/use-swapper.ts";

export function App() {
  const {
    state,
    editSellAmount,
    editSellCurrency,
    editEarnAmount,
    editEarnCurrency,
    switchCurrencies,
    reset,
    swap,
  } = useSwapper();

  return (
    <main className="p-4">
      <h1 className="mb-6 text-2xl text-center font-bold">Currency Swap</h1>
      <form onSubmit={swap} className="w-min">
        <div className="flex items-center gap-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="sell-amount">Sell (-)</Label>
              <AmountInput
                name="sellAmount"
                value={state.sellAmount}
                onChange={editSellAmount}
                id="sell-amount"
              />
              <CurrencySelect
                name="sellCurrency"
                value={state.sellCurrency}
                onValueChange={editSellCurrency}
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="earn-amount">Earn (+)</Label>
              <AmountInput
                name="earnAmount"
                value={state.earnAmount}
                onChange={editEarnAmount}
                id="earn-amount"
              />
              <CurrencySelect
                name="earnCurrency"
                value={state.earnCurrency}
                onValueChange={editEarnCurrency}
              />
            </div>
          </div>
          <div>
            <SwitchButton onClick={switchCurrencies} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResetButton onClick={reset} />
          <ConfirmDialog
            onConfirm={swap}
            disabled={state.sellAmount === 0 || state.earnAmount === 0}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="text-lg font-medium">
                {state.sellAmount}&nbsp;
                {state.sellCurrency}
              </div>
              <MoveRightIcon size={18} />
              <div className="text-lg font-medium">
                {state.earnAmount}&nbsp;
                {state.earnCurrency}
              </div>
            </div>
          </ConfirmDialog>
        </div>
      </form>
      <ThemeToggle />
    </main>
  );
}

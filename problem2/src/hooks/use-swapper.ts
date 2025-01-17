import { useToast } from "@/components/ui/use-toast.ts";
import prices from "@/data/prices.json";
import type { Currency } from "@/types.ts";
import { useReducer, type ChangeEvent, type MouseEvent } from "react";

type State = {
  sellAmount: number;
  sellCurrency: Currency;
  earnAmount: number;
  earnCurrency: Currency;
};

const defaultState: State = {
  sellAmount: 0,
  sellCurrency: "USD",
  earnAmount: 0,
  earnCurrency: "ETH",
};

type Action =
  | {
      type: "edit-sell-amount" | "edit-earn-amount";
      payload: number;
    }
  | {
      type: "edit-sell-currency" | "edit-earn-currency";
      payload: Currency;
    }
  | {
      type: "switch-currencies";
    }
  | {
      type: "reset";
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "edit-sell-amount":
      return {
        ...state,
        sellAmount: action.payload,
        earnAmount: convertAmount(
          action.payload,
          state.sellCurrency,
          state.earnCurrency
        ),
      };
    case "edit-earn-amount":
      return {
        ...state,
        sellAmount: convertAmount(
          action.payload,
          state.earnCurrency,
          state.sellCurrency
        ),
        earnAmount: action.payload,
      };
    case "edit-sell-currency":
      return {
        ...state,
        sellCurrency: action.payload,
        sellAmount: convertAmount(
          state.earnAmount,
          state.earnCurrency,
          action.payload
        ),
      };
    case "edit-earn-currency":
      return {
        ...state,
        earnCurrency: action.payload,
        earnAmount: convertAmount(
          state.sellAmount,
          state.sellCurrency,
          action.payload
        ),
      };
    case "switch-currencies":
      return {
        ...state,
        sellAmount: state.earnAmount,
        sellCurrency: state.earnCurrency,
        earnAmount: state.sellAmount,
        earnCurrency: state.sellCurrency,
      };
    case "reset":
      return defaultState;
    default:
      return state;
  }
}

function convertAmount(amount: number, from: Currency, to: Currency) {
  const { price: fromPrice } = prices.find((item) => item.currency === from)!;
  const { price: toPrice } = prices.find((item) => item.currency === to)!;
  return round((amount * fromPrice) / toPrice);
}

function round(amount: number) {
  return Math.round(amount * 100) / 100;
}

async function mockSwap() {
  await new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve();
      } else {
        reject(new Error("😎 Just a mock error. Don't panic!"));
      }
    }, 2000)
  );
}

export function useSwapper() {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const editSellAmount = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "edit-sell-amount",
      payload: +event.currentTarget.value,
    });
  };

  const editEarnAmount = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "edit-earn-amount",
      payload: +event.currentTarget.value,
    });
  };

  const editSellCurrency = (value: Currency) => {
    dispatch({ type: "edit-sell-currency", payload: value });
  };

  const editEarnCurrency = (value: Currency) => {
    dispatch({ type: "edit-earn-currency", payload: value });
  };

  const switchCurrencies = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch({ type: "switch-currencies" });
  };

  const reset = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch({ type: "reset" });
  };

  const { toast } = useToast();

  const swap = async () => {
    const { dismiss } = toast({
      title: "Transaction in progress",
      description: "⌛ We are processing your transaction...",
    });

    try {
      await mockSwap();
      toast({
        title: "Transaction completed",
        description: `🎉 You have sold ${state.sellAmount} ${state.sellCurrency} for ${state.earnAmount} ${state.earnCurrency}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description:
          error instanceof Error
            ? error.message
            : "🥲 Sorry, an unknown error occurred. Please try again.",
      });
    } finally {
      dismiss();
    }
  };

  return {
    state,
    editSellAmount,
    editEarnAmount,
    editSellCurrency,
    editEarnCurrency,
    switchCurrencies,
    reset,
    swap,
  };
}

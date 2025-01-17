# Problem 3: Messy React

To better justify my opinions and corrections, I want to first sort out the core logic of this messy component. Basically, this component does two things:

1. Fetch the prices of cryptocurrencies from an external data source.
2. Transform the user's balances, including prioritizing, sorting, formatting, etc.

... And of course, render these data in the end.

This logic is pretty common and straightforward, but the current implementation is clumsy and smells really bad.

## Major Issues

1. `prices` is not a dependency of `useMemo`. Although predictably, `prices` will not change very often, it will still cause some unnecessary re-computation. It can be safely removed. Additionally, this kind of mistakes can be easily caught and prevented by linters like `eslint-plugin-react-hooks`, so it would be nice to have it configured.
2. Array index should not be used as the key of list items. Otherwise, list items cannot be uniquely identified, and will lead to performance issues or unexpected behaviors. In this case, `currency` can be used as the key, because they can uniquely identify each cryptocurrency.
3. The data fetching logic in `useEffect` can suffer from race conditions, especially in strict dev mode, where `useEffect` will run twice on mount, despite the dependencies being `[]`. This behavior deliberately initializes two identical network requests. If the second request resolves faster than the first one, the latest data (carried in the second request) will be overwritten by the old data (carried in the first request). To prevent this, we can add a `shouldDiscard` variable inside `useEffect`, as shown in [the official docs](https://react.dev/reference/react/useEffect#fetching-data-with-effects).
4. Wrong filter logic. `if (balance.amount <= 0)` should be `if (balance.amount > 0)`. Otherwise, only the balances with zero or negative amounts will be displayed, which I suppose is not the intended behavior.

## Minor Issues

1. Formatting work should be delegated to `<WalletRow />`, because `formatted` derives directly from `balance.amount` only, which will be passed to `<WalletRow />` anyway. Moving the formatting logic to `<WalletRow />` can make this component more readable and maintainable.
2. `prices` are improperly typed in `useState`, where TypeScript would recognize its type as merely `{}`. We can use a generic `useState<Record<string, number>>({})` to explicitly declare its type.
3. The fetching error are not displayed to users, which could damage the app's usability and UX. It would be better to store the error as a state, and show an error message accordingly. `console.err` is a typo, by the way.
4. Priorities of cryptocurrencies are calculated in both `.filter()` and `.sort()`, which is, to say the least, a redundancy, if not causing performance issues. Priorities can be first calculated and stored alongside balances, and then passed on to `.filter()` and `.sort()`.

## Code Smells

1. Minor issue #1 makes `FormattedWalletBalance` redundant. It can safely be removed. By the way, this interface should extend `WalletBalance` instead of duplicating its properties.
2. `React.FC` is useless in most occasions. The component props can be typed as regular parameters.
3. `useWalletBalances` and the processing logic of `balances` can be merged together into one hook. This will encourage better reusability and separation of concerns.
4. `getPriority` does not rely on any component state, but is nevertheless re-created on every render. It can be safely moved outside the component.
5. `getPriority` has an `any` parameter, which, based on the context, should be typed as `string` instead.
6. Bad naming taste, duplicate typing, unnecessary nesting, inconsistent coding style, etc.

## Refactored Version

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
}

class Datasource {
  constructor(private readonly url: string) {}

  async getPrices() {
    const res = await fetch(this.url);

    if (!res.ok) {
      throw new Error("failed to fetch prices");
    }

    const data: {
      currency: string;
      date: string;
      price: number;
    }[] = await res.json();

    return data.reduce(
      (acc, { currency, price }) => ({ ...acc, [currency]: price }),
      {} as Record<string, number>
    );
  }
}

const getCurrencyPriority = (currency: string) => {
  switch (currency) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const useWalletBalances = () => {
  const balances = useOldHook();

  return useMemo(
    () =>
      balances
        .map((balance) => ({
          ...balance,
          priority: getCurrencyPriority(balance.currency),
        }))
        .filter(({ priority, amount }) => priority > -99 && amount > 0)
        .toSorted((left, right) => right.priority - left.priority),
    [balances]
  );
};

const usePrices = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let shouldDiscard = false;

    new Datasource("https://interview.switcheo.com/prices.json")
      .getPrices()
      .then((prices) => {
        if (shouldDiscard) {
          return;
        }
        setPrices(prices);
        setError(null);
      })
      .catch((error) => {
        if (shouldDiscard) {
          return;
        }
        setPrices({});
        setError(
          error instanceof Error
            ? error
            : new Error("unknown error", { cause: error })
        );
      });

    return () => {
      shouldDiscard = true;
    };
  }, []);

  return { prices, error };
};

interface Props extends BoxProps {}

const WalletPage = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const { prices, error } = usePrices();

  return (
    <div {...rest}>
      {balances.map(({ currency, amount }, index) => (
        <WalletBalanceRow
          key={currency}
          className={classes.row}
          amount={amount}
          usdValue={(prices[currency] ?? -1) * amount}
        />
      ))}
      {error && <p>{error.message}</p>}
    </div>
  );
};
```

function sumToNA(n) {
  validate(n);

  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

function sumToNB(n) {
  validate(n);

  return (n * (n + 1)) / 2;
}

function sumToNC(n) {
  validate(n);

  return Array(n)
    .fill(0)
    .reduce((acc, _, i) => acc + i + 1, 0);
}

function validate(n) {
  // Despite the claim that the input `n` is an integer,
  // I think it would be better to explicitly validate it again,
  // due to the weak typing nature of JavaScript.
  if (typeof n !== "number") {
    throw new Error("n must be a number");
  }
  if (!Number.isInteger(n)) {
    throw new Error("n must be an integer");
  }

  // The problem does not mention negative numbers,
  // so I assume that negative numbers are not allowed.
  if (n < 0) {
    throw new Error("n must be non-negative");
  }
}

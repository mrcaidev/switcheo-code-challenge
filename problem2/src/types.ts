import prices from "./data/prices.json";

export type Currency = (typeof prices)[number]["currency"];

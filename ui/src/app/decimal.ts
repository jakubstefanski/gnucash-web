import { Big, BigSource } from "big.js";

export type Decimal = Big;
export const toDecimal = (num: BigSource): Decimal => new Big(num);

export const formatDecimal = (num: Decimal): string => {
  if (num.s === -1) {
    return `(${num.abs().toFixed()})`;
  }
  return num.toFixed();
};

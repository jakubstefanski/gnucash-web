import { Big, BigSource, RoundingMode } from "big.js";

export type Decimal = Big;
export const toDecimal = (num: BigSource): Decimal => new Big(num);

export const formatDecimal = (num: Decimal, precision?: number): string => {
  if (num.s === -1) {
    return `(${num.abs().toFixed(precision)})`;
  }
  return num.toFixed(precision);
};

export const findPrecision = (num: Decimal): number => {
  const str = num.toFixed();
  const index = str.lastIndexOf(".");
  if (index < 0) {
    return 0; // no decimal separator character means it's integer
  }
  return str.length - index - 1;
};

export const formatFraction = (nominator: Decimal, denominator: Decimal): string => {
  if (denominator.eq("0")) {
    throw new Error("Denominator of fractional number cannot be zero");
  }

  if (nominator.eq(denominator)) {
    return "1";
  }

  const quotient = nominator.div(denominator);
  const whole = quotient.round(0, 0);
  if (quotient.eq(whole)) {
    return whole.toFixed();
  }

  const precision = Math.max(findPrecision(nominator), findPrecision(denominator));
  nominator = nominator.mul(Math.pow(10, precision));
  denominator = denominator.mul(Math.pow(10, precision));

  if (nominator.lt(denominator)) {
    return `${nominator.toFixed()}/${denominator.toFixed()}`;
  }

  nominator = nominator.sub(whole.mul(denominator));

  return `${whole.toFixed()} + ${nominator.toFixed()}/${denominator.toFixed()}`;
};

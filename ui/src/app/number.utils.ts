import { Big } from "big.js"

export function formatNumber(num: Big): string {
  if (num.s === -1) {
    return `(${num.abs().toFixed()})`;
  }
  return num.toFixed();
}
import { Decimal } from "@src/app/decimal";

export interface Commodity {
  namespace: string;
  name: string;
  precision: number;
  format: {
    prefix: string;
    suffix: string;
  };
}

export interface Account {
  commodity: Commodity;
  name: string;
  type: string;
}

export interface Transaction {
  transactionId: string;
  currency: Commodity;
  date: Date;
  num?: string;
  description?: string;
  splits: Split[];
}

export interface Split {
  account: Account;
  value: Decimal;
  quantity: Decimal;
}

export const isTransaction = (row: Transaction | Split): row is Transaction =>
  "splits" in row;

export const formatCommodityQuantity = (quantity: Decimal, commodity: Commodity): string => {
  const numText = quantity.toFixed(commodity.precision);
  return `${commodity.format.prefix}${numText}${commodity.format.suffix}`;
};

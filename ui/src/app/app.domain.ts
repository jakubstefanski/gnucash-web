import { Big } from "big.js";

export interface Commodity {
  namespace: string;
  name: string;
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
  value: Big;
  quantity: Big;
}

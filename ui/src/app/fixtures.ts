import { Account, Commodity, Transaction } from "@src/app/app.domain";
import { toDecimal as D } from "@src/app/decimal";

export const USD: Commodity = {
  namespace: "CURRENCY",
  name: "USD",
  precision: 2,
  format: { prefix: "$", suffix: "" }
};

export const EUR: Commodity = {
  namespace: "CURRENCY",
  name: "EUR",
  precision: 2,
  format: { prefix: "€", suffix: "" }
};

export const PRIMARY_BANK: Account = {
  name: "Assets:Primary Bank",
  type: "BANK",
  commodity: USD
};

export const ANOTHER_BANK: Account = {
  name: "Assets:Another Bank",
  type: "BANK",
  commodity: USD
};

const FOREIGN_BANK: Account = {
  name: "Assets:Foreign Bank",
  type: "BANK",
  commodity: EUR
};

export const GROCERIES: Account = {
  name: "Expenses:Groceries",
  type: "EXPENSE",
  commodity: USD
};

export const CLOTHES: Account = {
  name: "Expenses:Clothes",
  type: "EXPENSE",
  commodity: USD
};

export const CHARGES: Account = {
  name: "Expenses:Charges",
  type: "EXPENSE",
  commodity: USD
};

export const TRANSACTIONS: Transaction[] = [
  {
    date: new Date("2020-12-27T00:00:00Z"),
    transactionId: "0e981c75e25d44f582aca60a04524020",
    description: "Test Transfer",
    currency: USD,
    splits: [
      { account: ANOTHER_BANK, quantity: D("-2200.11"), value: D("-2200.11") },
      { account: PRIMARY_BANK, quantity: D("2200.11"), value: D("2200.11") }
    ]
  },
  {
    date: new Date("2020-12-28T00:00:00Z"),
    transactionId: "36137a1fa9e641688fc05c8ae4d2c825",
    description: "Test Spend",
    currency: USD,
    splits: [
      { account: PRIMARY_BANK, quantity: D("-55.02"), value: D("-55.02") },
      { account: GROCERIES, quantity: D("55.02"), value: D("55.02") }
    ]
  },
  {
    date: new Date("2020-12-29T00:00:00Z"),
    transactionId: "de77b6ab8e0449d2b4378092ef2012d2",
    description: "Test Split Spend",
    currency: USD,
    splits: [
      { account: PRIMARY_BANK, quantity: D("-127.28"), value: D("-127.28") },
      { account: GROCERIES, quantity: D("100.01"), value: D("100.01") },
      { account: CLOTHES, quantity: D("27.27"), value: D("27.27") }
    ]
  },
  {
    date: new Date("2020-12-30T00:00:00Z"),
    transactionId: "c8bae4bd7b924781831553d002ecd2d6",
    description: "Test Exchange Transfer with Charge",
    currency: USD,
    splits: [
      { account: PRIMARY_BANK, quantity: D("-248.84"), value: D("-248.84") },
      { account: FOREIGN_BANK, quantity: D("198.34"), value: D("243.84") },
      { account: CHARGES, quantity: D("5.00"), value: D("5.00") }
    ]
  },
  {
    date: new Date("2020-12-31T00:00:00Z"),
    transactionId: "890a085861fc4f72a978d5f14cea5cdb",
    description: "Test Exchange Spend",
    currency: EUR,
    splits: [
      { account: FOREIGN_BANK, quantity: D("-13.53"), value: D("-13.53") },
      { account: GROCERIES, quantity: D("16.60"), value: D("13.53") }
    ]
  }
];

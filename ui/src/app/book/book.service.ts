import { Injectable } from "@angular/core";

import { Big } from "big.js";
import { unparse } from "papaparse";

import { formatNumber } from "@src/app/number.utils";

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

@Injectable({
  providedIn: "root",
})
export class BookService {
  constructor() {}

  exportToCsv(transactions: Transaction[]): string {
    /* eslint-disable quote-props */
    /* eslint-disable @typescript-eslint/naming-convention */
    const data = transactions.flatMap(tx => [{
        "Date": tx.date.toISOString().substr(0, 10),
        "Transaction ID": tx.transactionId,
        "Number": tx.num,
        "Description": tx.description,
        "Notes": "",
        "Commodity/Currency": `${tx.currency.namespace}::${tx.currency.name}`,
        "Void Reason": "",
        "Action": "",
        "Memo": "",
        "Full Account Name": tx.splits[0].account.name,
        "Account Name": "",
        "Amount With Sym": "",
        "Amount Num.": formatNumber(tx.splits[0].value), // TODO: verify
        "Reconcile": "n",
        "Reconcile Date": "",
        "Rate/Price": "1.0000" // TODO: calculate if currencies differ
      }, ...tx.splits.slice(1).map(split => ({
        "Date": "",
        "Transaction ID": "",
        "Number": "",
        "Description": "",
        "Notes": "",
        "Commodity/Currency": "",
        "Void Reason": "",
        "Action": "",
        "Memo": "",
        "Full Account Name": split.account.name,
        "Account Name": "",
        "Amount With Sym": "",
        "Amount Num.": formatNumber(split.value), // TODO: verify
        "Reconcile": "n",
        "Reconcile Date": "",
        "Rate/Price": "1.0000" // TODO: calculate if currencies differ
      }))]);
    /* eslint-enable quote-props */
    /* eslint-enable @typescript-eslint/naming-convention */

    const columns = [
      "Date",
      "Transaction ID",
      "Number",
      "Description",
      "Notes",
      "Commodity/Currency",
      "Void Reason",
      "Action",
      "Memo",
      "Full Account Name",
      "Account Name",
      "Amount With Sym",
      "Amount Num.",
      "Reconcile",
      "Reconcile Date",
      "Rate/Price"
    ];
    const newline = "\n";
    if (data.length === 0) {
      return columns.join(",") + newline;
    }

    const csv = unparse(data, {
      header: true,
      columns,
      quotes: false,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ",",
      newline,
      skipEmptyLines: false,
    });
    return csv + newline;
  }
}

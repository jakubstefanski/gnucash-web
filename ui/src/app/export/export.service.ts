import { Injectable } from "@angular/core";

import { unparse } from "papaparse";

import { Decimal, formatDecimal, formatFraction, toDecimal } from "@src/app/decimal";
import { Account, Transaction } from "@src/app/app.domain";

const ACCOUNT_SEPARATOR = ":"; // TODO: make it configurable

@Injectable({
  providedIn: "root",
})
export class ExportService {
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
        "Account Name": this.shortenAccountName(tx.splits[0].account.name),
        "Amount With Sym": "",
        "Amount Num.": this.formatQuantity(tx.splits[0]),
        "Reconcile": "n",
        "Reconcile Date": "",
        "Rate/Price": this.formatPrice(tx.splits[0])
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
        "Account Name": this.shortenAccountName(split.account.name),
        "Amount With Sym": "",
        "Amount Num.": this.formatQuantity(split),
        "Reconcile": "n",
        "Reconcile Date": "",
        "Rate/Price": this.formatPrice(split)
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

  private formatQuantity(args: { quantity: Decimal; account: Account }): string {
    return formatDecimal(args.quantity, args.account.commodity.precision);
  }

  private shortenAccountName(name: string): string {
    const index = name.lastIndexOf(ACCOUNT_SEPARATOR);
    if (index >= 0) {
      return name.substring(index + 1);
    }
    return name;
  }

  private formatPrice(args: { value: Decimal; quantity: Decimal }): string {
    if (args.value.eq(args.quantity)) {
      return formatDecimal(toDecimal("1"), 4); // emulates behaviour of GnuCash
    }

    return formatFraction(args.value, args.quantity);
  }
}

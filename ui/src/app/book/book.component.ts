import { Component, OnInit } from "@angular/core";

import { formatCommodityQuantity, isTransaction, Split, Transaction } from "@src/app/app.domain";
import { isNegative } from "@src/app/decimal";
import { TRANSACTIONS } from "@src/app/fixtures";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"]
})
export class BookComponent implements OnInit {
  displayedColumns: string[] = ["date", "num", "description", "account", "fundsIn", "fundsOut"];
  dataSource = TRANSACTIONS
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .flatMap(tx => [tx, ...tx.splits]);

  constructor() { }

  ngOnInit(): void {
  }

  formatDate(row: Transaction | Split): string {
    return isTransaction(row) ? row.date.toISOString().substr(0, 10) : "";
  }

  formatNum(row: Transaction | Split): string {
    return isTransaction(row) ? row.num || "" : "";
  }

  formatDescription(row: Transaction | Split): string {
    return isTransaction(row) ? row.description || "" : "";
  }

  formatAccount(row: Transaction | Split): string {
    return isTransaction(row) ? "" : row.account.name;
  }

  formatFundsIn(row: Transaction | Split): string {
    if (isTransaction(row)) {
      return "";
    }
    if (isNegative(row.quantity)) {
      return "";
    }
    return formatCommodityQuantity(row.quantity, row.account.commodity);
  }

  formatFundsOut(row: Transaction | Split): string {
    if (isTransaction(row)) {
      return "";
    }
    if (!isNegative(row.quantity)) {
      return "";
    }
    return formatCommodityQuantity(row.quantity.abs(), row.account.commodity);
  }
}

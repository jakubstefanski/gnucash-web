import { Component, OnInit } from "@angular/core";

import { saveAs } from "file-saver";

import { formatCommodityQuantity, isTransaction, Split, Transaction } from "@src/app/app.domain";
import { isNegative } from "@src/app/decimal";
import { ExportService } from "@src/app/export/export.service";
import { TRANSACTIONS } from "@src/app/fixtures";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"]
})
export class BookComponent implements OnInit {
  displayedColumns: string[] = ["date", "num", "description", "account", "fundsIn", "fundsOut"];
  transactions: Transaction[] = TRANSACTIONS;

  get dataSource() {
    return this.transactions
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .flatMap(tx => [tx, ...tx.splits]);
  }

  constructor(private exportService: ExportService) { }

  ngOnInit(): void {
  }

  exportToCsv() {
    const csv = this.exportService.exportToCsv(this.transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const date = new Date().toISOString().substr(0, 10);
    saveAs(blob, `gnucash-export-${date}.csv`);
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

  getRowClass(row: Transaction | Split): string[] {
    return isTransaction(row) ? ["transaction"] : ["split"];
  }
}

/// <reference types="cypress" />

import { ExportService } from "@src/app/export/export.service";
import { Account, Commodity } from "@src/app/app.domain";
import { toDecimal as D } from "@src/app/decimal";

const USD: Commodity = { namespace: "CURRENCY", name: "USD" };

const TEST_BANK: Account = {
  name: "Assets:Primary Bank",
  type: "BANK",
  commodity: USD
};

const ANOTHER_BANK: Account = {
  name: "Assets:Another Bank",
  type: "BANK",
  commodity: USD
};

const GROCERIES: Account = {
  name: "Expenses:Groceries",
  type: "EXPENSE",
  commodity: USD
};

const CLOTHES: Account = {
  name: "Expenses:Clothes",
  type: "EXPENSE",
  commodity: USD
};

context("ExportService", () => {
  let service: ExportService;

  beforeEach(() => {
    service = new ExportService();
  });

  context("exportToCsv", () => {
    it("exports empty list", () => {
      const csv = service.exportToCsv([]);
      assertCsv(csv, "export/empty.csv");
    });

    it("exports spend transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-28T00:00:00Z"),
          transactionId: "36137a1fa9e641688fc05c8ae4d2c825",
          description: "Test Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: D("-55.02"), value: D("-55.02") },
            { account: GROCERIES, quantity: D("55.02"), value: D("55.02") }
          ]
        }
      ]);
      assertCsv(csv, "export/spend.csv");
    });

    it("exports transfer transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-27T00:00:00Z"),
          transactionId: "0e981c75e25d44f582aca60a04524020",
          description: "Test Transfer",
          currency: USD,
          splits: [
            { account: ANOTHER_BANK, quantity: D("-2200.11"), value: D("-2200.11") },
            { account: TEST_BANK, quantity: D("2200.11"), value: D("2200.11") }
          ]
        }
      ]);
      assertCsv(csv, "export/transfer.csv");
    });

    it("exports split spend transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-29T00:00:00Z"),
          transactionId: "de77b6ab8e0449d2b4378092ef2012d2",
          description: "Test Split Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: D("-127.28"), value: D("-127.28") },
            { account: GROCERIES, quantity: D("100.01"), value: D("100.01") },
            { account: CLOTHES, quantity: D("27.27"), value: D("27.27") }
          ]
        }
      ]);
      assertCsv(csv, "export/split-spend.csv");
    });

    it("exports multiple transactions", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-27T00:00:00Z"),
          transactionId: "0e981c75e25d44f582aca60a04524020",
          description: "Test Transfer",
          currency: USD,
          splits: [
            { account: ANOTHER_BANK, quantity: D("-2200.11"), value: D("-2200.11") },
            { account: TEST_BANK, quantity: D("2200.11"), value: D("2200.11") }
          ]
        },
        {
          date: new Date("2020-12-28T00:00:00Z"),
          transactionId: "36137a1fa9e641688fc05c8ae4d2c825",
          description: "Test Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: D("-55.02"), value: D("-55.02") },
            { account: GROCERIES, quantity: D("55.02"), value: D("55.02") }
          ]
        },
        {
          date: new Date("2020-12-29T00:00:00Z"),
          transactionId: "de77b6ab8e0449d2b4378092ef2012d2",
          description: "Test Split Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: D("-127.28"), value: D("-127.28") },
            { account: GROCERIES, quantity: D("100.01"), value: D("100.01") },
            { account: CLOTHES, quantity: D("27.27"), value: D("27.27") }
          ]
        },
      ]);
      assertCsv(csv, "export/multiple.csv");
    });
  });
});

const assertCsv = (actualCsv: string, expectedCsvPath: string): Cypress.Chainable<void> =>
  cy.fixture(expectedCsvPath).then(expectedCsv => {
    const actualLines = actualCsv.split("\n");
    const expectedLines = expectedCsv.split("\n");

    expect(actualLines).to.be.lengthOf(expectedLines.length);
    for (let i = 0; i < expectedLines.length; i++) {
      expect(actualLines[i]).to.equal(expectedLines[i], `CSV differs at line ${i + 1}`);
    }
  });

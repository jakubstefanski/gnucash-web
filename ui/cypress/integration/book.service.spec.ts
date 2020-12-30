/// <reference types="cypress" />

import { Big } from "big.js"

import { BookService, Account, Commodity } from "@src/app/book/book.service";

const USD: Commodity = { namespace: "CURRENCY", name: "USD" };

const TEST_BANK: Account = {
  name: "Assets:Current Assets:TestBank",
  type: "BANK",
  commodity: USD
};

const ANOTHER_BANK: Account = {
  name: "Assets:Current Assets:AnotherBank",
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

context("BookService", () => {
  let service: BookService;

  beforeEach(() => {
    service = new BookService();
  });

  context("exportToCsv", () => {
    it("exports empty list", () => {
      const csv = service.exportToCsv([]);
      assertCsv(csv, "export-empty.csv");
    });

    it("exports spend transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-28T00:00:00Z"),
          transactionId: "d9c76c7482be4ace87a3035877b6b029",
          description: "Test Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: new Big("-55.02"), value: new Big("-55.02") },
            { account: GROCERIES, quantity: new Big("55.02"), value: new Big("55.02") }
          ]
        }
      ]);
      assertCsv(csv, "export-spend.csv");
    });

    it("exports transfer transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-27T00:00:00Z"),
          transactionId: "dfcbb17b32174f9e8c3e3e69be7e39c2",
          description: "Test Transfer",
          currency: USD,
          splits: [
            { account: ANOTHER_BANK, quantity: new Big("-2200.11"), value: new Big("-2200.11") },
            { account: TEST_BANK, quantity: new Big("2200.11"), value: new Big("2200.11") }
          ]
        }
      ]);
      assertCsv(csv, "export-transfer.csv");
    });

    it("exports split spend transaction", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-29T00:00:00Z"),
          transactionId: "1d1243e063f9450daea96bfdc753d61b",
          description: "Test Split Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: new Big("-127.28"), value: new Big("-127.28") },
            { account: GROCERIES, quantity: new Big("100.01"), value: new Big("100.01") },
            { account: CLOTHES, quantity: new Big("27.27"), value: new Big("27.27") }
          ]
        }
      ]);
      assertCsv(csv, "export-split-spend.csv");
    });

    it("exports multiple transactions", () => {
      const csv = service.exportToCsv([
        {
          date: new Date("2020-12-27T00:00:00Z"),
          transactionId: "dfcbb17b32174f9e8c3e3e69be7e39c2",
          description: "Test Transfer",
          currency: USD,
          splits: [
            { account: ANOTHER_BANK, quantity: new Big("-2200.11"), value: new Big("-2200.11") },
            { account: TEST_BANK, quantity: new Big("2200.11"), value: new Big("2200.11") }
          ]
        },
        {
          date: new Date("2020-12-28T00:00:00Z"),
          transactionId: "d9c76c7482be4ace87a3035877b6b029",
          description: "Test Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: new Big("-55.02"), value: new Big("-55.02") },
            { account: GROCERIES, quantity: new Big("55.02"), value: new Big("55.02") }
          ]
        },
        {
          date: new Date("2020-12-29T00:00:00Z"),
          transactionId: "1d1243e063f9450daea96bfdc753d61b",
          description: "Test Split Spend",
          currency: USD,
          splits: [
            { account: TEST_BANK, quantity: new Big("-127.28"), value: new Big("-127.28") },
            { account: GROCERIES, quantity: new Big("100.01"), value: new Big("100.01") },
            { account: CLOTHES, quantity: new Big("27.27"), value: new Big("27.27") }
          ]
        },
      ]);
      assertCsv(csv, "export-multiple.csv");
    });
  });
});

function assertCsv(actualCsv: string, expectedCsvPath: string): Cypress.Chainable<void> {
  return cy.fixture(expectedCsvPath).then(expectedCsv => {
    const actualLines = actualCsv.split("\n");
    const expectedLines = expectedCsv.split("\n");

    expect(actualLines).to.be.lengthOf(expectedLines.length);
    for (let i = 0; i < expectedLines.length; i++) {
      expect(actualLines[i]).to.equal(expectedLines[i], `CSV differs at line ${i + 1}`);
    }
  });
}
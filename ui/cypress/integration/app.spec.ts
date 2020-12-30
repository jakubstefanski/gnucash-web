/// <reference types="cypress" />

context("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("title", () => {
    cy.title().should("equal", "GnuCash Web");
  });
});

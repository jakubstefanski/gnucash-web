/// <reference types="cypress" />

import { findPrecision, formatDecimal, formatFraction, toDecimal as D } from "@src/app/decimal";

context("Decimal", () => {
  context("formatDecimal", () => {
    const cases = [["0", "0"], ["-2", "(2)"], ["1000", "1000"], ["20.1", "20.1"], ["-0.002", "(0.002)"], ["-40.10202", "(40.10202)"]];
    for (const [num, formatted] of cases) {
      it(`formats number ${num} as ${formatted}`, () => {
        expect(formatDecimal(D(num))).to.eq(formatted);
      });
    }

    it("appends additional zeros if desired precision is greater", () => {
      expect(formatDecimal(D("1"), 4)).to.eq("1.0000");
      expect(formatDecimal(D("1.01"), 3)).to.eq("1.010");
      expect(formatDecimal(D("152.1"), 2)).to.eq("152.10");
      expect(formatDecimal(D("-283.12"), 3)).to.eq("(283.120)");
    });

    it("it truncates number if desired precision is less", () => {
      expect(formatDecimal(D("-1.010"), 2)).to.eq("(1.01)");
      expect(formatDecimal(D("152.147"), 2)).to.eq("152.15");
      expect(formatDecimal(D("152.142"), 2)).to.eq("152.14");
      expect(formatDecimal(D("-210.185"), 2)).to.eq("(210.19)");
      expect(formatDecimal(D("-210.184"), 2)).to.eq("(210.18)");
    });
  });

  context("findPrecision", () => {
    const cases = [["0", 0], ["-2", 0], ["1000", 0], ["20.1", 1], ["0.002", 3], ["40.10202", 5]];
    for (const [num, precision] of cases) {
      it(`finds precision of number ${num} to be ${precision}`, () => {
        expect(findPrecision(D(num))).to.eq(precision);
      });
    }
  });

  context("formatFraction", () => {
    it("throws error when denominator is zero", () => {
      expect(() => formatFraction(D("5"), D("0"))).to.throw("Denominator of fractional number cannot be zero");
    });

    it("formats same number", () => {
      expect(formatFraction(D("1.345"), D("1.345"))).to.eq("1");
    });

    it("formats integral number from divisible numbers", () => {
      expect(formatFraction(D("6"), D("3"))).to.eq("2");
      expect(formatFraction(D("3"), D("0.5"))).to.eq("6");
      expect(formatFraction(D("0.2"), D("0.1"))).to.eq("2");
    });

    it("formats fractional number from integers", () => {
      expect(formatFraction(D("1"), D("3"))).to.eq("1/3");
      expect(formatFraction(D("8"), D("100"))).to.eq("8/100");
    });

    it("formats fractional number with numbers of different precision", () => {
      expect(formatFraction(D("80"), D("321.53"))).to.eq("8000/32153");
      expect(formatFraction(D("32.532"), D("172"))).to.eq("32532/172000");
      expect(formatFraction(D("1.4261"), D("3.32"))).to.eq("14261/33200");
      expect(formatFraction(D("1.61"), D("3.3212"))).to.eq("16100/33212");
    });

    it("formats mixed number from integers", () => {
      expect(formatFraction(D("3"), D("2"))).to.eq("1 + 1/2");
      expect(formatFraction(D("9"), D("2"))).to.eq("4 + 1/2");
    });

    it("formats mixed number with numbers of different precision", () => {
      expect(formatFraction(D("321.53"), D("80"))).to.eq("4 + 153/8000");
      expect(formatFraction(D("172"), D("32.532"))).to.eq("5 + 9340/32532");
      expect(formatFraction(D("3.32"), D("1.4261"))).to.eq("2 + 4678/14261");
      expect(formatFraction(D("3.3212"), D("1.61"))).to.eq("2 + 1012/16100");
    });
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validation_1 = require("./validation");
(0, vitest_1.describe)('isNumberLike', () => {
    (0, vitest_1.test)('validates positive integers', () => {
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('123')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('0')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('+123')).toBe(true);
    });
    (0, vitest_1.test)('validates negative integers', () => {
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('-123')).toBe(true);
    });
    (0, vitest_1.test)('validates decimal numbers', () => {
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('123.45')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('-123.45')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('0.45')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('-0.45')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('+123.45')).toBe(true);
    });
    (0, vitest_1.test)('handles whitespace', () => {
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('  123  ')).toBe(true);
        (0, vitest_1.expect)((0, validation_1.isNumberLike)(' -123.45 ')).toBe(true);
    });
    (0, vitest_1.test)('rejects invalid number formats', () => {
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('123.45.67')).toBe(false); // multiple decimal points
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('123.')).toBe(false); // trailing decimal
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('.123')).toBe(false); // leading decimal
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('abc')).toBe(false); // letters
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('12a3')).toBe(false); // mixed letters and numbers
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('')).toBe(false); // empty string
        (0, vitest_1.expect)((0, validation_1.isNumberLike)(' ')).toBe(false); // whitespace only
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('1,234')).toBe(false); // thousands separator
        (0, vitest_1.expect)((0, validation_1.isNumberLike)('1e5')).toBe(false); // scientific notation
    });
});

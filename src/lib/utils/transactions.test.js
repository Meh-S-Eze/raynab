"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const transactions_1 = require("./transactions");
(0, vitest_1.describe)('properly format milliunit amounts to readable amounts', () => {
    (0, vitest_1.describe)('format an amount with no currency format provided', () => {
        const MILLUNIT_AMOUNT = 120_000_000;
        (0, vitest_1.test)('with a locale', () => {
            (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: MILLUNIT_AMOUNT })).toBe('120,000');
        });
        (0, vitest_1.test)('without a locale', () => {
            (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: MILLUNIT_AMOUNT, locale: false })).toBe('120000');
        });
    });
    (0, vitest_1.describe)('format an amount with a currency format provided', () => {
        const MILLUNIT_AMOUNT = 123_930;
        (0, vitest_1.describe)('format USD', () => {
            const USD_FORMAT = {
                display_symbol: true,
                symbol_first: true,
                decimal_digits: 2,
                currency_symbol: '$',
            };
            (0, vitest_1.test)('positive amount with decimals', () => {
                (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: MILLUNIT_AMOUNT, currency: USD_FORMAT })).toBe('$123.93');
            });
            (0, vitest_1.test)('negative amount with decimals', () => {
                (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: -1 * MILLUNIT_AMOUNT, currency: USD_FORMAT })).toBe('-$123.93');
            });
        });
        (0, vitest_1.describe)('format Euro', () => {
            const EURO_FORMAT = {
                display_symbol: true,
                symbol_first: false,
                decimal_digits: 2,
                currency_symbol: '€',
            };
            (0, vitest_1.test)('positive amount with decimals', () => {
                (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: MILLUNIT_AMOUNT, currency: EURO_FORMAT })).toBe('123.93€');
            });
            (0, vitest_1.test)('negative amount with decimals', () => {
                (0, vitest_1.expect)((0, transactions_1.formatToReadableAmount)({ amount: -1 * MILLUNIT_AMOUNT, currency: EURO_FORMAT })).toBe('-123.93€');
            });
        });
    });
});
(0, vitest_1.describe)('autoDistribute', () => {
    (0, vitest_1.test)('evenly distributes amount when no rounding is needed', () => {
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(100, 4)).toEqual([25, 25, 25, 25]);
    });
    (0, vitest_1.test)('handles rounding by adjusting first amount to maintain total', () => {
        // $100 split into 3 should be [33.34, 33.33, 33.33] to maintain total
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(100, 3)).toEqual([33.34, 33.33, 33.33]);
    });
    (0, vitest_1.test)('handles negative amounts', () => {
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(-100, 4)).toEqual([-25, -25, -25, -25]);
    });
    (0, vitest_1.test)('handles decimal input amounts', () => {
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(100.5, 2)).toEqual([50.25, 50.25]);
    });
    (0, vitest_1.test)('handles single dividend', () => {
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(100, 1)).toEqual([100]);
    });
    (0, vitest_1.test)('handles zero amount', () => {
        (0, vitest_1.expect)((0, transactions_1.autoDistribute)(0, 3)).toEqual([0, 0, 0]);
    });
    (0, vitest_1.test)('maintains total amount after distribution', () => {
        const amount = 100;
        const parts = 3;
        const distributed = (0, transactions_1.autoDistribute)(amount, parts);
        // Sum should equal original amount
        const sum = distributed.reduce((acc, curr) => acc + curr, 0);
        (0, vitest_1.expect)(sum).toBeCloseTo(amount, 2); // Using toBeCloseTo for floating point comparison
    });
    (0, vitest_1.test)('rounds all numbers to 2 decimal places', () => {
        const distributed = (0, transactions_1.autoDistribute)(100, 3);
        distributed.forEach((amount) => {
            const decimalPlaces = amount.toString().split('.')[1]?.length || 0;
            (0, vitest_1.expect)(decimalPlaces).toBeLessThanOrEqual(2);
        });
    });
});
(0, vitest_1.describe)('formatToReadableFrequency', () => {
    (0, vitest_1.test)('formats never frequency', () => {
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('never')).toBe('Never repeats');
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('never', false)).toBe('Never');
    });
    (0, vitest_1.test)('formats daily frequency', () => {
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('daily')).toBe('Repeats Daily');
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('daily', false)).toBe('Daily');
    });
    (0, vitest_1.test)('formats weekly frequency', () => {
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('weekly')).toBe('Repeats Weekly');
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('weekly', false)).toBe('Weekly');
    });
    (0, vitest_1.test)('formats monthly frequency', () => {
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('monthly')).toBe('Repeats Monthly');
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('monthly', false)).toBe('Monthly');
    });
    (0, vitest_1.test)('formats yearly frequency', () => {
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('yearly')).toBe('Repeats Yearly');
        (0, vitest_1.expect)((0, transactions_1.formatToReadableFrequency)('yearly', false)).toBe('Yearly');
    });
});

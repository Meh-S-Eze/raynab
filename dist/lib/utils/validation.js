"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumberLike = isNumberLike;
const IS_FLOATING_NUMBER_REGEX = /^[+-]?\d+(\.\d+)?$/;
/**
 * Determine whether a string can be safely converted to a number.
 */
function isNumberLike(v) {
    const numberLike = v.trim();
    if (Number.isNaN(Number(numberLike))) {
        return false;
    }
    if (!IS_FLOATING_NUMBER_REGEX.test(numberLike)) {
        return false;
    }
    return true;
}

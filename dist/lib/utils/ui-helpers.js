"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlagColor = getFlagColor;
exports.easyGetColorFromId = easyGetColorFromId;
const api_1 = require("@raycast/api");
/**
 * Match YNAB flag colors with Raycast colors
 */
function getFlagColor(color) {
    const stringColor = color === null || color === void 0 ? void 0 : color.toString();
    switch (stringColor) {
        case 'red':
            return api_1.Color.Red;
        case 'green':
            return api_1.Color.Green;
        case 'purple':
            return api_1.Color.Purple;
        case 'orange':
            return api_1.Color.Orange;
        case 'blue':
            return api_1.Color.Blue;
        default:
            return;
    }
}
/**
 * Return one of the predefined colors from the Raycast API
 * Useful when trying to color a list of items
 */
function easyGetColorFromId(id) {
    switch (id % 6) {
        case 0:
            return api_1.Color.Green;
        case 1:
            return api_1.Color.Blue;
        case 2:
            return api_1.Color.Magenta;
        case 3:
            return api_1.Color.Orange;
        case 4:
            return api_1.Color.Purple;
        case 5:
            return api_1.Color.Red;
        case 6:
            return api_1.Color.Yellow;
        default:
            throw `Can't really happen lol`;
    }
}

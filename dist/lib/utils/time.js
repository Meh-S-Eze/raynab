"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.time = void 0;
exports.getCurrentMonth = getCurrentMonth;
const dayjs_1 = __importDefault(require("dayjs"));
exports.time = dayjs_1.default;
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const calendar_1 = __importDefault(require("dayjs/plugin/calendar"));
const quarterOfYear_1 = __importDefault(require("dayjs/plugin/quarterOfYear"));
const updateLocale_1 = __importDefault(require("dayjs/plugin/updateLocale"));
dayjs_1.default.extend(calendar_1.default);
dayjs_1.default.extend(localizedFormat_1.default);
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(quarterOfYear_1.default);
dayjs_1.default.extend(updateLocale_1.default);
dayjs_1.default.updateLocale('en', {
    calendar: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        lastWeek: '[Last] dddd',
        nextWeek: 'dddd',
        sameElse: function () {
            // @see https://day.js.org/docs/en/customization/calendar
            // @ts-expect-error the scope of this here refers to the original dayjs instance
            return this.fromNow();
        },
    },
});
/**
 * Get the current month according to the UTC time zone.
 */
function getCurrentMonth() {
    return new Intl.DateTimeFormat('en-us', { month: 'long', timeZone: 'UTC' }).format(new Date());
}

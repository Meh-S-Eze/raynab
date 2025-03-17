"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYnabError = isYnabError;
exports.displayError = displayError;
function isYnabError(error) {
    return error.error !== undefined;
}
function displayError(error, title) {
    const { error: apiError } = error;
    if (apiError.id === '400') {
        console.error(apiError);
        return { title: title ?? 'Bad request', message: `Malformed request to the API: ${apiError.detail}` };
    }
    const errorMessage = ErrorTable.get(apiError.id);
    return { title: title ?? apiError.name, message: errorMessage ?? apiError.detail };
}
const ErrorTable = new Map([
    ['401', 'Please verify your API token is valid.'],
    ['403.1', 'The subscription for your account has lapsed.'],
    ['403.2', 'Your YNAB Trial has expired.'],
    ['409', 'There was a conflict when trying to process this request.'],
    ['429', 'You have reached the request limit for the API. Try again in the next hour.'],
    ['500', 'Something went wrong internally with YNAB.'],
    ['503', 'The YNAB API is disabled for maintenance. Try again later.'],
]);

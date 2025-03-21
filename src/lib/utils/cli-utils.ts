import { CurrencyFormat } from '@srcTypes';
import { utils } from 'ynab';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// Format currency amount
export function formatToReadableAmount({
  amount,
  currency,
  locale = true,
  prefixNegativeSign = true,
  includeSymbol = true,
}: {
  amount: number;
  currency?: CurrencyFormat;
  locale?: boolean;
  prefixNegativeSign?: boolean;
  includeSymbol?: boolean;
}) {
  const fmtAmount = utils.convertMilliUnitsToCurrencyAmount(amount, currency?.decimal_digits ?? 2);
  const localizedAmount = localizeToBudgetSettings(fmtAmount, currency);

  if (currency && includeSymbol) {
    const { currency_symbol: symbol, symbol_first, display_symbol } = currency;
    const shouldPrefixSymbol = prefixNegativeSign && fmtAmount < 0;
    return !display_symbol
      ? localizedAmount
      : formatCurrencyPlacement(localizedAmount, symbol, symbol_first, shouldPrefixSymbol);
  } else {
    return locale ? localizedAmount : fmtAmount.toString();
  }
}

// Format according to budget settings
function localizeToBudgetSettings(fmtAmount: number, currency?: CurrencyFormat) {
  if (!currency) {
    return fmtAmount.toLocaleString('en-us');
  }

  const [integerPart, decimalPart] = fmtAmount.toString().split('.');
  const integerGroups = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency.group_separator);
  return !decimalPart
    ? integerGroups
    : `${integerGroups}${currency.decimal_separator}${decimalPart.padEnd(currency.decimal_digits, '0')}`;
}

// Format currency placement
function formatCurrencyPlacement(amount: string, symbol: string, symbol_first: boolean, shouldPrefixSymbol: boolean) {
  if (symbol_first) {
    return shouldPrefixSymbol ? `-${symbol}${amount.substring(1)}` : `${symbol}${amount}`;
  } else {
    return `${amount}${symbol}`;
  }
}

// Time formatting
export const time = dayjs; 
/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Token - Your YNAB Personal Access Token */
  "apiToken": string,
  /** Quick Revalidate - Revalidate the transaction list immediately after editing, approving, or deleting a transaction. Turning this off might help if you're reaching the API rate limit often. */
  "quickRevalidate": boolean,
  /** Live Distribute - Automatically distribute 2-way split transaction amounts according to the total */
  "liveDistribute": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `activeBudget` command */
  export type ActiveBudget = ExtensionPreferences & {}
  /** Preferences accessible in the `transactions` command */
  export type Transactions = ExtensionPreferences & {}
  /** Preferences accessible in the `transaction` command */
  export type Transaction = ExtensionPreferences & {}
  /** Preferences accessible in the `scheduleTransaction` command */
  export type ScheduleTransaction = ExtensionPreferences & {}
  /** Preferences accessible in the `accounts` command */
  export type Accounts = ExtensionPreferences & {}
  /** Preferences accessible in the `budget` command */
  export type Budget = ExtensionPreferences & {}
  /** Preferences accessible in the `unreviewed` command */
  export type Unreviewed = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `activeBudget` command */
  export type ActiveBudget = {}
  /** Arguments passed to the `transactions` command */
  export type Transactions = {}
  /** Arguments passed to the `transaction` command */
  export type Transaction = {}
  /** Arguments passed to the `scheduleTransaction` command */
  export type ScheduleTransaction = {}
  /** Arguments passed to the `accounts` command */
  export type Accounts = {}
  /** Arguments passed to the `budget` command */
  export type Budget = {}
  /** Arguments passed to the `unreviewed` command */
  export type Unreviewed = {}
}


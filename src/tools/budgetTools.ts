// src/tools/budgetTools.ts
// Implement budget tools

import { z } from 'zod';
import { getYnabAPI, getDefaultBudgetId } from '../lib/ynabClient';
import { 
  Budget, 
  BudgetSummaryParams, 
  BudgetSummarySchema,
  BudgetDetailsParams,
  BudgetDetailsSchema
} from '../schemas/budgetSchema';

/**
 * Lists all budgets
 */
export const listBudgets = {
  description: "List all available YNAB budgets",
  parameters: BudgetSummarySchema,
  handler: async (params: BudgetSummaryParams) => {
    try {
      const ynab = await getYnabAPI();
      
      console.log('Fetching all budgets');
      const response = await ynab.budgets.getBudgets();
      const budgets = response.data.budgets;
      
      // Format budgets for response
      return {
        success: true,
        budgets: budgets.map(budget => ({
          id: budget.id,
          name: budget.name,
          last_modified_on: budget.last_modified_on,
          first_month: budget.first_month,
          last_month: budget.last_month,
          currency_format: budget.currency_format
        }))
      };
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

/**
 * Gets budget details for a specific month
 */
export const getBudgetDetails = {
  description: "Get detailed budget information for a specific month",
  parameters: BudgetDetailsSchema,
  handler: async (params: BudgetDetailsParams) => {
    try {
      const ynab = await getYnabAPI();
      const budgetId = params.budget_id || getDefaultBudgetId();
      const month = params.month || new Date().toISOString().substring(0, 7) + '-01'; // Use current month if not specified
      
      console.log(`Fetching budget details for ${month}`);
      const response = await ynab.budgets.getBudgetById(budgetId);
      const budget = response.data.budget;
      
      // Get month details
      const monthDetail = budget.months.find(m => m.month === month);
      
      if (!monthDetail) {
        return {
          success: false,
          error: `No budget data available for ${month}`
        };
      }
      
      // Format budget for response
      return {
        success: true,
        budget: {
          id: budget.id,
          name: budget.name,
          month: monthDetail.month,
          categories: monthDetail.categories.map(category => ({
            id: category.id,
            name: category.name,
            category_group_id: category.category_group_id,
            category_group_name: category.category_group_name,
            budgeted: category.budgeted / 1000,
            activity: category.activity / 1000,
            balance: category.balance / 1000,
            goal_target: category.goal_target ? category.goal_target / 1000 : null,
            goal_target_month: category.goal_target_month
          })),
          income: monthDetail.income_earned / 1000,
          budgeted: monthDetail.budgeted / 1000,
          activity: monthDetail.activity / 1000,
          to_be_budgeted: monthDetail.to_be_budgeted / 1000
        }
      };
    } catch (error) {
      console.error('Error fetching budget details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

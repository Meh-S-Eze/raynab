import { Category, CurrencyFormat } from '../src/types';
import { CategoryGoalTypeEnum } from 'ynab';
import { formatToReadableAmount } from '../src/lib/utils/transactions';
import { Color, Icon } from '@raycast/api';

type GoalShape = 'underfunded' | 'funded' | 'overspent' | 'neutral';

export class Category {
  private category: Category;

  constructor(category: Category) {
    this.category = category;
  }

  public get id(): string {
    return this.category.id;
  }

  public get name(): string {
    return this.category.name;
  }

  public get categoryGroupId(): string {
    return this.category.category_group_id;
  }

  /**
   * Determine the current state of a category based on its goal progress.
   */
  public assessGoalShape(): GoalShape {
    // No matter the goal type, if the balance is negative, the goal has been overspent
    if (this.category.balance < 0) return 'overspent';

    switch (this.category.goal_type) {
      case CategoryGoalTypeEnum.Tb:
        return this.category.goal_percentage_complete === 100
          ? 'funded'
          : Number(this.category.goal_percentage_complete) > 0
            ? 'underfunded'
            : 'neutral';
      case CategoryGoalTypeEnum.Tbd:
      case CategoryGoalTypeEnum.Need:
      case CategoryGoalTypeEnum.Mf:
      case CategoryGoalTypeEnum.Debt:
        return this.category.goal_percentage_complete === 100 || this.category.goal_under_funded === 0 ? 'funded' : 'underfunded';
      default:
        return this.category.budgeted < 0 ? 'overspent' : 'neutral';
    }
  }

  /**
   * Assign specific colors to each goal shape.
   */
  public displayGoalColor(goalShape: GoalShape) {
    switch (goalShape) {
      case 'neutral':
        return Color.SecondaryText;
      case 'funded':
        return Color.Green;
      case 'underfunded':
        return Color.Yellow;
      case 'overspent':
        return Color.Red;
    }
  }

  /**
   * Returns a specific icon for each supported goal type.
   */
  public displayGoalType(category: Category) {
    switch (category.goal_type) {
      case CategoryGoalTypeEnum.Tb:
        return Icon.BullsEye;
      case CategoryGoalTypeEnum.Tbd:
        return Icon.Calendar;
      case CategoryGoalTypeEnum.Need:
        return Icon.Cart;
      case CategoryGoalTypeEnum.Mf:
        return Icon.Goal;
      case CategoryGoalTypeEnum.Debt:
        return Icon.BankNote;
      default:
        return Icon.XMarkCircle;
    }
  }

  /**
   * Formats a category's goal target into a human-readable string based on its goal type.
   * Returns a string describing the goal amount and timing (if applicable).
   *
   * @param currency - The currency format to use for the target amount
   * @returns A formatted string describing the goal (e.g. "Budget $3,000 by August 2025")
   */
  public formatGoalType(currency: CurrencyFormat): string {
    if (!this.category.goal_type) return 'No Goal';

    const target = formatToReadableAmount({ amount: this.category.goal_target ?? 0, currency });

    switch (this.category.goal_type) {
      case CategoryGoalTypeEnum.Tb: {
        return `Budget ${target} anytime`;
      }
      case CategoryGoalTypeEnum.Tbd: {
        const deadline = new Intl.DateTimeFormat('en-us', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
          new Date(String(this.category.goal_target_month)),
        );
        return `Budget ${target} by ${deadline}`;
      }
      case CategoryGoalTypeEnum.Need:
        return `Save and spend ${target}`;
      case CategoryGoalTypeEnum.Mf:
        return `Budget ${target} monthly`;
      case CategoryGoalTypeEnum.Debt:
        return 'Pay down ${target} monthly';
      default:
        return 'Goal Unknown';
    }
  }
}

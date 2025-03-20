import { getBudgetSummary } from '../../src/lib/api';

// Mock the API response
jest.mock('../../src/lib/api', () => ({
  getBudgetSummary: jest.fn()
}));

describe('getBudgetSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return budget summary when successful', async () => {
    const mockSummary = {
      income: 1000,
      budgeted: 800,
      activity: -500,
      currency_format: {
        iso_code: 'USD',
        decimal_digits: 2,
        decimal_separator: '.',
        symbol_first: true,
        group_separator: ',',
        currency_symbol: '$',
        display_symbol: true
      }
    };

    (getBudgetSummary as jest.Mock).mockResolvedValue(mockSummary);

    const result = await getBudgetSummary();
    expect(result).toEqual(mockSummary);
    expect(getBudgetSummary).toHaveBeenCalledTimes(1);
  });

  it('should return null when no budget is selected', async () => {
    (getBudgetSummary as jest.Mock).mockResolvedValue(null);

    const result = await getBudgetSummary();
    expect(result).toBeNull();
    expect(getBudgetSummary).toHaveBeenCalledTimes(1);
  });

  it('should throw error when API call fails', async () => {
    const error = new Error('API Error');
    (getBudgetSummary as jest.Mock).mockRejectedValue(error);

    await expect(getBudgetSummary()).rejects.toThrow('API Error');
    expect(getBudgetSummary).toHaveBeenCalledTimes(1);
  });
}); 
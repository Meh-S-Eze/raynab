// Mock Raycast API
jest.mock('@raycast/api', () => ({
  getPreferenceValues: jest.fn(),
  Tool: {
    Confirmation: jest.fn()
  }
}));

// Mock Raycast utils
jest.mock('@raycast/utils', () => ({
  useLocalStorage: jest.fn()
})); 
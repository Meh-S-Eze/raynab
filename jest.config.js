module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@srcTypes$': '<rootDir>/src/types'
  },
  setupFiles: ['<rootDir>/jest.setup.js']
}; 
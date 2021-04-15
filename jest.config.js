module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^wint$': '<rootDir>/src',
  },
  coverageDirectory: '<rootDir>/docs/dist/coverage',
}

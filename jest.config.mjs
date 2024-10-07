// jest.config.mjs
export default {
  testEnvironment: 'node', // Use the Node.js environment
  moduleFileExtensions: ['js'], // Specify file extensions Jest should recognize
  testMatch: ['**/?(*.)+(spec|test).[jt]s'], // Specify test file patterns
  transformIgnorePatterns: ['/node_modules/'], // Ignore node_modules unless specified
};

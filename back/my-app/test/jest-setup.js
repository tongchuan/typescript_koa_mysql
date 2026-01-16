// Convert ES module imports to CommonJS requires to fix Jest parsing issue
require('@testing-library/jest-dom');
const { configure } = require('@testing-library/react');

// Configure testing library to not warn about async act
configure({ asyncUtilTimeout: 1000 });

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console.error to prevent test output pollution
console.error = jest.fn();
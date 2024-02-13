module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsdoc'],
  extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
  ],
  rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Require explicit return types in public functions
      '@typescript-eslint/no-explicit-any': 'off', // Disallow usage of 'any' type
      '@typescript-eslint/no-unused-vars': 'error', // Disallow unused variables
      'jsdoc/require-jsdoc': 'error', // Require JSDoc comments
      'jsdoc/require-param-type': 'error', // Require JSDoc param types
      'jsdoc/require-returns-type': 'error' // Require JSDoc return types
      // Add more rules as needed
  }
};

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Zero-Allocation Policy: Restrict usage of 'new' in hot paths (enforced manually or via strict review)
    // No Float / Math functions policy
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
        message: 'Do not use Math.random(). Use the deterministic PRNG from @ascii-game/core-math instead.'
      },
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="sin"]',
        message: 'Do not use Math.sin(). Use fixed-point math equivalents.'
      },
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="cos"]',
        message: 'Do not use Math.cos(). Use fixed-point math equivalents.'
      },
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="tan"]',
        message: 'Do not use Math.tan(). Use fixed-point math equivalents.'
      },
      {
        selector: 'CallExpression[callee.object.name="Math"][callee.property.name="atan2"]',
        message: 'Do not use Math.atan2(). Use fixed-point math equivalents.'
      }
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
};

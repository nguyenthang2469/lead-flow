module.exports = {
  ...require('@repo/prettier-config/index.js'),
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['cva', 'cn', 'clsx'],
};

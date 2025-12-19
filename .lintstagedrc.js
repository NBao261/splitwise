module.exports = {
  // Front-end source files only
  'front-end/src/**/*.{ts,tsx,js,jsx}': (filenames) => {
    // Filter out any node_modules files just in case
    const filtered = filenames.filter((f) => !f.includes('node_modules'));
    if (filtered.length === 0) return [];
    return [
      'npm run lint:fix --prefix front-end',
      'npm run format --prefix front-end',
    ];
  },
  // Front-end config files
  'front-end/tsconfig*.json': () => 'npm run format --prefix front-end',
  'front-end/vite.config.ts': () => 'npm run format --prefix front-end',
  // Back-end source files only
  'back-end/src/**/*.{ts,js}': (filenames) => {
    // Filter out any node_modules files just in case
    const filtered = filenames.filter((f) => !f.includes('node_modules'));
    if (filtered.length === 0) return [];
    return [
      'npm run lint:fix --prefix back-end',
      'npm run format --prefix back-end',
    ];
  },
  // Back-end config files
  'back-end/tsconfig*.json': () => 'npm run format --prefix back-end',
  'back-end/.eslintrc.json': () => 'npm run format --prefix back-end',
  'back-end/.prettierrc.json': () => 'npm run format --prefix back-end',
};

const path = require('path');

module.exports = {
  // Front-end source files only
  'front-end/src/**/*.{ts,tsx,js,jsx}': (filenames) => {
    // Filter out any node_modules files just in case
    const filtered = filenames.filter((f) => !f.includes('node_modules'));
    if (filtered.length === 0) return [];
    
    // Convert to relative paths from front-end directory
    const relativePaths = filtered.map((f) => {
      const rel = path.relative('front-end', f);
      return rel.replace(/\\/g, '/');
    });
    
    // Use --prefix to run from front-end directory
    return [
      `npm run lint:files --prefix front-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`,
      `npm run format:files --prefix front-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`,
    ];
  },
  // Front-end config files
  'front-end/tsconfig*.json': (filenames) => {
    const relativePaths = filenames.map((f) => {
      const rel = path.relative('front-end', f);
      return rel.replace(/\\/g, '/');
    });
    return `npm run format:files --prefix front-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`;
  },
  'front-end/vite.config.ts': (filenames) => {
    const relativePaths = filenames.map((f) => {
      const rel = path.relative('front-end', f);
      return rel.replace(/\\/g, '/');
    });
    return `npm run format:files --prefix front-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`;
  },
  // Back-end source files only
  'back-end/src/**/*.{ts,js}': (filenames) => {
    // Filter out any node_modules files just in case
    const filtered = filenames.filter((f) => !f.includes('node_modules'));
    if (filtered.length === 0) return [];
    
    // Convert to relative paths from back-end directory
    const relativePaths = filtered.map((f) => {
      const rel = path.relative('back-end', f);
      return rel.replace(/\\/g, '/');
    });
    
    // Use --prefix to run from back-end directory
    return [
      `npm run lint:files --prefix back-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`,
      `npm run format:files --prefix back-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`,
    ];
  },
  // Back-end config files
  'back-end/tsconfig*.json': (filenames) => {
    const relativePaths = filenames.map((f) => {
      const rel = path.relative('back-end', f);
      return rel.replace(/\\/g, '/');
    });
    return `npm run format:files --prefix back-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`;
  },
  'back-end/.eslintrc.json': (filenames) => {
    const relativePaths = filenames.map((f) => {
      const rel = path.relative('back-end', f);
      return rel.replace(/\\/g, '/');
    });
    return `npm run format:files --prefix back-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`;
  },
  'back-end/.prettierrc.json': (filenames) => {
    const relativePaths = filenames.map((f) => {
      const rel = path.relative('back-end', f);
      return rel.replace(/\\/g, '/');
    });
    return `npm run format:files --prefix back-end -- ${relativePaths.map((p) => `"${p}"`).join(' ')}`;
  },
};

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

// Preserve the React 18 hook checks used before this migration. The app does not
// enable React Compiler; its optional compiler diagnostics are a separate review.
// All Next.js/Core Web Vitals, React, accessibility and import checks are retained.
const classicHookRules = new Set(['react-hooks/rules-of-hooks', 'react-hooks/exhaustive-deps']);
const config = nextVitals.map(entry => ({
  ...entry,
  ...(entry.rules ? { rules: Object.fromEntries(Object.entries(entry.rules).filter(
    ([name]) => !name.startsWith('react-hooks/') || classicHookRules.has(name),
  )) } : {}),
}));

export default defineConfig([
  ...config,
  globalIgnores(['.next*/**', 'node_modules/**']),
]);

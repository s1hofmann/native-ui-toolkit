module.exports = {
  "mode": "file",
  exclude: [
    '**/dist/**',
    '**/node_modules/**',
    '**/*.spec.ts',
    '**/__mocks__/**',
  ],
  readme: 'README.md',
  excludePrivate: true,
  excludeExternals: true,
  excludeProtected: true,
  excludeNotExported: true,
  includeDeclarations: false,
  hideGenerator: true,
  theme: 'default',
};

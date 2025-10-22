import js from '@eslint/js'
import react from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        React: 'readonly',
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        global: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      'prisma/**'
    ]
  }
]

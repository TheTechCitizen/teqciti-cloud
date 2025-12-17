// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Catches console.log as a warning (shows a message but doesn't fail)
      // while allowing console.warn and console.error.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
    prettier,
)

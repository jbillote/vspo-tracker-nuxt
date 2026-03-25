// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['**/node_modules', '**/public', '**/.nuxt', 'app/components/ui/**'],
  },
  {
    rules: {
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'any',
          },
        },
      ],
    },
  },
)

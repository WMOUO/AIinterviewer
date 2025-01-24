import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  typescript: true,
  vue: true
}).override('nuxt/typescript/setup',{})
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/ban-types': 'off',
      'vue/multi-word-component-names': 'off'
    }
  })

import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en',
  title: 'Wint API',
  description: 'API for Wint, easy i18n for your web app.',

  dest: 'docs/dist',
})

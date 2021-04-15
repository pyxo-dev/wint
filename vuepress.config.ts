import type { DefaultThemeOptions } from 'vuepress'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en',
  title: 'Wint',
  description: 'Wint, easy i18n for your web app.',

  dest: 'docs/dist',
})

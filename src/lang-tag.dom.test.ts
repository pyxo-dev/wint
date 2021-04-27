import { JSDOM } from 'jsdom'
import { getLangTag } from '.'

const langTags = ['arb', 'en-GB', 'zh-Hant-HK', 'zh-yue', 'es-419', 'es', 'en']

test('[getLangTag] prefix mode: with a matching prefix, should return the corresponding lang tag.', () => {
  const dom = new JSDOM('', { url: 'https://example.com/es/blog' })
  globalThis.location = dom.window.location
  expect(getLangTag({ langTags })).toBe('es')
})

test('[getLangTag] subdomain mode: with a matching subdomain, should return the corresponding lang tag.', () => {
  const dom = new JSDOM('', { url: 'https://en.example.com/blog' })
  globalThis.location = dom.window.location
  expect(getLangTag({ langTags, urlMode: 'subdomain' })).toBe('en')
})

test('[getLangTag] search-param mode: with a matching search param, should return the corresponding lang tag.', () => {
  const dom = new JSDOM('', { url: 'https://example.com/blog?l=en' })
  globalThis.location = dom.window.location
  expect(getLangTag({ langTags, urlMode: 'search-param' })).toBe('en')
})

test('[getLangTag] client preferred lang tags enabled: with a matching preference, should return the corresponding lang tag.', () => {
  const dom = new JSDOM()
  globalThis.navigator = dom.window.navigator
  Object.defineProperty(globalThis.navigator, 'languages', {
    get() {
      return ['en-US', 'de', 'es']
    },
  })

  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useClientPreferredLangTags: true,
    })
  ).toBe('en')
})

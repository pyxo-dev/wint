import { getLangTag } from '.'

const langTags = ['arb', 'en-GB', 'zh-Hant-HK', 'zh-yue', 'es-419', 'es', 'en']
const langTagsHosts = {
  arb: 'arb-example.com',
  'zh-Hant-HK': 'zh-Hant-HK-example.com',
  'zh-yue': 'zh-yue-example.com',
  'es-419': 'es-419-example.com',
  es: 'es-example.com',
  en: 'en-example.com',
}

test('[getLangTag] invalid input: with empty langTags, should return `undefined`', () => {
  expect(getLangTag({ langTags: [] })).toBeUndefined()
})

test('[getLangTag] prefix mode: without a matching prefix, should fallback to the first lang tag.', () => {
  expect(getLangTag({ langTags })).toBe('arb')
  expect(getLangTag({ langTags, url: '/it/blog' })).toBe('arb')
})

test('[getLangTag] prefix mode: with a matching prefix, should return the corresponding lang tag.', () => {
  expect(getLangTag({ langTags, url: '/zh-yue/blog' })).toBe('zh-yue')
})

test('[getLangTag] subdomain mode: without a matching subdomain, should fallback to the first lang tag.', () => {
  expect(getLangTag({ langTags, urlMode: 'subdomain' })).toBe('arb')
  expect(
    getLangTag({ langTags, urlMode: 'subdomain', host: 'it.example.com' })
  ).toBe('arb')
})

test('[getLangTag] subdomain mode: with a matching subdomain, should return the corresponding lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'subdomain',
      host: 'es-419.example.com',
    })
  ).toBe('es-419')
})

test('[getLangTag] host mode: without a matching host, should fallback to the first lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'host',
      host: 'example.com',
    })
  ).toBe('arb')

  expect(
    getLangTag({
      langTags,
      urlMode: 'host',
      langTagsHosts,
    })
  ).toBe('arb')

  expect(
    getLangTag({
      langTags,
      urlMode: 'host',
      langTagsHosts,
      host: 'example.com',
    })
  ).toBe('arb')
})

test('[getLangTag] host mode: with a matching host, should return the corresponding lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'host',
      langTagsHosts,
      host: 'en-example.com',
    })
  ).toBe('en')
})

test('[getLangTag] search-param mode: without a matching search param, should fallback to the first lang tag.', () => {
  expect(getLangTag({ langTags, urlMode: 'search-param' })).toBe('arb')

  expect(
    getLangTag({ langTags, urlMode: 'search-param', url: '/blog?l=it' })
  ).toBe('arb')

  expect(
    getLangTag({ langTags, urlMode: 'search-param', url: '/blog?lg=it' })
  ).toBe('arb')
})

test('[getLangTag] search-param mode: with a matching search param, should return the corresponding lang tag.', () => {
  expect(
    getLangTag({ langTags, urlMode: 'search-param', url: '/blog?l=en' })
  ).toBe('en')
})

test('[getLangTag] cookie enabled: without a matching cookie, should fallback to the first lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useCookie: true,
    })
  ).toBe('arb')

  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useCookie: true,
      cookie: 'strawberry_cookie=tasty',
    })
  ).toBe('arb')

  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useCookie: true,
      cookie: 'lang_tag=it; strawberry_cookie=tasty',
    })
  ).toBe('arb')
})

test('[getLangTag] cookie enabled: with a matching cookie, should return the corresponding lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useCookie: true,
      cookie: 'lang_tag=zh-Hant-HK; strawberry_cookie=tasty',
    })
  ).toBe('zh-Hant-HK')
})

test('[getLangTag] client preferred lang tags enabled: without a matching preference, should fallback to the first lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useClientPreferredLangTags: true,
    })
  ).toBe('arb')

  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useClientPreferredLangTags: true,
      clientPreferredLangTags: 'it-US;q=0.8, de;q=0.7',
    })
  ).toBe('arb')
})

test('[getLangTag] client preferred lang tags enabled: with a matching preference, should return the corresponding lang tag.', () => {
  expect(
    getLangTag({
      langTags,
      urlMode: 'none',
      useClientPreferredLangTags: true,
      clientPreferredLangTags: 'en-US;q=0.8, de;q=0.7, es;q=0.5',
    })
  ).toBe('en')
})

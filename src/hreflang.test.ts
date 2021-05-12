import { hreflang, hreflangPaths } from '.'

const hrefs = {
  arb: 'https://example.com/arb',
  es: 'https://example.com/es',
  en: 'https://example.com/en',
}
const xDefaultLangTag = 'arb'
const expectedHreflangLinks = {
  'hreflang-arb': {
    rel: 'alternate',
    hreflang: 'arb',
    href: 'https://example.com/arb',
  },
  'hreflang-en': {
    rel: 'alternate',
    hreflang: 'en',
    href: 'https://example.com/en',
  },
  'hreflang-es': {
    rel: 'alternate',
    hreflang: 'es',
    href: 'https://example.com/es',
  },
  'hreflang-x-default': {
    rel: 'alternate',
    hreflang: 'x-default',
    href: 'https://example.com/arb',
  },
}

/**
 * hreflang function.
 */
test('[hreflang] invalid input: with empty xDefaultLangTag, should return `undefined`', () => {
  expect(hreflang({ hrefs, xDefaultLangTag: '' })).toBeUndefined()
})

test('[hreflang] invalid input: when `hrefs` does not contain xDefaultLangTag, should return `undefined`', () => {
  expect(hreflang({ hrefs, xDefaultLangTag: 'en-GB' })).toBeUndefined()
})

test('[hreflang] valid input: should return an object', () => {
  expect(hreflang({ hrefs, xDefaultLangTag })).toStrictEqual(
    expectedHreflangLinks
  )
})

test('[hreflang] with `hreflangs` provided, should use them in place of langTags', () => {
  const { ['hreflang-arb']: _, ...newExpectedLinks } = {
    ...expectedHreflangLinks,
    'hreflang-ar': {
      rel: 'alternate',
      hreflang: 'ar',
      href: 'https://example.com/arb',
    },
  }

  expect(
    hreflang({ hrefs, xDefaultLangTag, hreflangs: { arb: 'ar' } })
  ).toStrictEqual(newExpectedLinks)
})

/**
 * hreflangPaths function.
 */
test('[hreflangPaths] With valid input, should return an object.', () => {
  const paths = { es: '/blog/reciente', en: '/blog/recent' }
  const xDefaultLangTag = 'es'

  expect(
    hreflangPaths({
      paths,
      xDefaultLangTag,
      protocol: 'http',
      host: 'example.com',
    })
  ).toStrictEqual({
    'hreflang-en': {
      href: 'http://example.com/en/blog/recent',
      hreflang: 'en',
      rel: 'alternate',
    },
    'hreflang-es': {
      href: 'http://example.com/es/blog/reciente',
      hreflang: 'es',
      rel: 'alternate',
    },
    'hreflang-x-default': {
      href: 'http://example.com/es/blog/reciente',
      hreflang: 'x-default',
      rel: 'alternate',
    },
  })

  expect(
    hreflangPaths({
      paths,
      xDefaultLangTag,
      protocol: 'http',
      urlMode: 'host',
      langTagsHosts: { es: 'example-es.com', en: 'example.co.uk' },
    })
  ).toStrictEqual({
    'hreflang-en': {
      href: 'http://example.co.uk/blog/recent',
      hreflang: 'en',
      rel: 'alternate',
    },
    'hreflang-es': {
      href: 'http://example-es.com/blog/reciente',
      hreflang: 'es',
      rel: 'alternate',
    },
    'hreflang-x-default': {
      href: 'http://example-es.com/blog/reciente',
      hreflang: 'x-default',
      rel: 'alternate',
    },
  })
})

test('[hreflangPaths] With invalid input, should return undefined.', () => {
  const paths = { es: '/blog/reciente', en: '/blog/recent' }
  const xDefaultLangTag = 'es'
  expect(
    hreflangPaths({
      paths,
      xDefaultLangTag,
    })
  ).toBeUndefined()
})

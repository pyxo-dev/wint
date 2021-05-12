import { getPathHref } from '.'

/**
 * getPathHref function.
 */

const path = '/blog/recent?key=value'
const langTag = 'en'
const host = 'example.com'

test('[getPathHref] With invalid input, should return undefined', () => {
  expect(getPathHref({ path, langTag: '' })).toBeUndefined()
  expect(getPathHref({ path, langTag })).toBeUndefined()
  expect(getPathHref({ path, langTag })).toBeUndefined()
})

test('[getPathHref] Prefix mode.', () => {
  expect(getPathHref({ path, langTag, host })).toBe(
    'https://example.com/en/blog/recent?key=value'
  )
})

test('[getPathHref] Subdomain mode.', () => {
  expect(getPathHref({ path, langTag, urlMode: 'subdomain' })).toBeUndefined()

  expect(
    getPathHref({
      path,
      langTag,
      urlMode: 'subdomain',
      domain: 'example.com',
    })
  ).toBe('https://en.example.com/blog/recent?key=value')
})

test('[getPathHref] Host mode.', () => {
  expect(getPathHref({ path, langTag, urlMode: 'host' })).toBeUndefined()

  expect(
    getPathHref({
      path,
      langTag,
      urlMode: 'host',
      langTagHost: 'example-en.com',
    })
  ).toBe('https://example-en.com/blog/recent?key=value')
})

test('[getPathHref] Search param mode.', () => {
  expect(
    getPathHref({
      path,
      langTag,
      urlMode: 'search-param',
      host,
    })
  ).toBe('https://example.com/blog/recent?key=value&l=en')
})

test('[getPathHref] "none" mode.', () => {
  expect(
    getPathHref({
      path,
      langTag,
      urlMode: 'none',
      host,
    })
  ).toBe('https://example.com/blog/recent?key=value')
})

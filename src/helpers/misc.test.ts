import { getPathHref } from '.'

/**
 * getPathHref function.
 */

const urlPath = '/blog/recent?key=value'
const langTag = 'en'
const urlProtocol = 'https'
const urlHost = 'example.com'

test('[getPathHref] With invalid input, should return undefined', () => {
  expect(getPathHref({ urlPath, langTag: '' })).toBeUndefined()
  expect(getPathHref({ urlPath, langTag })).toBeUndefined()
  expect(getPathHref({ urlPath, langTag, urlProtocol })).toBeUndefined()
})

test('[getPathHref] Prefix mode.', () => {
  expect(getPathHref({ urlPath, langTag, urlProtocol, urlHost })).toBe(
    'https://example.com/en/blog/recent?key=value'
  )
})

test('[getPathHref] Subdomain mode.', () => {
  expect(
    getPathHref({ urlPath, langTag, urlMode: 'subdomain', urlProtocol })
  ).toBeUndefined()

  expect(
    getPathHref({
      urlPath,
      langTag,
      urlMode: 'subdomain',
      urlProtocol,
      domain: 'example.com',
    })
  ).toBe('https://en.example.com/blog/recent?key=value')
})

test('[getPathHref] Host mode.', () => {
  expect(
    getPathHref({ urlPath, langTag, urlMode: 'host', urlProtocol })
  ).toBeUndefined()

  expect(
    getPathHref({
      urlPath,
      langTag,
      urlMode: 'host',
      urlProtocol,
      langTagHost: 'example-en.com',
    })
  ).toBe('https://example-en.com/blog/recent?key=value')
})

test('[getPathHref] Search param mode.', () => {
  expect(
    getPathHref({
      urlPath,
      langTag,
      urlMode: 'search-param',
      urlProtocol,
      urlHost,
    })
  ).toBe('https://example.com/blog/recent?key=value&l=en')
})

test('[getPathHref] "none" mode.', () => {
  expect(
    getPathHref({
      urlPath,
      langTag,
      urlMode: 'none',
      urlProtocol,
      urlHost,
    })
  ).toBe('https://example.com/blog/recent?key=value')
})

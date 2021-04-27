import { JSDOM } from 'jsdom'
import { getPathHref } from '.'

/**
 * getPathHref function.
 */

const urlPath = '/blog/recent?key=value'
const langTag = 'en'

test('[getPathHref] Prefix mode.', () => {
  const dom = new JSDOM('', { url: 'https://example.com' })
  globalThis.location = dom.window.location

  expect(getPathHref({ urlPath, langTag })).toBe(
    'https://example.com/en/blog/recent?key=value'
  )
})

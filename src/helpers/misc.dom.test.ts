import { JSDOM } from 'jsdom'
import { getPathHref } from '.'

/**
 * getPathHref function.
 */

const path = '/blog/recent?key=value'
const langTag = 'en'

test('[getPathHref] Prefix mode.', () => {
  const dom = new JSDOM('', { url: 'https://example.com' })
  globalThis.location = dom.window.location

  expect(getPathHref({ path, langTag })).toBe(
    'https://example.com/en/blog/recent?key=value'
  )
})

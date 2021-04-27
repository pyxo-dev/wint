import { JSDOM } from 'jsdom'
import { getLangTagCookie, setLangTagCookie } from '.'

/**
 * setLangTagCookie function.
 */
test('[setLangTagCookie] In a dom environment, should set the cookie.', () => {
  const dom = new JSDOM()
  globalThis.document = dom.window.document

  expect(
    setLangTagCookie({
      langTag: 'en-GB',
      cookieOptions: { maxAge: 60 },
    })
  ).toBe('lang_tag=en-GB; Max-Age=60')

  expect(globalThis.document.cookie).toBe('lang_tag=en-GB')

  /**
   * getLangTagCookie function.
   */
  expect(getLangTagCookie()).toBe('en-GB')
})

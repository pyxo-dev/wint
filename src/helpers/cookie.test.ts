import httpMocks from 'node-mocks-http'
import { getLangTagCookie, setLangTagCookie } from '.'

/**
 * getLangTagCookie function.
 */
test(`[getLangTagCookie] Without any cookies provided (or set), should return
'undefined'.`, () => {
  expect(getLangTagCookie()).toBeUndefined()
})

test(`[getLangTagCookie] With cookies provided, should return the cookie
value.`, () => {
  expect(
    getLangTagCookie({ cookies: 'lang_tag=en; strawberry_cookie=tasty' })
  ).toBe('en')
})

test('[getLangTagCookie] With `cookieKey` provided.', () => {
  expect(
    getLangTagCookie({
      cookieKey: 'langTag',
      cookies: 'langTag=en; strawberry_cookie=tasty',
    })
  ).toBe('en')
})

/**
 * setLangTagCookie function.
 */
test('[setLangTagCookie] With an empty langTag, should return undefined.', () => {
  expect(setLangTagCookie({ langTag: '' })).toBeUndefined()
})

test(`[setLangTagCookie] When no serverResponse provided, and not in a dom
environment, should return undefined.`, () => {
  expect(setLangTagCookie({ langTag: 'en' })).toBeUndefined()
})

test('[setLangTagCookie] With a serverResponse provided, should set the cookie.', () => {
  const res = httpMocks.createResponse()
  expect(
    setLangTagCookie({
      langTag: 'ar',
      cookieOptions: { sameSite: 'lax' },
      serverResponse: res,
    })
  ).toBe('lang_tag=ar; SameSite=Lax')

  expect(res.getHeader('Set-Cookie')).toBe('lang_tag=ar; SameSite=Lax')
})

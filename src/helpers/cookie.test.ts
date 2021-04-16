import { getLangTagCookie } from '.'

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

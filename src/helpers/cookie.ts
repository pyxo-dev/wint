import type { CookieSerializeOptions } from 'cookie'
import { parse, serialize } from 'cookie'
import type { ServerResponse } from 'http'

/**
 * Options for `getLangTagCookie` function.
 *
 * @beta
 */
export interface GetLangTagCookieOptions {
  /**
   * {@inheritDoc WintCookieConf.cookieKey}
   *
   * @defaultValue 'lang_tag'
   */
  cookieKey?: string
  /**
   * A cookies list, written using the same syntax of the http 'Cookie' header.
   *
   * See {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie#syntax | 'Cookie' header syntax}
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve the cookies automatically
   * from `globalThis.document.cookie` (available in a `dom` environment).
   *
   * ::: tip
   *
   * In a server environment you can get the cookies from the request object
   * 'Cookie' header.
   *
   * :::
   *
   * @example
   * ```ts
   * cookies: 'lang_tag=en; strawberry_cookie=tasty'
   * ```
   */
  cookies?: string
}

/**
 * Gets the value of the language tag cookie.
 *
 * @beta
 *
 * @param options - Options object.
 * @returns The language tag cookie value, or `undefined` if the cookie is not
 * set.
 */
export function getLangTagCookie(
  options: GetLangTagCookieOptions = {}
): string | undefined {
  const { cookieKey, cookies } = options

  // Language tag cookie key. When not provided default it to `lang_tag`.
  const key = cookieKey || 'lang_tag'

  // The `document` object might be undefined in a non `dom` environment, the
  // following will add `undefined` to its type.
  const document = <Document | undefined>globalThis?.document

  // If cookies are not provided, try to retrieve them (when in a browser env).
  const cookie_str = cookies || document?.cookie

  // After parsing the cookie string, we return the language tag cookie.
  if (cookie_str) return parse(cookie_str)[key]
}

/**
 * Options for `setLangTagCookie` function.
 *
 * @beta
 */
export interface SetLangTagCookieOptions {
  /**
   * The language tag to set the cookie to.
   */
  langTag: string
  /**
   * {@inheritDoc WintCookieConf.cookieOptions}
   *
   * @example
   * ```ts
   * cookieOptions: { sameSite: 'lax', maxAge: 60*60*24 }
   * ```
   */
  cookieOptions?: CookieSerializeOptions
  /**
   * {@inheritDoc WintCookieConf.cookieKey}
   *
   * @defaultValue 'lang_tag'
   */
  cookieKey?: string
  /**
   * The server response object to attach the cookie header to.
   *
   * @remarks
   *
   * When not provided, Wint will use `globalThis.document.cookie` to set the
   * cookie in a `dom` environment.
   */
  serverResponse?: ServerResponse
}

/**
 * Sets the value of the language tag cookie.
 *
 * @beta
 *
 * @param options - Options object.
 * @returns The language tag cookie string, or `undefined` if not in a `dom`
 * environment and no server response object was provided.
 */
export function setLangTagCookie(
  options: SetLangTagCookieOptions
): string | undefined {
  const { langTag, cookieOptions, cookieKey, serverResponse: res } = options

  // Validate the language tag.
  if (!langTag) {
    console.error(`
[Wint setLangTagCookie] The provided language tag cannot be empty.
`)
    return
  }

  // The `document` object might be undefined in a non `dom` environment, the
  // following will add `undefined` to its type.
  const document = <Document | undefined>globalThis?.document

  // Check that either the response object is provided, or the 'document' object
  // exists.
  if (!res && !document) {
    console.error(`
[Wint setLangTagCookie] No server response object provided, and no 'document'
object found.
`)
    return
  }

  // Language tag cookie key.
  const key = cookieKey || 'lang_tag'

  // Construct the cookie string.
  const cookie = serialize(key, langTag, cookieOptions)

  // In a server environment.
  if (res) res.setHeader('Set-Cookie', cookie)

  // In a browser environment.
  if (document) document.cookie = cookie

  // Return the language tag cookie string.
  return cookie
}

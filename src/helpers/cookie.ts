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
   * from `globalThis.document.cookie` (available in a browser environment).
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

  // Language tag cookie key.
  const key = cookieKey || 'lang_tag'

  return (cookies || globalThis?.document?.cookie)
    ?.split(';')
    .find((c) => c.includes(`${key}=`))
    ?.split('=')[1]
    .trim()
}

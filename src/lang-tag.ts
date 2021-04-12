import Negotiator from 'negotiator'
import type { WintUrlConf } from './types'

/**
 * Options for `getLangTag` function.
 * @alpha
 */
export interface GetLangTagOptions {
  /**
   * List of the language tags to choose from.
   *
   * See {@link WintConf.langTags}
   *
   * @example
   * ```ts
   * langTags: ['ar', 'en-GB']
   * ```
   */
  langTags: string[]
  /**
   * {@inheritDoc WintUrlConf.mode}
   *
   * @defaultValue 'prefix'
   *
   * @example Examples
   *
   * 'prefix' mode:
   * 'example.com/es', 'example.com/en-GB'
   *
   * 'subdomain' mode:
   * 'es.example.com', 'en-GB.example.com'
   *
   * 'host' mode:
   * Each language tag has its own host.
   *
   * 'example.es', 'example.co.uk'
   * 'my-spanish-site.com', 'my-english-site.com'
   * 'localhost:8000' (for spanish), 'localhost:8001' (for english)
   *
   * 'search-param' mode:
   * 'example.com?lang=es', 'example.com?lang=en-GB'
   *
   * 'none' mode:
   * 'example.com' (the same URL used for all language tags)
   */
  mode?: WintUrlConf['mode']
  /**
   * The URL host (including the port if any) to use when determining the
   * language tag in 'subdomain' and 'host' modes.
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve it automatically from
   * `globalThis.location` (available in a browser environment).
   *
   * Tip: In a server environment you can get the host from the request object.
   *
   * @example
   * ```ts
   * urlHost: 'example.com'
   * urlHost: 'my-app.example.com:8000'
   * ```
   */
  urlHost?: string
  /**
   * The part of the URL that comes after the host. Used when determining the
   * language tag in 'prefix' and 'search-param' modes.
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve it automatically from
   * `globalThis.location` (available in a browser environment).
   *
   * Tip: In a server environment you can get the path from the request object.
   *
   * @example
   * ```ts
   * urlPath: '/en/blog' // 'prefix' mode
   * urlPath: '/blog?l=en' // 'search-param' mode
   * ```
   */
  urlPath?: string
  /**
   * {@inheritDoc WintUrlConf.searchParamKey}
   *
   * @defaultValue 'l'
   *
   * @example `searchParamKey` examples
   * ```ts
   * searchParamKey: 'langTag' // 'example.com/blog?langTag=en'
   * searchParamKey: 'lang'    // 'example.com/blog?lang=en'
   * ```
   */
  searchParamKey?: string
  /**
   * An object containing the hosts corresponding to the provided language tags.
   * Needed when the URL structure mode is set to 'host'.
   *
   * See {@link WintLangTagConf.host}
   *
   * @example
   * ```ts
   * langTagsHosts: {es: 'example-es.com', 'en-GB': 'example.co.uk'}
   * langTagsHosts: {es: 'localhost:8000', 'en-GB': 'localhost:8001'}
   * ```
   */
  langTagsHosts?: { [langTag: string]: string }
  /**
   * {@inheritDoc WintCookieConf.useCookie}
   *
   * @defaultValue `false`
   */
  useCookie?: boolean
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
   * Tip: In a server environment you can get the cookies from the request
   * object 'Cookie' header.
   *
   * @example
   * ```ts
   * cookies: 'lang_tag=en; strawberry_cookie=tasty'
   * ```
   */
  cookies?: string
  /**
   * {@inheritDoc WintConf.useClientPreferredLangTags}
   *
   * @defaultValue `false`
   */
  useClientPreferredLangTags?: boolean
  /**
   * A list of preferred language tags, written using the same syntax of the
   * http 'Accept-Language' header.
   *
   * See {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language#syntax | 'Accept-Language' header syntax}
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve the preferences automatically
   * from `globalThis.navigator.languages` (available in a browser environment).
   *
   * Tip: In a server environment you can get the preferences from the request
   * object 'Accept-Language' header.
   *
   * @example
   * ```ts
   * clientPreferredLangTags: 'ar, en;q=0.8, de;q=0.7'
   * ```
   */
  clientPreferredLangTags?: string
}

/**
 * Selects a language tag from a provided list based on a specified URL mode, a
 * cookie, user's client preferences or a fallback to the first language tag in
 * the provided list.
 * @alpha
 *
 * @remarks
 *
 * Note that the use of the the cookie or the client preferences is optional.
 *
 * @param getLangTagOptions - Options object.
 * @returns The chosen language tag, or `undefined` when the provided language
 * tags list is empty or contains an empty string.
 *
 * @example
 * ```ts
 * const langTags = ['ar', 'en-US', 'tr', 'it', 'es']
 * getLangTag({langTags}) // returns 'it' for 'https://example.com/it/blog'
 * ```
 */
export function getLangTag({
  langTags,
  mode,
  urlHost,
  urlPath,
  searchParamKey,
  langTagsHosts,
  useCookie,
  cookieKey,
  cookies,
  useClientPreferredLangTags,
  clientPreferredLangTags,
}: GetLangTagOptions): string | undefined {
  // Remove duplicates if any.
  const tags = [...new Set(langTags)]

  // Validate the list of language tags.
  if (tags.length === 0 || tags.includes('')) {
    console.error(`
[Wint getLangTag] The language tags list cannot be empty or contain an empty
string.
`)
    return
  }

  // Will hold the return value if any.
  let tag: string | undefined

  /////////////////////////////////////////////////////////////////////////////
  //                              'prefix' mode                              //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'prefix' || mode === void 0) {
    // Note: `globalThis` requires node >=12.0.0
    const prefixLangTag = (urlPath || globalThis?.location?.pathname)
      ?.split('/')[1]
      .toLowerCase()

    if (prefixLangTag) {
      // Find the language tag that corresponds to the path prefix.
      tag = tags.find((t) => t.toLowerCase() === prefixLangTag)
      if (tag) return tag
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                        'subdomain' or 'host' mode                       //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'subdomain' || mode === 'host') {
    const host = (urlHost || globalThis?.location?.host)?.toLowerCase()

    // Warn when the host is invalid.
    if (!host) {
      console.warn(`
[Wint getLangTag] "subdomain|host" mode: The URL host is empty or undefined.
`)
    }

    ///////////////////////////////////////////////////////////////////////////
    //                            'subdomain' mode                           //
    ///////////////////////////////////////////////////////////////////////////

    if (mode === 'subdomain' && host) {
      const subdomainLangTag = host.split('.')[0]

      // Find the language tag that corresponds to the URL host subdomain.
      tag = tags.find((t) => t.toLowerCase() === subdomainLangTag)
      if (tag) return tag
    }

    ///////////////////////////////////////////////////////////////////////////
    //                               'host' mode                             //
    ///////////////////////////////////////////////////////////////////////////

    if (mode === 'host') {
      // Warn about missing language tags hosts.
      for (const t of tags) {
        if (!langTagsHosts?.[t]) {
          console.warn(`
[Wint getLangTag] "host" mode: The language tag "${t}" does not have a
corresponding host defined.
`)
        }
      }

      if (host) {
        // Find the language tag that corresponds to the host.
        tag = tags.find((t) => langTagsHosts?.[t]?.toLowerCase() === host)
        if (tag) return tag
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //                          'search-param' mode                            //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'search-param') {
    // Language tag url search param key.
    const key = searchParamKey || 'l'

    const path = urlPath || globalThis?.location?.search

    if (path) {
      const url = new URL(`http://localhost${path}`)
      const searchParams = new URLSearchParams(url.search)
      const searchParamLangTag = searchParams.get(key)?.toLowerCase()

      if (searchParamLangTag) {
        // Find the language tag corresponding to the url search param.
        tag = tags.find((t) => t.toLowerCase() === searchParamLangTag)
        if (tag) return tag
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //             mode is 'none', or no language tag is found yet             //
  /////////////////////////////////////////////////////////////////////////////

  // Determine the language tag based on a cookie.
  if (useCookie) {
    // Language tag url search param key.
    const key = cookieKey || 'lang_tag'

    const clientCookies = cookies || globalThis?.document?.cookie

    if (clientCookies) {
      const langTagCookie = clientCookies
        .split(';')
        .find((c) => c.includes(`${key}=`))
        ?.split('=')[1]
        .trim()

      if (langTagCookie) {
        // Find the language tag that corresponds to the stored cookie.
        tag = tags.find((t) => t === langTagCookie)
        if (tag) return tag
      }
    }
  }

  // Determine the language tag based on the user's client preferences.
  if (useClientPreferredLangTags) {
    const prefs =
      clientPreferredLangTags || globalThis?.navigator?.languages?.join(', ')
    if (prefs) {
      const negotiator = new Negotiator({
        headers: { 'accept-language': prefs },
      })

      tag = negotiator.language(tags)
      if (tag) return tag
    }
  }

  // Fallback to the first element.
  return tags[0]
}

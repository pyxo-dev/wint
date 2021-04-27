import Negotiator from 'negotiator'
import type { WintUrlConf } from '.'
import { getLangTagCookie } from '.'

/**
 * Options for `getLangTag` function.
 *
 * @beta
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
   * @example
   *
   * Examples URLs in different modes.
   *
   * <h4>Prefix mode</h4>
   *
   * `example.com/es`, `example.com/en-GB`
   *
   * <h4>Subdomain mode</h4>
   *
   * `es.example.com`, `en-GB.example.com`
   *
   * <h4>Host mode</h4>
   *
   * Each language tag has its own host.
   *
   * `example.es`, `example.co.uk`
   *
   * `my-spanish-site.com`, `my-english-site.com`
   *
   * `localhost:8000` (for spanish), `localhost:8001` (for english)
   *
   * <h4>Search param mode</h4>
   *
   * `example.com?lang=es`, `example.com?lang=en-GB`
   *
   * <h4>None mode</h4>
   *
   * `example.com` (the same URL used for all language tags)
   */
  urlMode?: WintUrlConf['mode']
  /**
   * The URL host (including the port if any) to use when determining the
   * language tag in 'subdomain' and 'host' modes.
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve it automatically from
   * `globalThis.location` (available in a `dom` environment).
   *
   * ::: tip
   *
   * In a server environment you can get the host from the request object.
   *
   * :::
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
   * `globalThis.location` (available in a `dom` environment).
   *
   * ::: tip
   *
   * In a server environment you can get the path from the request object.
   *
   * :::
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
   * {@inheritDoc GetLangTagCookieOptions.cookieKey}
   *
   * @defaultValue 'lang_tag'
   */
  cookieKey?: string
  /**
   * {@inheritDoc GetLangTagCookieOptions.cookies}
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
   * from `globalThis.navigator.languages` (available in a `dom` environment).
   *
   * ::: tip
   *
   * In a server environment you can get the preferences from the
   * request object 'Accept-Language' header.
   *
   * :::
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
 *
 * @beta
 *
 * @example
 *
 * When in a browser, or in a server that receives a request from a browser with
 * the following assumptions:
 *
 * - The browser URL is `https://es-419.example.com/zh-yue/blog?l=en`
 *
 * - The browser Cookies are set to `lang_tag=zh-Hant-HK; lemon_cookie=tasty`
 *
 * - The browser language preferences are `en-US;q=0.8, de;q=0.7, es;q=0.5`
 *
 *  The function returns the indicated values.
 *
 * ```ts
 * const langTags = [
 *   'arb',
 *   'en-GB',
 *   'zh-Hant-HK',
 *   'zh-yue',
 *   'es-419',
 *   'es',
 *   'en',
 * ]
 *
 *  console.log(
 *   getLangTag({ mode: 'prefix', langTags, urlPath: req?.originalUrl }) ===
 *     'zh-yue',
 *
 *    getLangTag({ mode: 'subdomain', langTags, urlHost: req?.get('host') }) ===
 *     'es-419',
 *
 *    getLangTag({
 *     mode: 'search-param',
 *     langTags,
 *     urlPath: req?.originalUrl,
 *   }) === 'en',
 *
 *    getLangTag({
 *     mode: 'none',
 *     langTags,
 *     useCookie: true,
 *     cookies: req?.get('cookie'),
 *   }) === 'zh-Hant-HK',
 *
 *    getLangTag({
 *     mode: 'none',
 *     langTags,
 *     useClientPreferredLangTags: true,
 *     clientPreferredLangTags: req?.get('accept-language'),
 *   }) === 'en'
 * )
 *
 *  const langTagsHosts = {
 *   arb: 'example-arb.com:3000',
 *   'en-GB': 'example-en-gb.com:3000',
 * }
 *
 *  // With a URL: 'example-en-gb.com:3000'
 * console.log(
 *   getLangTag({
 *     mode: 'host',
 *     langTags: ['arb', 'en-GB'],
 *     langTagsHosts,
 *     urlHost: req?.get('host'),
 *   }) === 'en-GB'
 * )
 * ```
 *
 * @param options - Options object.
 * @returns The chosen language tag, or `undefined` when the provided language
 * tags list is empty or contains an empty string.
 */
export function getLangTag(options: GetLangTagOptions): string | undefined {
  const {
    langTags,
    urlMode,
    urlHost,
    urlPath,
    searchParamKey,
    langTagsHosts,
    useCookie,
    cookieKey,
    cookies,
    useClientPreferredLangTags,
    clientPreferredLangTags,
  } = options

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

  // Correctly type needed `globalThis` properties.
  // `location` and `navigator` objects might be undefined in a non `dom`
  // environment, the following will add `undefined` to their types.
  const location = <Location | undefined>globalThis.location
  const navigator = <Navigator | undefined>globalThis.navigator
  // Note: `globalThis` requires node >=12.0.0

  // Will hold the return value if any.
  let tag: string | undefined

  // The URL mode defaults to 'prefix'.
  const mode =
    urlMode && ['subdomain', 'host', 'search-param', 'none'].includes(urlMode)
      ? urlMode
      : 'prefix'

  /////////////////////////////////////////////////////////////////////////////
  //                              'prefix' mode                              //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'prefix') {
    const prefixLangTag = (urlPath || location?.pathname)
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
    const host = (urlHost || location?.host)?.toLowerCase()

    // Warn when the host is invalid.
    if (!host) {
      console.warn(`
[Wint getLangTag] "${mode}" mode: The URL host is empty or undefined.
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
[Wint getLangTag] "${mode}" mode: The language tag "${t}" does not have a
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

    const path = urlPath || location?.search

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
    const langTagCookie = getLangTagCookie({ cookieKey, cookies })

    if (langTagCookie) {
      // Find the language tag that corresponds to the stored cookie.
      tag = tags.find((t) => t === langTagCookie)
      if (tag) return tag
    }
  }

  // Determine the language tag based on the user's client preferences.
  if (useClientPreferredLangTags) {
    let prefs = clientPreferredLangTags

    // In a `dom` environment.
    if (!prefs && navigator?.languages?.length) {
      // Quality value unit.
      const qUnit = 1 / navigator.languages.length

      prefs = navigator.languages
        .map((l, i) => {
          // Quality values are up to three decimal digits.
          const q = Math.floor(1000 * (1 - i * qUnit)) / 1000
          return `${l};q=${q}`
        })
        .join(', ')
    }

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

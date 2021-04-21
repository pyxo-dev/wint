import type { WintUrlConf } from '..'

/**
 * Options for `getPathHref` function.
 *
 * @beta
 */
export interface GetPathHrefOptions {
  /**
   * The URL path, from which the href (the full url) is built according to the
   * specified mode.
   *
   * @example
   * ```ts
   * urlPath: '/blog/recent'
   * ```
   */
  urlPath: string
  /**
   * The language tag for which the href is built.
   */
  langTag: string
  /**
   * {@inheritDoc WintUrlConf.mode}
   *
   * @defaultValue 'prefix'
   */
  urlMode?: WintUrlConf['mode']
  /**
   * The URL host (including the port if any) to use when building the href.
   * Needed when the mode is 'prefix', 'search-param' or 'none'.
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
   * The URL protocol to use when building the href.
   *
   * @remarks
   *
   * When not provided, Wint will try to retrieve it automatically from
   * `globalThis.location` (available in a `dom` environment).
   *
   * ::: tip
   *
   * In a server environment you can get the protocol from the request object.
   *
   * :::
   *
   * @example
   * ```ts
   * urlProtocol: 'https'
   * urlProtocol: 'http'
   * ```
   */
  urlProtocol?: string
  /**
   * The domain to use when building the href. Needed for 'subdomain' mode.
   *
   * @example
   * ```ts
   * domain: 'example.com'
   * domain: 'mysite.example.com'
   * ```
   */
  domain?: string
  /**
   * The host corresponding to the provided language tag. Needed in 'host' mode.
   *
   * @example
   * ```ts
   * langTagHost: 'example-ar.com'
   * langTagHost: 'example-en.com'
   * ```
   */
  langTagHost?: string
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
}

/**
 * Builds an href (full url) for a language tag from a path, according to the
 * specified mode.
 *
 * @beta
 *
 * @example
 * ```ts
 * const urlPath = '/blog/recent?key=value'
 * const langTag = 'en'
 *
 * // In a browser environment:
 * console.log(
 *   getPathHref({ urlPath, langTag }) ===
 *     'https://example.com/en/blog/recent?key=value'
 *
 *   getPathHref({ urlPath, langTag, urlMode: 'subdomain', domain: 'example.com' }) ===
 *     'https://en.example.com/blog/recent?key=value'
 *
 *   getPathHref({ urlPath, langTag, urlMode: 'host', langTagHost: 'example-en.com' }) ===
 *     'https://example-en.com/blog/recent?key=value'
 *
 *   getPathHref({ urlPath, langTag, urlMode: 'search-param' }) ===
 *     'https://example.com/blog/recent?key=value&l=en'
 *
 *   getPathHref({ urlPath, langTag, urlMode: 'none' }) ===
 *     'https://example.com/blog/recent?key=value'
 * )
 * ```
 *
 * @param options - Options object.
 * @returns The built href, or `undefined` when the input is invalid.
 */
export function getPathHref(options: GetPathHrefOptions): string | undefined {
  const {
    urlPath,
    langTag,
    urlMode,
    urlHost,
    urlProtocol,
    domain,
    langTagHost,
    searchParamKey,
  } = options

  // Validate the language tag.
  if (!langTag) {
    console.error(`
[Wint getPathHref] The provided language tag cannot be empty.
`)
    return
  }

  // The `location` object might be undefined in a non `dom` environment, the
  // following will add `undefined` to its type.
  const location = <Location | undefined>globalThis?.location

  const protocol = urlProtocol || location?.protocol?.replace(':', '')
  // Validate the protocol.
  if (!protocol) {
    console.error(`
[Wint getPathHref] No URL protocol provided and not in a dom environment.
`)
    return
  }

  // The URL mode defaults to 'prefix'.
  const mode =
    urlMode && ['subdomain', 'host', 'search-param', 'none'].includes(urlMode)
      ? urlMode
      : 'prefix'

  const host = urlHost || location?.host
  // Validate the host for the modes that need it.
  if (!host && ['prefix', 'search-param', 'none'].includes(mode)) {
    console.error(`
[Wint getPathHref] "${mode}" mode: No URL host provided and not in a dom
environment.
`)
    return
  }

  /////////////////////////////////////////////////////////////////////////////
  //                              'prefix' mode                              //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'prefix') return `${protocol}://${host}/${langTag}${urlPath}`

  /////////////////////////////////////////////////////////////////////////////
  //                             'subdomain' mode                            //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'subdomain') {
    // Validate the domain.
    if (!domain) {
      console.error(`
[Wint getPathHref] "${mode}" mode: No domain provided.
`)
      return
    }
    return `${protocol}://${langTag}.${domain}${urlPath}`
  }

  /////////////////////////////////////////////////////////////////////////////
  //                               'host' mode                               //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'host') {
    // Validate the language tag host.
    if (!langTagHost) {
      console.error(`
[Wint getPathHref] "${mode}" mode: The provided language tag host is not valid.
`)
      return
    }
    return `${protocol}://${langTagHost}${urlPath}`
  }

  /////////////////////////////////////////////////////////////////////////////
  //                           'search-param' mode                           //
  /////////////////////////////////////////////////////////////////////////////

  if (mode === 'search-param') {
    // Language tag url search param key.
    const key = searchParamKey || 'l'

    const url = new URL(`${protocol}://${host}${urlPath}`)
    url.searchParams.set(key, langTag)

    return url.href
  }

  /////////////////////////////////////////////////////////////////////////////
  //                               'none' mode                               //
  /////////////////////////////////////////////////////////////////////////////

  return `${protocol}://${host}${urlPath}`
}

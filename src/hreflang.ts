import type { WintUrlConf } from '.'
import { getPathHref } from '.'

/**
 * An object representing an hreflang link tag.
 *
 * @beta
 */
export interface HreflangLink {
  /**
   * The `rel` attribute of the hreflang link.
   */
  rel: 'alternate'
  /**
   * The `hreflang` attribute of the hreflang link.
   */
  hreflang: string
  /**
   * The `href` attribute of the hreflang link.
   */
  href: string
}

/**
 * Options for `hreflang` function.
 *
 * @beta
 */
export interface HreflangOptions {
  /**
   * An object with the language tags as keys, and their corresponding hrefs as
   * values.
   *
   * @example
   * ```ts
   * {ar: 'https://example.com/ar/مدونة', en: 'https://example.com/en/blog'}
   * ```
   */
  hrefs: { [langTag: string]: string }
  /**
   * The language tag that will be used for the `x-default` hreflang.
   */
  xDefaultLangTag: string
  /**
   * Object containing the hreflang attribute values to use instead of the
   * language tags.
   *
   * @remarks
   *
   * Intended to be used when a language tag is not a valid hreflang attribute.
   */
  hreflangs?: { [langTag: string]: string }
}

/**
 * Builds hreflang link tag objects ready for consumption by other tools.
 *
 * @beta
 *
 * @remarks
 *
 * See {@link https://en.wikipedia.org/wiki/Hreflang | hreflang }
 *
 * @param options - Options object.
 * @returns An object, or `undefined` if the input validation fails.
 */
export function hreflang(
  options: HreflangOptions
): Record<string, HreflangLink> | undefined {
  const { hrefs, xDefaultLangTag, hreflangs } = options

  // Validation
  if (xDefaultLangTag === '') {
    console.error(`
[Wint hreflang] The "x-default" language tag cannot be empty.
`)
    return
  }
  if (!(xDefaultLangTag in hrefs)) {
    console.error(`
[Wint hreflang] The provided "hrefs" must contain the "x-default" language tag.
`)
    return
  }

  const link: Record<string, HreflangLink> = {}

  // x-default hreflang.
  link['hreflang-x-default'] = {
    rel: 'alternate',
    hreflang: 'x-default',
    href: hrefs[xDefaultLangTag],
  }

  // Other hreflangs.
  for (const [langTag, href] of Object.entries(hrefs)) {
    // Check if an hreflang attribute value was provided.
    const hreflang = hreflangs?.[langTag] || langTag

    link[`hreflang-${hreflang}`] = { rel: 'alternate', hreflang, href }
  }

  return link
}

/**
 * Options for `hreflangPaths` function.
 *
 * @beta
 */
export interface HreflangPathsOptions {
  /**
   * An object with the language tags as keys, and the corresponding paths as
   * values.
   *
   * @example
   * ```ts
   * { en: 'blog/recent', ar: encodeURI('مدونة/مدونات-حديثة') }
   * ```
   */
  urlPaths: { [langTag: string]: string }
  /**
   * {@inheritDoc HreflangOptions.xDefaultLangTag}
   */
  xDefaultLangTag: string
  /**
   * {@inheritDoc HreflangOptions.hreflangs}
   */
  hreflangs?: { [langTag: string]: string }
  /**
   * The URL host (including the port if any) to use for the hreflangs `href`
   * attribute.
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
   * The URL protocol to use for the hreflangs `href` attribute.
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
   * {@inheritDoc WintUrlConf.mode}
   */
  urlMode?: WintUrlConf['mode']
  /**
   * The domain to use when constructing the hreflang href attributes. Needed
   * for 'subdomain' mode.
   *
   * @example
   * ```ts
   * domain: 'example.com'
   * domain: 'mysite.example.com'
   * ```
   */
  domain?: string
  /**
   * An object containing the hosts corresponding to the language tags specified
   * in `urlPaths`. Needed when the URL structure mode is set to 'host'.
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
 * Builds hreflang link tag objects ready for consumption by other tools. It
 * takes URL paths and constructs the corresponding hrefs.
 *
 * @beta
 *
 * @remarks
 *
 * See {@link https://en.wikipedia.org/wiki/Hreflang | hreflang }
 *
 * @param options - Options object.
 * @returns An object, or `undefined` if the input validation fails.
 */
export function hreflangPaths(
  options: HreflangPathsOptions
): Record<string, HreflangLink> | undefined {
  const {
    urlPaths,
    xDefaultLangTag,
    hreflangs,
    urlHost,
    urlProtocol,
    urlMode,
    domain,
    langTagsHosts,
    searchParamKey,
  } = options

  // Will hold the constructed hrefs.
  const hrefs: { [langTag: string]: string } = {}

  // For each language tag and its specified path:
  for (const [langTag, urlPath] of Object.entries(urlPaths)) {
    // Get the corresponding href.
    const pathHref = getPathHref({
      urlPath,
      langTag,
      urlMode,
      urlHost,
      urlProtocol,
      domain,
      langTagHost: langTagsHosts?.[langTag],
      searchParamKey,
    })

    // If the input is invalid, return `undefined`.
    if (!pathHref) return

    // Add the path href.
    hrefs[langTag] = pathHref
  }

  // Return the hreflang link tags, corresponding to the constructed hrefs.
  return hreflang({ hrefs, xDefaultLangTag, hreflangs })
}

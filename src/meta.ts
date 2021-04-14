export interface HreflangLink {
  rel: string
  hreflang: string
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
 * Builds hreflang link tags ready for consumption by other tools.
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

import type { CookieSerializeOptions } from 'cookie'

/**
 * Miscellaneous types used by Wint.
 */

/**
 * Configuration related to the structure of the app URLs with regard to
 * internationalization.
 *
 * @beta
 */
export interface WintUrlConf {
  /**
   * The mode of the app URL structure.
   *
   * @remarks
   *
   * See {@link https://webmasters.stackexchange.com/a/44289 | How should I structure my URLs}
   *
   * See {@link https://developers.google.com/search/blog/2010/03/working-with-multi-regional-websites#url-structures | URL structures}
   *
   * - Default: `prefix`
   *
   * @defaultValue `prefix`
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
  mode?: 'prefix' | 'subdomain' | 'host' | 'search-param' | 'none'
  /**
   * The URL search param key used for the language tag. Used when the mode is
   * 'search-param'.
   *
   * @remarks
   *
   * - Default: `l`
   *
   * @defaultValue 'l'
   *
   * @example
   *
   * ```ts
   * searchParamKey: 'langTag' // 'example.com/blog?langTag=en'
   * searchParamKey: 'lang'    // 'example.com/blog?lang=en'
   * ```
   */
  searchParamKey?: string
}

/**
 * Configuration for a language tag.
 *
 * @beta
 */
export interface WintLangTagConf {
  /**
   * The native name of the language tag. (Can be used for example in a language
   * tag selector.)
   */
  nativeName?: string
  /**
   * The host corresponding to the language tag. Needed when the URL structure
   * mode is set to `host`.
   *
   * @remarks
   *
   * See host mode in {@link WintUrlConf.mode}
   *
   * @example
   * ```ts
   * host: 'example.co.uk' // for 'en-GB' language tag.
   * host: 'example.es' // for 'es' language tag.
   *
   * host: 'localhost:8000' // for 'en-GB' language tag.
   * host: 'localhost:8001' // for 'es' language tag.
   * ```
   */
  host?: string
  /**
   * The hreflang attribute value to use instead of the language tags.
   *
   * @remarks
   *
   * Intended to be used when a language tag is not a valid hreflang attribute.
   */
  hreflang?: string
}

/**
 * App language tags configuration.
 *
 * @beta
 */
export interface WintLangTagsConf {
  [langTag: string]: WintLangTagConf
}

/**
 * Cookie related configurations.
 *
 * @beta
 */
export interface WintCookieConf {
  /**
   * Whether the language tag cookie is used.
   *
   * @remarks
   *
   * - Default: `false`
   *
   * @defaultValue `false`
   */
  useCookie?: boolean
  /**
   * The key to use for the language tag cookie.
   *
   * @remarks
   *
   * - Default: `lang_tag`
   *
   * @defaultValue `lang_tag`
   */
  cookieKey?: string
  /**
   * An object containing the options to use for the language tag cookie.
   *
   * @remarks
   *
   * The options are serialized using the `cookie` package.
   *
   * See {@link https://github.com/jshttp/cookie/#options-1 | Cookie serialize options}
   *
   * @example
   * ```ts
   * cookieOptions: { sameSite: 'lax', maxAge: 60*60*24 }
   * ```
   */
  cookieOptions?: CookieSerializeOptions
}

/**
 * Wint configuration.
 *
 * @beta
 */
export interface WintConf {
  /**
   * List of language tags to use in the app.
   *
   * @remarks
   *
   * It is recommended to use `BCP 47` language tags.
   *
   * See {@link https://www.w3.org/International/articles/language-tags | Language tags in HTML and XML }
   *
   * The first language tag in the list is considered the default app language
   * tag.
   *
   * @example
   * ```ts
   * langTags: ['ar', 'en-GB', 'en-US', 'zh-Hans']
   * ```
   */
  langTags: string[]
  /** {@inheritDoc WintLangTagsConf} */
  langTagsConf?: WintLangTagsConf
  /** {@inheritDoc WintUrlConf} */
  urlConf?: WintUrlConf
  /** {@inheritDoc WintCookieConf} */
  cookieConf?: WintCookieConf
  /**
   * Whether to use the language preferences set in the user's client.
   *
   * @remarks
   *
   * - Default: `false`
   *
   * @defaultValue `false`
   */
  useClientPreferredLangTags?: boolean
}

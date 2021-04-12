/**
 * Misc types used by Wint.
 */

/**
 * Configuration related to the structure of the app URLs with regard to
 * internationalization.
 * @alpha
 */
export interface WintUrlConf {
  /**
   * The mode of the app URL structure.
   *
   * {@link https://webmasters.stackexchange.com/a/44289}
   * {@link https://developers.google.com/search/blog/2010/03/working-with-multi-regional-websites#url-structures}
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
  mode?: 'prefix' | 'subdomain' | 'host' | 'search-param' | 'none'
  /**
   * The language tag url search param key. Used when the mode is
   * 'search-param'.
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
 * Configuration for a language tag.
 * @alpha
 */
export interface WintLangTagConf {
  /**
   * The host corresponding to the language tag. Needed when the URL structure
   * mode is set to 'host'.
   *
   * See {@link WintUrlConf.mode}
   *
   * @example Examples
   * ```ts
   * host: 'example.co.uk' // for 'en-GB' language tag.
   * host: 'example.es' // for 'es' language tag.
   *
   * host: 'localhost:8000' // for 'en-GB' language tag.
   * host: 'localhost:8001' // for 'es' language tag.
   * ```
   */
  host?: string
}

/**
 * App language tags configuration.
 * @alpha
 */
export interface WintLangTagsConf {
  [langTag: string]: WintLangTagConf
}

/**
 * Cookie related configurations.
 * @alpha
 */
export interface WintCookieConf {
  /**
   * Whether the language tag cookie is used.
   *
   * @defaultValue `false`
   */
  useCookie?: boolean
  /**
   * The key to use for the language tag cookie.
   *
   * @defaultValue 'lang_tag'
   */
  cookieKey?: string
}

/**
 * Wint configuration.
 * @alpha
 */
export interface WintConf {
  /**
   * List of language tags to use in the app. It is recommended to use `BCP 47`
   * language tags.
   * See {@link https://www.w3.org/International/articles/language-tags | Language tags in HTML and XML }
   *
   * The first language tag in the list is considered the default app language
   * tag.
   *
   * @example langTags Example
   * ```ts
   * langTags: ['ar', 'en-GB', 'en-US', 'zh-Hans']
   * ```
   */
  langTags: string[]
  /** {@inheritDoc WintLangTagsConf} */
  langTagsConf?: WintLangTagsConf
  /** {@inheritDoc WinUrlConf} */
  urlConf?: WintUrlConf
  /** {@inheritDoc WintCookieConf} */
  cookieConf?: WintCookieConf
  /**
   * Whether to use the language preferences set in the user's client.
   *
   * @defaultValue `false`
   */
  useClientPreferredLangTags?: boolean
}

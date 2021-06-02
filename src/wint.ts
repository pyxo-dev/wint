import type {
  GetLangTagCookieOptions,
  SetLangTagCookieOptions,
} from './helpers/cookie'
import { getLangTagCookie, setLangTagCookie } from './helpers/cookie'
import type { GetPathHrefOptions } from './helpers/misc'
import { getPathHref } from './helpers/misc'
import type { HreflangOptions, HreflangPathsOptions } from './hreflang'
import { hreflang, hreflangPaths } from './hreflang'
import type { GetLangTagOptions } from './lang-tag'
import { getLangTag } from './lang-tag'
import type { WintConf, WintServerContext } from './types'

/**
 * Wint instance.
 *
 * @beta
 */
export interface Wint {
  /** The configuration used when creating the Wint instance.  */
  conf: WintConf

  /** {@inheritDoc getLangTag} */
  getLangTag: (
    options?: Partial<GetLangTagOptions>
  ) => ReturnType<typeof getLangTag>

  /** {@inheritDoc getPathHref} */
  getPathHref: typeof getPathHref

  /** {@inheritDoc hreflang} */
  hreflang: typeof hreflang

  /** {@inheritDoc hreflangPaths} */
  hreflangPaths: typeof hreflangPaths

  /** {@inheritDoc getLangTagCookie} */
  getLangTagCookie: typeof getLangTagCookie

  /** {@inheritDoc setLangTagCookie} */
  setLangTagCookie: typeof setLangTagCookie

  /** The `serverContext` used when creating the Wint instance. */
  serverContext?: WintServerContext
}

/**
 * Creates a Wint instance.
 *
 * @beta
 *
 * @param conf - Configuration object.
 * @returns Wint instance.
 */
export function createWint(
  conf: WintConf,
  serverContext?: WintServerContext
): Wint {
  // Destructure the configuration.
  const {
    langTags,
    langTagsConf,
    urlConf: { mode: urlMode, searchParamKey } = {},
    cookieConf,
    useClientPreferredLangTags,
  } = conf
  const { useCookie = false, cookieKey, cookieOptions } = cookieConf || {}

  const req = serverContext?.req
  const res = serverContext?.res

  // Get the language tags hosts from `langTagsConf`.
  const langTagsHosts: Record<string, string> = {}
  if (urlMode === 'host') {
    for (const [langTag, langTagConf] of Object.entries(langTagsConf || {})) {
      if (langTagConf.host) langTagsHosts[langTag] = langTagConf.host
    }
  }

  // Get the language tags hreflangs from `langTagsConf`.
  const hreflangs: Record<string, string> = {}
  for (const [langTag, langTagConf] of Object.entries(langTagsConf || {})) {
    if (langTagConf.hreflang) hreflangs[langTag] = langTagConf.hreflang
  }

  // The following will make the standalone functions available in the wint
  // instance. These functions can then be used in a much easier way, as there
  // will be no need to provide the options that are already present in the
  // instance configuration or serverContext.

  const getLangTagFn = (options?: Partial<GetLangTagOptions>) => {
    const fallbackOpts: GetLangTagOptions = {
      langTags,
      urlMode,
      searchParamKey,
      langTagsHosts,
      useCookie,
      cookieKey,
      useClientPreferredLangTags,
      req,
    }
    return getLangTag(Object.assign({}, fallbackOpts, options))
  }

  const getPathHrefFn = (options: GetPathHrefOptions) => {
    const fallbackOpts: Partial<GetPathHrefOptions> = {
      urlMode,
      langTagHost: langTagsHosts[options.langTag],
      searchParamKey,
      req,
    }
    return getPathHref(Object.assign({}, fallbackOpts, options))
  }

  const hreflangFn = (options: HreflangOptions) => {
    const fallbackOpts: Partial<HreflangOptions> = { hreflangs }
    return hreflang(Object.assign({}, fallbackOpts, options))
  }

  const hreflangPathsFn = (options: HreflangPathsOptions) => {
    const fallbackOpts: Partial<HreflangPathsOptions> = {
      hreflangs,
      urlMode,
      langTagsHosts,
      searchParamKey,
      req,
    }
    return hreflangPaths(Object.assign({}, fallbackOpts, options))
  }

  const getLangTagCookieFn = (options?: GetLangTagCookieOptions) => {
    const fallbackOpts: GetLangTagCookieOptions = { cookieKey, req }
    return getLangTagCookie(Object.assign({}, fallbackOpts, options))
  }

  const setLangTagCookieFn = (options: SetLangTagCookieOptions) => {
    const fallbackOpts: Partial<SetLangTagCookieOptions> = {
      cookieOptions,
      cookieKey,
      res,
    }
    return setLangTagCookie(Object.assign({}, fallbackOpts, options))
  }

  // Build and return the Wint instance.
  return {
    conf,
    getLangTag: getLangTagFn,
    getPathHref: getPathHrefFn,
    hreflang: hreflangFn,
    hreflangPaths: hreflangPathsFn,
    getLangTagCookie: getLangTagCookieFn,
    setLangTagCookie: setLangTagCookieFn,
    serverContext,
  }
}

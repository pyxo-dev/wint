# Introduction

Wint (Web apps internationalization) is a javascript library to
facilitate the i18n of web apps.

# Installation

``` bash
npm install @pyxo/wint
# or
yarn add @pyxo/wint
```

# Features

-   Can be used in a client environment (browser), server environment
    (node) or both (SSR universal code).
-   Supports different URL modes: prefix (example.com/en), subdomain
    (en.example.com), host (example.co.uk), search-param
    (example.com?l=en), none (example.com)
-   Supports the use of a language tag cookie.
-   Can make use of the user's client language preferences (e.g. browser
    settings).
-   Support for `hreflang` link tags.
-   Language tags, Wint uses the term "language tag" to denote a
    language or a locale, and recommends the use of [BCP
    47](https://www.w3.org/International/articles/language-tags)
    language tags.

# Documentation

API docs: [wint.pyxo.net/api](https://wint.pyxo.net/api)

# Source code

Repository: [github.com/pyxo-dev/wint](https://github.com/pyxo-dev/wint)

Contributions are welcome!

# See also

-   [Vint](https://github.com/pyxo-dev/vint) Vue int.
-   [Qint](https://github.com/pyxo-dev/qint) Quasar int.

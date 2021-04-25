# Table of Contents

1.  [Introduction](#orgd5d70e7)
2.  [Installation](#org4a8c8f6)
3.  [Features](#org245baef)
4.  [Documentation](#org1dab5e0)
5.  [Source code](#org4006feb)

<a id="orgd5d70e7"></a>

# Introduction

Wint (<u>W</u>eb apps <u>int</u>ernationalization) is a javascript library to
facilitate the i18n of web apps.

Wint uses the term `language tag` to denote a language or a locale, and
recommends the use of [BCP 47](https://www.w3.org/International/articles/language-tags) language tags.

<a id="org4a8c8f6"></a>

# Installation

    npm install @pyxo/wint
    # or
    yarn add @pyxo/wint

<a id="org245baef"></a>

# Features

- Can be used in a client environment (browser), server environment (node) or
  both (SSR universal code).
- Supports different URL modes: prefix (example.com/en), subdomain
  (en.example.com), host (example.co.uk), search-param (example.com?l=en), none
  (example.com)
- Supports the use of a language tag cookie.
- Can make use of the user&rsquo;s client language preferences (e.g. browser
  settings).
- Support for `hreflang` link tags.

<a id="org1dab5e0"></a>

# Documentation

API docs: [wint.pyxo.net/api](https://wint.pyxo.net/api)

<a id="org4006feb"></a>

# Source code

Repository: [github.com/pyxo-dev/wint](https://github.com/pyxo-dev/wint)

Contributions are welcome!

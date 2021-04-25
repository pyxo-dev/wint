# Table of Contents

1.  [Introduction](#org1e4820d)
2.  [Installation](#orgad39fb2)
3.  [Features](#orge38610c)
4.  [Documentation](#org1aa7bb1)
5.  [Source code](#orgfbdedaa)

<a id="org1e4820d"></a>

# Introduction

Wint (<u>W</u>eb apps <u>int</u>ernationalization) is a javascript library to
facilitate the i18n of web apps.

Wint uses the term `language tag` to denote a language or a locale, and
recommends the use of [BCP 47](https://www.w3.org/International/articles/language-tags) language tags.

<a id="orgad39fb2"></a>

# Installation

\#+begin<sub>src</sub> sh
npm install @pyxo/wint

yarn add @pyxo/wint #+end<sub>src</sub>

<a id="orge38610c"></a>

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

<a id="org1aa7bb1"></a>

# Documentation

API docs: [wint.pyxo.net/api](https://wint.pyxo.net/api)

<a id="orgfbdedaa"></a>

# Source code

Repository: [github.com/pyxo-dev/wint](https://github.com/pyxo-dev/wint)

Contributions are welcome!

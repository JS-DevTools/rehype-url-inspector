Rehype URL Inspector
==============================
### A [rehype](https://github.com/rehypejs/rehype) plugin to inspect, validate, or rewrite URLs anywhere in an HTML document

[![Cross-Platform Compatibility](https://jsdevtools.org/img/badges/os-badges.svg)](https://travis-ci.com/JS-DevTools/rehype-url-inspector)
[![Build Status](https://api.travis-ci.com/JS-DevTools/rehype-url-inspector.svg?branch=master)](https://travis-ci.com/JS-DevTools/rehype-url-inspector)

[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/rehype-url-inspector/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/rehype-url-inspector)
[![Dependencies](https://david-dm.org/JS-DevTools/rehype-url-inspector.svg)](https://david-dm.org/JS-DevTools/rehype-url-inspector)

[![npm](https://img.shields.io/npm/v/rehype-url-inspector.svg)](https://www.npmjs.com/package/rehype-url-inspector)
[![License](https://img.shields.io/npm/l/rehype-url-inspector.svg)](LICENSE)






Installation
--------------------------
You can install `rehype-url-inspector` via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install rehype-url-inspector
```

You'll probably want to install [unified](https://unifiedjs.com/), [rehype-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse), [rehype-stringify](https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify), and [to-vfile](https://github.com/vfile/to-vfile) as well.

```bash
npm install unified rehype-parse rehype-stringify to-vfile
```



Usage
--------------------------
Using the URL Inspector plugin requires an understanding of how to use Unified and Rehype. [Here is an excelleng guide](https://unifiedjs.com/using-unified.html) to learn the basics.

The URL Inspector plugin works just like any other Rehype plugin. Pass it to [the `.use()` method](https://github.com/unifiedjs/unified#processoruseplugin-options) with an [options object](#options).

```javascript
const unified = require("unified");
const inspectUrls = require("rehype-url-inspector");

// Use the Rehype URL Inspector plugin with custom options
unified().use(inspectUrls, {
  inspect(urls) { ... },      // This function is called once with ALL of the URLs
  inspectEach(url) { ... },   // This function is called for each URL as it's found
  selectors: [
    "div[data-image]"         // CSS selectors for custom URL attributes
  ]
});
```



Options
--------------------------
Rehype URL Inspector supports the following options:

|Option                |Type                |Default                |Description
|:---------------------|:-------------------|:----------------------|:-----------------------------------------
|`selectors`           |array of strings, objects, and/or functions |[built-in selectors](src/selectors.ts) |Selectors indicate where to look for URLs in the document. Each selector can be a CSS attribute selector string, like `a[href]` or `img[src]`, or a function that accepts a [HAST node](https://github.com/syntax-tree/hast) and returns its URL(s). See [`extractors.ts`](src/extractors.ts) for examples.
|`keepDefaultSelectors`|boolean             |`true`                 |Whether to keep the default selectors in addition to any custom ones.
|`inspect`             |function            |no-op                  |A function that is called _once_ and receives an array containing all the URLs in the document
|`inspectEach`         |function            |no-op                  |A function that is called for _each_ URL in the document as it's found. Return `false` to abort the search and skip the rest of the document.



URL Objects
--------------------------
The `inspectEach()` function receives a [`UrlMatch` onject](src/types.ts).  The `inspect()` function receves an array of `UrlMatch` objects.  Each object has the following properties:

|Property               |Type                 |Description
|:----------------------|:--------------------|:------------------------------------
|`url`                  |string               |The URL that was found
|`propertyName`         |string or undefined  |The name of the [HAST node property](https://github.com/syntax-tree/hast#properties) where the URL was found, such as `"src"` or `"href"`. If the URL was found in the text content of the node, then `propertyName` is `undefined`.
|`node`                 |object               |The [HAST Element node](https://github.com/syntax-tree/hast#element) where the URL was found. **You can make changes to this node**, such as re-writing the URL, adding additional attributes, etc.
|`root`                 |object               |The [HAST Root node](https://github.com/syntax-tree/hast#root). This gives you access to the whole document if you need it.
|`file`                 |onject               |The [File object](https://github.com/vfile/vfile) that gives you information about the HTML file itself, such as the path and file name.



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [File an issue](https://github.com/JS-DevTools/rehype-url-inspector/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/rehype-url-inspector/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/JS-DevTools/rehype-url-inspector.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
rehype-url-inspector is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jsdevtools.org/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jsdevtools.org/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jsdevtools.org/img/badges/coveralls.svg)](https://coveralls.io)

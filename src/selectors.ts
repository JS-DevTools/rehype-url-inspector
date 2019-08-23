import * as urlRegex from "url-regex";
import { UrlSelector } from "./types";

/**
 * Matches simple CSS attribute selectors (e.g. `a[href]` or `img[src]`)
 */
const cssSelectorPattern = /^([a-z0-9_-]+)\[([a-z0-9_-]+)\]$/i;

/**
 * Matches a string that is a URL
 */
const urlPattern = urlRegex({ exact: true });

/**
 * The default URL selectors
 */
export const defaultSelectors: UrlSelector[] = [
  createUrlSelector("a[href]"),
  createUrlSelector("link[href]"),
  createUrlSelector("img[src]"),
  createUrlSelector("script[src]"),

  /**
   * Many `<meta>` tags have a `content` attribute that is a URL
   *
   * @example
   *  <meta rel="canonical" content="http://example.com">
   *  <meta name="twitter:image" content="http://example.com/logo.png">
   */
  { tagName: "meta", propertyName: "content", pattern: urlPattern },
];


/**
 * Creates a `UrlSelector` from a CSS attribute selector
 */
export function createUrlSelector(selector: string): UrlSelector {
  let match = cssSelectorPattern.exec(selector);
  if (!match) {
    throw new Error(`Invalid or unsupported CSS selector: ${selector}`);
  }

  let tagName = match[1].toLowerCase();
  let propertyName = match[2].toLowerCase();

  return { tagName, propertyName };
}

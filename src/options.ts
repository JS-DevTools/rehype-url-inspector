import { defaultExtractors } from "./extractors";
import { createUrlSelector, defaultSelectors } from "./selectors";
import { UrlExtractor, UrlMatch, UrlSelector } from "./types";

/**
 * Options for the Rehype Validate URLs plugin
 */
export interface Options {
  /**
   * Selectors indicate where to look for URLs in the document. Each selector can be a CSS attribute
   * selector string, like `a[href]` or `img[src]`, or a function that accepts a HAST node and
   * returns its URL(s).
   */
  selectors?: Array<string | UrlSelector | UrlExtractor>;

  /**
   * Whether to keep the default selectors in addition to any custom ones.
   *
   * Defaults to `false`.
   */
  keepDefaultSelectors?: boolean;

  /**
   * Inspects all the URLs in the document.
   */
  inspect?(urls: UrlMatch[]): void;

  /**
   * Inspects each URL in the document as it is found.
   *
   * @returns
   * Return a falsy value (other than `undefined`) to skip the rest of the URLs in the document.
   * Return a truthy value (or no value at all) to continue.
   */
  inspectEach?(url: UrlMatch): boolean | undefined;
}


/**
 * Normalized, sanitized, and complete settings,
 * with default values for anything that wasn't specified by the caller.
 */
export class NormalizedOptions {
  public readonly selectors: UrlSelector[] = [];
  public readonly extractors: UrlExtractor[] = [];
  public readonly inspect?: (urls: UrlMatch[]) => void;
  public readonly inspectEach?: (url: UrlMatch) => boolean | undefined;

  /**
   * Applies default values for any unspecified options
   */
  public constructor(options: Options = {}) {
    this.inspect = options.inspect;
    this.inspectEach = options.inspectEach;

    if (options.selectors) {
      // Split the UrlSelectors from the UrlExtractors
      for (let selector of options.selectors) {
        if (typeof selector === "function") {
          this.extractors.push(selector);
        }
        else if (typeof selector === "string") {
          selector = createUrlSelector(selector);
          this.selectors.push(selector);
        }
        else {
          this.selectors.push(selector);
        }
      }
    }

    if (!options.selectors || options.keepDefaultSelectors) {
      // Add our default selectors and extractors
      this.selectors.push(...defaultSelectors);
      this.extractors.push(...defaultExtractors);
    }
  }
}

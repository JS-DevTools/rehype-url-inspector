import { NormalizedOptions } from "./options";
import { NodeInfo, UrlMatch } from "./types";

/**
 * Returns a node's URL(s)
 */
export function *findUrls(info: NodeInfo, options: NormalizedOptions): IterableIterator<UrlMatch> {
  let { selectors, extractors } = options;
  let { node } = info;
  let i, j, selector, property, extractor, urls, url;

  // Using an old-fashined for-loop for speed, since this function is called for every single node
  for (i = 0; i < selectors.length; i++) {
    selector = selectors[i];

    if (node.tagName === selector.tagName && node.properties) {
      property = node.properties[selector.propertyName];

      if (typeof property === "string") {
        if (!selector.pattern || selector.pattern.test(property)) {
          yield { ...info, url: property, propertyName: selector.propertyName };
        }
      }
    }
  }

  // Using an old-fashined for-loop for speed, since this function is called for every single node
  for (i = 0; i < extractors.length; i++) {
    extractor = extractors[i];
    urls = extractor(info);

    if (urls) {
      urls = Array.isArray(urls) ? urls : [urls];

      for (j = 0; j < urls.length; j++) {
        url = urls[j];

        if (typeof url === "string") {
          yield { ...info, url };
        }
        else {
          yield { ...info, ...url };
        }
      }
    }
  }
}

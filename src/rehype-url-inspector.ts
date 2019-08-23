import { Processor, Transformer } from "unified";
import { Node, Parent } from "unist";
import { VFile } from "vfile";
import { findUrls } from "./find-urls";
import { NormalizedOptions, Options } from "./options";
import { HtmlElementNode, UrlMatch } from "./types";

/**
 * This is a rehype plugin to validate and rewrite URLs anywhere in an HTML document.
 */
export function inspectUrls(this: Processor, opts?: Options): Transformer {
  let options = new NormalizedOptions(opts);

  return function transformer(root: Node, file: VFile): Node {
    let { inspect, inspectEach } = options;
    let urls: UrlMatch[] = [];
    let keepGoing: unknown;

    for (let node of crawl(root)) {
      for (let url of findUrls({ node, root, file }, options)) {
        if (inspectEach) {
          keepGoing = inspectEach(url);

          if (keepGoing !== undefined && !keepGoing) {
            // Stop crawling and immediately return
            return root;
          }
        }

        urls.push(url);
      }
    }

    if (inspect) {
      inspect(urls);
    }

    return root;
  };
}

/**
 * Crawls all descendant nodes and returns each one that matches one of the specified tag names.
 */
export function *crawl(node: Node): IterableIterator<HtmlElementNode> {
  if (node.type === "element") {
    yield node as HtmlElementNode;
  }

  if (node.children) {
    for (let child of (node as Parent).children) {
      yield *crawl(child);
    }
  }
}

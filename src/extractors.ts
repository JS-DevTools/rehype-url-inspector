import * as urlRegex from "url-regex";
import { NodeInfo, UrlExtractor } from "./types";

/**
 * The default URL extractors
 */
export const defaultExtractors: UrlExtractor[] = [
  jsonUrls,
  styleUrls,
];

/**
 * Matches all URLs in a string
 */
const urlsPattern = urlRegex();

/**
 * Matches CSS URLs - including absolute and relative URLs
 */
const cssUrlPattern = /url\(["']?(.*?)["']?\)/ig;

/**
 * Finds URLs in JSON `<script>` tags
 *
 * @example
 *   <script type="application/json">
 *   <script type="application/ld+json">
 */
function jsonUrls({ node }: NodeInfo): string[] | undefined {
  if (node.tagName === "script"                     // Must be a <script> tag
    && node.properties                              // Must have attributes
    && !node.properties.src                         // Ignore external scripts. We only want inline scripts.
    && typeof node.properties.type === "string"     // Must have a "type" attribute
    && node.properties.type.includes("json")        // The "type" must contain "json"
    && node.children                                // Must have contents
    && node.children.length === 1                   // Must only have a single child
    && node.children[0].type === "text"             // The child must be a text node
  ) {
    let json = node.children[0].value as string;
    let urls = json.match(urlsPattern);
    return urls || undefined;
  }
}

/**
 * Finds URLs in inline `<style>` tags
 *
 * @example
 *   <style>
 *      div {
 *        background-image: url(/img/logo.png);
 *        content: url("http://example.com/img/logo.png")
 *      }
 *   </style>
 */
function styleUrls({ node }: NodeInfo): string[] | undefined {
  if (node.tagName === "style"                      // Must be a <style> tag
    && node.children                                // Must have contents
    && node.children.length === 1                   // Must only have a single child
    && node.children[0].type === "text"             // The child must be a text node
  ) {
    let css = node.children[0].value as string;
    let match, urls = [];

    // tslint:disable-next-line: no-conditional-assignment
    while ((match = cssUrlPattern.exec(css)) !== null) {
      let url = match[1];
      urls.push(url);
    }

    return urls;
  }
}

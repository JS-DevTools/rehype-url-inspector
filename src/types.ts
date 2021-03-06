import { Node } from "unist";
import { VFile } from "vfile";

/**
 * Selection criteria for a URL attribute
 */
export interface UrlSelector {
  tagName: string;
  propertyName: string;
  pattern?: RegExp;
}

/**
 * Returns the URL(s) for the given node.
 */
export type UrlExtractor = (node: NodeInfo) => undefined | string | ExtractedUrl | Array<string | ExtractedUrl>;

/**
 * A URL that was extracted from a HAST node.
 */
export interface ExtractedUrl {
  url: string;
  propertyName?: string;
}

/**
 * Information about the HAST node where a URL was found.
 */
export interface NodeInfo {
  node: HtmlElementNode;
  root: Node;
  file: VFile;
}

/**
 * A URL that was found in the document
 */
export type UrlMatch = ExtractedUrl & NodeInfo;

/**
 * An HTML element node
 */
export interface HtmlElementNode extends Node {
  type: "element";
  tagName: string;
  properties?: {
    [prop: string]: unknown;
  };
  children?: Node[];
}

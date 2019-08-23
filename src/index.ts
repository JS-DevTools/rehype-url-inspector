import { inspectUrls } from "./rehype-url-inspector";

export { Options } from "./options";
export * from "./types";
export { inspectUrls };

// Export `inspectUrls` as the default export
// tslint:disable: no-default-export
export default inspectUrls;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);  // tslint:disable-line: no-unsafe-any
}

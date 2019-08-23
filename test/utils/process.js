"use strict";

const inspectUrls = require("../../");
const unified = require("unified");
const parse = require("rehype-parse");
const stringify = require("rehype-stringify");
const toVFile = require("to-vfile");

module.exports = process;

/**
 * Processes the given HTML file using Rehype and the inspectUrls plugin
 */
async function process (filePath, options = {}) {
  let processor = unified()
    .use(parse)
    .use(inspectUrls, options)
    .use(stringify);

  let file = await toVFile.read(filePath);
  return processor.process(file);
}

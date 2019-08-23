"use strict";

const { expect } = require("chai");

module.exports = compare;

/**
 * Compares actual UrlMatch objects to expected values, and throws an error that's easy to visally diff.
 */
function compare (matches, urls) {
  matches = matches.map(({ node, propertyName, url }) =>
    ({ tag: node.tagName, prop: propertyName, url })
  );

  try {
    expect(matches).to.have.lengthOf(urls.length);
    for (let [index, match] of matches.entries()) {
      let url = urls[index];
      expect(match.tag).to.equal(url.tag);
      expect(match.prop).to.equal(url.prop);
      expect(match.url).to.equal(url.url);
    }
  }
  catch (error) {
    let message = error.message + "\n\n";

    for (let i = 0; i < Math.max(matches.length, urls.length); i++) {
      let actual = format(matches[i]);
      let expected = format(urls[i]);

      if (actual === expected) {
        message += `✔  ${expected}\n`;
      }
      else {
        message +=
          `\n❌ Expected: ${expected}\n` +
          `      Actual: ${actual}\n\n`;
      }
    }

    throw new Error(message);
  }
}

/**
 * Formats a match for easy visual diffing
 */
function format ({ tag, prop, url } = {}) {
  if (!tag) {
    return "MISSING";
  }
  else if (prop) {
    return `<${tag} ${prop}="${url}">`;
  }
  else {
    return `<${tag}>${url}</${tag}>`;
  }
}

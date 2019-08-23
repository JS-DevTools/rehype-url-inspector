"use strict";

const process = require("../utils/process");
const compare = require("../utils/compare");
const sinon = require("sinon");
const { expect } = require("chai");

describe("options.selectors", () => {

  it("should use custom CSS attribute selectors", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/links.html", {
      inspect,
      selectors: [
        "meta[name]",
        "a[target]",
      ],

    });

    compare(inspect.firstCall.args[0], [
      { tag: "meta", prop: "name", url: "viewport" },
      { tag: "meta", prop: "name", url: "robots" },
      { tag: "a", prop: "target", url: "_blank" },
      { tag: "a", prop: "target", url: "" },
      { tag: "a", prop: "target", url: "_top" },
      { tag: "a", prop: "target", url: "" },
    ]);
  });

  it("should use custom selector objects", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/links.html", {
      inspect,
      selectors: [
        { tagName: "meta", propertyName: "content" },
        { tagName: "a", propertyName: "href", pattern: /^http/ },
      ],

    });

    compare(inspect.firstCall.args[0], [
      { tag: "meta", prop: "content", url: "utf-8" },
      { tag: "meta", prop: "content", url: "text/html;charset=utf-8" },
      { tag: "meta", prop: "content", url: "width=device-width, initial-scale=1" },
      { tag: "meta", prop: "content", url: "index, follow" },
      { tag: "a", prop: "href", url: "http://example.com/foo/bar/" },
      { tag: "a", prop: "href", url: "https://example.com" },
      { tag: "a", prop: "href", url: "https://www.example.com" },
      { tag: "a", prop: "href", url: "https://unknown.domain.fizzbuzz" },
    ]);
  });

  it("should use custom extractor functions", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/links.html", {
      inspect,
      selectors: [
        function nameAttribute ({ node }) {
          return node.properties && node.properties.name;
        },

        function htmlFiles ({ node }) {
          if (node.tagName === "a" && node.properties) {
            let { href } = node.properties;
            if (href && href.endsWith(".html")) {
              return { url: href, propertyName: "href" };
            }
          }
        }
      ],

    });

    compare(inspect.firstCall.args[0], [
      { tag: "meta", url: "viewport" },
      { tag: "meta", url: "robots" },
      { tag: "a", url: "title" },
      { tag: "a", prop: "href", url: "some-page.html" },
    ]);
  });

  it("should also use default selectors if options.keepDefaultSelectors is true", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/links.html", {
      inspect,
      keepDefaultSelectors: true,
      selectors: [
        "meta[name]",
        "a[target]",
      ],
    });

    compare(inspect.firstCall.args[0], [
      { tag: "meta", prop: "name", url: "viewport" },
      { tag: "meta", prop: "name", url: "robots" },
      { tag: "a", prop: "target", url: "_blank" },
      { tag: "a", prop: "href", url: "http://example.com/foo/bar/" },
      { tag: "a", prop: "href", url: "some-page.html" },
      { tag: "a", prop: "href", url: "example.com" },
      { tag: "a", prop: "target", url: "" },
      { tag: "a", prop: "href", url: "www.example.com" },
      { tag: "a", prop: "href", url: "unknown.domain.fizzbuzz" },
      { tag: "a", prop: "target", url: "_top" },
      { tag: "a", prop: "href", url: "https://example.com" },
      { tag: "a", prop: "href", url: "https://www.example.com" },
      { tag: "a", prop: "target", url: "" },
      { tag: "a", prop: "href", url: "https://unknown.domain.fizzbuzz" },
    ]);
  });

  it("should find nothing if options.selectors is an empty array", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/links.html", {
      inspect,
      selectors: [],
    });

    compare(inspect.firstCall.args[0], []);
  });

  it("should throw an error if a CSS selector is unsupported", async () => {
    let error;

    try {
      await process("test/fixtures/many-urls.html", {
        selectors: [
          "a[href~=http://]"
        ]
      });
    }
    catch (err) {
      error = err;
    }

    expect(error).to.be.an.instanceOf(Error);
    expect(error.message).to.equal("Invalid or unsupported CSS selector: a[href~=http://]");
  });

});

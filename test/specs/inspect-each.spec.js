"use strict";

const process = require("../utils/process");
const compare = require("../utils/compare");
const sinon = require("sinon");
const { expect } = require("chai");

describe("options.inspectEach", () => {

  it("should be called with each URL on the page", async () => {
    let inspectEach = sinon.spy();
    await process("test/fixtures/many-urls.html", { inspectEach });

    let urls = [
      { tag: "link", prop: "href", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "//example.com/img/media/twitter-card.png" },
      { tag: "meta", prop: "content", url: "//example.com/home?ref=url&media=" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/img/media/twitter-card.png" },
      { tag: "link", prop: "href", url: "/site.webmanifest" },
      { tag: "script", url: "http://schema.org" },
      { tag: "script", url: "http://example.com/home" },
      { tag: "script", url: "http://localhost:8080/fizz/buzz" },
      { tag: "script", url: "http://localhost:8080/img/media/twitter-card.png" },
      { tag: "link", prop: "href", url: "/img/favicon-32x32.png" },
      { tag: "link", prop: "href", url: "/css/main.css?v=5" },
      { tag: "img", prop: "src", url: "/img/logo.svg" },
      { tag: "a", prop: "href", url: "http://example.com/foo/bar/" },
      { tag: "a", prop: "href", url: "some-page.html" },
      { tag: "style", url: "img/chart-background.jpeg" },
      { tag: "style", url: "example.com/img/logo.svg" },
      { tag: "img", prop: "src", url: "img/sales/charg.svg" },
      { tag: "script", prop: "src", url: "js/script.js" },
      { tag: "script", url: "https://example.com/john%20doe#about" },
      { tag: "script", url: "//bob.smith/about+me?redirect=false&foo" },
      { tag: "script", url: "www.henry.ford.net" },
    ];

    sinon.assert.callCount(inspectEach, urls.length);

    let matches = [];

    for (let i = 0; i < urls.length; i++) {
      expect(inspectEach.args[i]).to.have.lengthOf(1);
      matches.push(inspectEach.args[i][0]);
    }

    compare(matches, urls);
  });

  it("should exit early if false is returned", async () => {
    let inspectEach = sinon.stub().onCall(4).returns(false);
    await process("test/fixtures/many-urls.html", { inspectEach });

    let urls = [
      { tag: "link", prop: "href", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "//example.com/img/media/twitter-card.png" },
      { tag: "meta", prop: "content", url: "//example.com/home?ref=url&media=" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/img/media/twitter-card.png" },
    ];

    sinon.assert.callCount(inspectEach, urls.length);

    let matches = [];

    for (let i = 0; i < urls.length; i++) {
      expect(inspectEach.args[i]).to.have.lengthOf(1);
      matches.push(inspectEach.args[i][0]);
    }

    compare(matches, urls);
  });

});

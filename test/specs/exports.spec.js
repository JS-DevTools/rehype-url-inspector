"use strict";

const commonJSExport = require("../../");
const { default: defaultExport, inspectUrls: namedExport } = require("../../");
const { expect } = require("chai");

describe("rehype-url-inspector package exports", () => {

  it("should export the inspectUrls() function as the default CommonJS export", () => {
    expect(commonJSExport).to.be.a("function");
    expect(commonJSExport.name).to.equal("inspectUrls");
  });

  it("should export the inspectUrls() function as the default ESM export", () => {
    expect(defaultExport).to.be.a("function");
    expect(defaultExport).to.equal(commonJSExport);
  });

  it("should export the inspectUrls() function as a named export", () => {
    expect(namedExport).to.be.a("function");
    expect(namedExport).to.equal(commonJSExport);
  });

  it("should not export anything else", () => {
    expect(Object.keys(commonJSExport)).to.have.same.members([
      "default",
      "inspectUrls",
    ]);
  });

});

const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("cdsandbox", () => {
  it("works as expected", () => {
    expect(1 + 1).to.equal(2);
  });
});

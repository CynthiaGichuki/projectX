const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;

  beforeEach(async function () {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.deployed();
  });

  it("should start with a count of 0", async function () {
    expect(await counter.getCounter()).to.equal(ethers.BigNumber.from(0));
  });

  it("should increment the count", async function () {
    await counter.increment();
    expect(await counter.getCounter()).to.equal(ethers.BigNumber.from(1));
  });

  it("should decrement the count", async function () {
    await counter.increment();
    await counter.decrement();
    expect(await counter.getCounter()).to.equal(ethers.BigNumber.from(0));
  });

  it("should not decrement below 0", async function () {
    await expect(counter.decrement()).to.be.revertedWith("Counter: count must be greater than zero");
  });
});

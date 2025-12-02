const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let myToken;
/*
  beforeEach(async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();
    await myToken.deployed();
  });

  it("should have correct name and symbol", async function () {
    expect(await myToken.name()).to.equal("MyToken");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("should mint tokens", async function () {
    const [owner] = await ethers.getSigners();
    await myToken.mint(owner.address, 100);
    expect(await myToken.balanceOf(owner.address)).to.equal(100);
  });

  it("should burn tokens", async function () {
    const [owner] = await ethers.getSigners();
    await myToken.mint(owner.address, 100);
    await myToken.burn(owner.address, 50);
    expect(await myToken.balanceOf(owner.address)).to.equal(50);
  });
  */
});

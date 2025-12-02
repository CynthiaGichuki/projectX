const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  let myNFT;
  let owner;
  let addr1;

  /*
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy(owner.address);
    await myNFT.deployed();
  });

  it("should have correct name and symbol", async function () {
    expect(await myNFT.name()).to.equal("MyNFT");
    expect(await myNFT.symbol()).to.equal("NFT");
  });

  it("should mint an NFT", async function () {
    const tokenURI = "http://test.hslu.ch/1";
    await myNFT.safeMint(addr1.address, tokenURI);
    expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await myNFT.tokenURI(0)).to.equal(tokenURI);
  });

  it("should burn an NFT", async function () {
    const tokenURI = "http://test.hslu.ch/1";
    await myNFT.safeMint(addr1.address, tokenURI);
    await myNFT.burn(0);
    await expect(myNFT.ownerOf(0)).to.be.revertedWith("ERC721: owner query for nonexistent token");
  });
  */
 
});

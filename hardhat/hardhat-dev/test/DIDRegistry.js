const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DIDRegistry", function () {
  let didRegistry;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    didRegistry = await DIDRegistry.deploy();
    await didRegistry.deployed();
  });

  it("should set a DID", async function () {
    const address = "did:test:123";
    const didDocument = "https://example.com/did/1";
    await didRegistry.setDID(addr1.address, didDocument);
    expect(await didRegistry.getDID(addr1.address)).to.equal(didDocument);

    //await didRegistry.setDID(address, didDocument);
    //expect(await didRegistry.getDID(address)).to.equal(didDocument);
  });

  /*
  it("should not allow non-owner to set a DID", async function () {
    const address = "did:test:123";
    const didDocument = "https://example.com/did/1";
    //await expect(didRegistry.connect(addr1).setDID(addr1.address, didDocument)).to.be.revertedWith("Only owner can call this function");
    await expect(didRegistry.connect(addr1).setDID(address, didDocument)).to.be.revertedWith("Only owner can call this function");
  });
  */

  it("should delete a DID", async function () {
    const address = "did:test:123";
    const didDocument = "https://example.com/did/1";
    /*await didRegistry.setDID(address, didDocument);
    await didRegistry.deleteDID(address);
    expect(await didRegistry.getDID(address)).to.equal("");
    */
    await didRegistry.setDID(addr1.address, didDocument);
    await didRegistry.deleteDID(addr1.address);
    expect(await didRegistry.getDID(addr1.address)).to.equal("");
    
  });

  /*
  it("should not allow non-owner to delete a DID", async function () {
    const didDocument = "https://example.com/did/1";
    await didRegistry.setDID(addr1.address, didDocument);
    await expect(didRegistry.connect(addr1).deleteDID(addr1.address)).to.be.revertedWith("Only owner can call this function");
  });
  */
});

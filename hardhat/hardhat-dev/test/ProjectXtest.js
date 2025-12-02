const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectX governance flow", function () {
  let ProjectX;
  let projectX;
  let owner;
  let voter;
  let expert;

  beforeEach(async function () {
    // Get three example identities (for SSI roles)
    [owner, voter, expert] = await ethers.getSigners();

    // Load contract factory and deploy a fresh instance
    ProjectX = await ethers.getContractFactory("ProjectX");
    projectX = await ProjectX.deploy();
    await projectX.deployed();
  });

  it("sets the deployer as owner", async function () {
    const contractOwner = await projectX.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("allows owner to add an expert", async function () {
    await projectX.addExpert(expert.address);
    const isExpert = await projectX.experts(expert.address);
    expect(isExpert).to.equal(true);
  });

  it("runs full proposal lifecycle (create -> vote -> expert milestone -> finalize)", async function () {
    // 1) Owner adds an expert
    await projectX.addExpert(expert.address);
    expect(await projectX.experts(expert.address)).to.equal(true);

    // 2) Owner (as citizen) creates a proposal with an IPFS CID
    const ipfsCid = "QmTestCidABC123"; // this would come from IPFS in the real flow
    await projectX.createProposal("Renovate local playground", ipfsCid);

    // Check proposal count = 1
    const count = await projectX.proposalCount();
    expect(count.toNumber()).to.equal(1);

    // 3) Voter votes once
    await projectX.connect(voter).vote(1);

    // Check stored vote count
    const proposalRaw = await projectX.proposals(1);
    expect(proposalRaw.voteCount.toNumber()).to.equal(1);

    // 4) Prevent double voting from same address
    await expect(projectX.connect(voter).vote(1)).to.be.revertedWith("already voted");

    // 5) Expert approves milestone with another IPFS CID
    const milestoneCid = "QmMilestoneCidXYZ456";
    await projectX.connect(expert).approveMilestone(1, milestoneCid);

    // Use helper to read full proposal
    const proposal = await projectX.getProposal(1);

    // Basic checks on returned struct
    expect(proposal.id.toNumber()).to.equal(1);
    expect(proposal.proposer).to.equal(owner.address);
    expect(proposal.description).to.equal("Renovate local playground");
    expect(proposal.ipfsHash).to.equal(ipfsCid);
    expect(proposal.voteCount.toNumber()).to.equal(1);
    expect(proposal.finalized).to.equal(false);

    // 6) Finalize proposal – allowed by owner or expert (prototype rule)
    await projectX.connect(expert).finalizeProposal(1);

    const proposalAfter = await projectX.getProposal(1);
    expect(proposalAfter.finalized).to.equal(true);
  });

  it("does not allow non-owner to add experts", async function () {
    await expect(
      projectX.connect(voter).addExpert(expert.address)
    ).to.be.revertedWith("only owner");
  });

  it("does not allow non-expert to approve milestone", async function () {
    // No experts yet
    await projectX.createProposal("Test", "QmTest");
    await expect(
      projectX.connect(voter).approveMilestone(1, "QmMilestone")
    ).to.be.revertedWith("only expert");
  });
});
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoIDGovernance Contract", function () {
  let NeoID, NeoIDGovernance, neoID, governance, owner, user1;

  beforeEach(async function () {
    NeoID = await ethers.getContractFactory("NeoID");
    NeoIDGovernance = await ethers.getContractFactory("NeoIDGovernance");

    [owner, user1] = await ethers.getSigners();

    neoID = await NeoID.deploy();
    await neoID.deployed();

    governance = await NeoIDGovernance.deploy(neoID.address);
    await governance.deployed();

    // Register user1
    await neoID.connect(user1).registerUser("did:user1");
    await neoID.updateReputation(user1.address, 10);
  });

  it("should create a proposal", async function () {
    await governance.createProposal("Increase reputation threshold");
    const proposal = await governance.proposals(0);

    expect(proposal.description).to.equal("Increase reputation threshold");
  });

  it("should allow users to vote on proposals", async function () {
    await governance.createProposal("Test Proposal");
    await governance.connect(user1).vote(0, true);

    const proposal = await governance.proposals(0);
    expect(proposal.votesFor).to.equal(10); // Reputation = 10
  });

  it("should not allow users to vote twice on the same proposal", async function () {
    await governance.createProposal("Test Proposal");
    await governance.connect(user1).vote(0, true);
    
    await expect(governance.connect(user1).vote(0, true)).to.be.revertedWith("User has already voted");
  });

  it("should execute proposal after voting", async function () {
    await governance.createProposal("Test Proposal");
    await governance.connect(user1).vote(0, true);
    await governance.executeProposal(0);

    const proposal = await governance.proposals(0);
    expect(proposal.executed).to.be.true;
  });
});

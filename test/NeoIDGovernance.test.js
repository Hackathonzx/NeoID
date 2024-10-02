const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoIDGovernance Contract", function () {
  let NeoID, neoID, NeoIDGovernance, governance, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy NeoID contract
    NeoID = await ethers.getContractFactory("NeoID");
    neoID = await NeoID.deploy();
    await neoID.waitForDeployment();

    // Deploy NeoIDGovernance contract
    NeoIDGovernance = await ethers.getContractFactory("NeoIDGovernance");
    governance = await NeoIDGovernance.deploy(neoID.address);
    await governance.deployed();

    // Register users and set reputations
    await neoID.connect(user1).registerUser("user1DID");
    await neoID.connect(user2).registerUser("user2DID");
    await neoID.connect(owner).updateReputation(user1.address, 100);
    await neoID.connect(owner).updateReputation(user2.address, 50);
  });

  it("should create a proposal", async function () {
    await expect(governance.connect(user1).createProposal("Test Proposal"))
      .to.emit(governance, "ProposalCreated")
      .withArgs(0, "Test Proposal");
  });

  it("should allow users with reputation to vote", async function () {
    await governance.connect(user1).createProposal("Test Proposal");
    await expect(governance.connect(user1).vote(0, true))
      .to.emit(governance, "Voted")
      .withArgs(0, user1.address, true, 100);
  });

  it("should not allow users to vote twice", async function () {
    await governance.connect(user1).createProposal("Test Proposal");
    await governance.connect(user1).vote(0, true);
    await expect(governance.connect(user1).vote(0, false)).to.be.revertedWith("User has already voted");
  });

  it("should execute a proposal", async function () {
    await governance.connect(user1).createProposal("Test Proposal");
    await governance.connect(user1).vote(0, true);
    await governance.connect(user2).vote(0, true);
    await expect(governance.connect(user1).executeProposal(0)).to.not.be.reverted;
  });
});
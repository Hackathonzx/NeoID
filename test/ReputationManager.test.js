const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationManager Contract", function () {
  let NeoID, ReputationManager, neoID, reputationManager, owner, user1, user2;

  beforeEach(async function () {
    NeoID = await ethers.getContractFactory("NeoID");
    ReputationManager = await ethers.getContractFactory("ReputationManager");
    
    [owner, user1, user2] = await ethers.getSigners();
    
    neoID = await NeoID.deploy();
    await neoID.deployed();
    
    reputationManager = await ReputationManager.deploy(neoID.address);
    await reputationManager.deployed();
  });

  it("should increase user reputation", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await reputationManager.increaseReputation(user1.address, 20);
    
    const user = await neoID.users(user1.address);
    expect(user.reputation).to.equal(20);
  });

  it("should decrease user reputation", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await reputationManager.increaseReputation(user1.address, 20);
    await reputationManager.decreaseReputation(user1.address, 5);
    
    const user = await neoID.users(user1.address);
    expect(user.reputation).to.equal(15);
  });

  it("should prevent decreasing reputation below zero", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await reputationManager.increaseReputation(user1.address, 10);
    await expect(reputationManager.decreaseReputation(user1.address, 15)).to.be.revertedWith("Reputation cannot go below zero");
  });
});

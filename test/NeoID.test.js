const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NeoID Contract", function () {
  let NeoID, neoID, owner, user1, user2, whitelistedAddress;

  beforeEach(async function () {
    NeoID = await ethers.getContractFactory("NeoID");
    [owner, user1, user2, whitelistedAddress] = await ethers.getSigners();
    neoID = await NeoID.deploy(); // Fix: no need to use .deployed()
  });
  

  it("should allow owner to add a user and emit the UserRegistered event", async function () {
    await expect(neoID.connect(user1).registerUser("did:user1"))
      .to.emit(neoID, "UserRegistered")
      .withArgs(user1.address, "did:user1");

    const user = await neoID.users(user1.address);
    expect(user.did).to.equal("did:user1");
    expect(user.reputation).to.equal(0);
    expect(user.registered).to.be.true;
  });

  it("should not allow the same user to register twice", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await expect(neoID.connect(user1).registerUser("did:user1")).to.be.revertedWith("User already registered");
  });

  it("should allow the owner to whitelist an address", async function () {
    await neoID.addToWhitelist(whitelistedAddress.address);
    expect(await neoID.isWhitelisted(whitelistedAddress.address)).to.be.true;
  });

  it("should allow whitelisted address to update reputation", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await neoID.addToWhitelist(whitelistedAddress.address);
    await expect(neoID.connect(whitelistedAddress).updateReputation(user1.address, 10))
      .to.emit(neoID, "ReputationUpdated")
      .withArgs(user1.address, 10);
    
    const user = await neoID.users(user1.address);
    expect(user.reputation).to.equal(10);
  });

  it("should prevent non-whitelisted addresses from updating reputation", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await expect(neoID.connect(user2).updateReputation(user1.address, 10)).to.be.revertedWith("Not authorized");
  });
});

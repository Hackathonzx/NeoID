const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl Contract", function () {
  let AccessControl, accessControl, NeoID, neoID, owner, user;
  const requiredReputation = 100;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy NeoID contract
    NeoID = await ethers.getContractFactory("NeoID");
    neoID = await NeoID.deploy();
    await neoID.waitForDeployment();

    // Deploy AccessControl contract
    AccessControl = await ethers.getContractFactory("AccessControl");
    accessControl = await AccessControl.deploy(neoID.address, requiredReputation);
    await accessControl.deployed();

    // Register user in NeoID
    await neoID.connect(user).registerUser("userDID");
  });

  it("should allow users with sufficient reputation to access premium service", async function () {
    // Set user's reputation to meet the requirement
    await neoID.connect(owner).updateReputation(user.address, requiredReputation);

    // User should be able to access premium service
    await expect(accessControl.connect(user).accessPremiumService()).to.not.be.reverted;
  });

  it("should prevent users with insufficient reputation from accessing premium service", async function () {
    // Set user's reputation below the requirement
    await neoID.connect(owner).updateReputation(user.address, requiredReputation - 1);

    // User should not be able to access premium service
    await expect(accessControl.connect(user).accessPremiumService()).to.be.revertedWith("Not enough reputation to access this service");
  });

  it("should allow updating the required reputation", async function () {
    const newReputation = 200;
    await accessControl.connect(owner).updateRequiredReputation(newReputation);
    expect(await accessControl.requiredReputation()).to.equal(newReputation);
  });
});
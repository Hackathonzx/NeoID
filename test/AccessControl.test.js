const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessControl Contract", function () {
  let NeoID, AccessControl, neoID, accessControl, owner, user1, user2;

  beforeEach(async function () {
    const NeoID = await ethers.getContractFactory("NeoID");
    const AccessControl = await ethers.getContractFactory("AccessControl");
  
    [owner, user1, user2] = await ethers.getSigners();
  
    neoID = await NeoID.deploy();
    await neoID.waitForDeployment(); // Ensure it's deployed properly
  
    accessControl = await AccessControl.deploy(neoID.address, 10); // Fix: use proper contract address
    await accessControl.deployed(); // Ensure AccessControl is deployed
  });
  
  

  it("should prevent users with insufficient reputation from accessing premium service", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await expect(accessControl.connect(user1).accessPremiumService()).to.be.revertedWith("Not enough reputation to access this service");
  });

  it("should allow users with sufficient reputation to access premium service", async function () {
    await neoID.connect(user1).registerUser("did:user1");
    await neoID.updateReputation(user1.address, 20);

    await expect(accessControl.connect(user1).accessPremiumService()).to.not.be.reverted;
  });
});

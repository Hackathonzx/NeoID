const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationManager Contract", function () {
    let NeoID, neoID, ReputationManager, reputationManager, owner, user, admin;

    beforeEach(async function () {
        [owner, user, admin] = await ethers.getSigners();

        // Deploy NeoID contract
        NeoID = await ethers.getContractFactory("NeoID");
        neoID = await NeoID.deploy(); // Deploy NeoID contract

        // Log the deployed NeoID address
        console.log("NeoID Address:", neoID.address); // Logging NeoID address

        // Deploy ReputationManager contract with the deployed NeoID address
        ReputationManager = await ethers.getContractFactory("ReputationManager");
        reputationManager = await ReputationManager.deploy(neoID.address); // Pass the actual address

        // Register user
        await neoID.connect(user).registerUser("userDID");

        // Add ReputationManager to whitelist in NeoID
        await neoID.connect(owner).addToWhitelist(reputationManager.address);
    });

    it("should increase user reputation", async function () {
        await expect(reputationManager.connect(owner).increaseReputation(user.address, 50))
            .to.emit(reputationManager, "ReputationChanged")
            .withArgs(user.address, 50, 50);
    });

    it("should decrease user reputation", async function () {
        // First increase reputation
        await reputationManager.connect(owner).increaseReputation(user.address, 100);

        // Then decrease
        await expect(reputationManager.connect(owner).decreaseReputation(user.address, 30))
            .to.emit(reputationManager, "ReputationChanged")
            .withArgs(user.address, -30, 70);
    });

    it("should not allow reputation to go below zero", async function () {
        await expect(reputationManager.connect(owner).decreaseReputation(user.address, 10))
            .to.be.revertedWith("Reputation cannot go below zero");
    });

    it("should only allow admin to change reputation", async function () {
        await expect(reputationManager.connect(user).increaseReputation(user.address, 50))
            .to.be.revertedWith("Only admin can call this function");
    });
});

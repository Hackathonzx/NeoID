const hre = require("hardhat");

async function deployContract(contractName, ...args) {
  const Contract = await hre.ethers.getContractFactory(contractName);
  
  // Get the current fee data
  const feeData = await hre.ethers.provider.getFeeData();

  // Calculate gas settings that are likely to be accepted
  const maxFeePerGas = feeData.maxFeePerGas * BigInt(2); // Double the suggested max fee
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(2); // Double the suggested priority fee

  // Deploy the contract with the calculated gas settings
  const contract = await Contract.deploy(...args, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await contract.waitForDeployment();
  console.log(`${contractName} deployed to:`, await contract.getAddress());
  return contract;
}

async function main() {
  // Deploy NeoID Contract
  const neoID = await deployContract("NeoID");

  // Deploy ReputationManager Contract (linked to NeoID)
  const reputationManager = await deployContract("ReputationManager", await neoID.getAddress());

  // Deploy AccessControl Contract (linked to NeoID)
  const requiredReputation = 50; // Example value for required reputation
  const accessControl = await deployContract("AccessControl", await neoID.getAddress(), requiredReputation);

  // Deploy NeoIDGovernance Contract (linked to NeoID)
  const neoIDGovernance = await deployContract("NeoIDGovernance", await neoID.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
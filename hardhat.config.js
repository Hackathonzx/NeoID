require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    neoXTestnet: {
      chainId: 12227332,
      url: process.env.NEO_X_RPC_URL,
      accounts:  [process.env.PRIVATE_KEY],
      gasPrice: "auto",
      gasMultiplier: 2,
    }
  },
};
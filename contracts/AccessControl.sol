// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NeoID.sol";

contract AccessControl {
    NeoID public neoIDContract;

    // Minimum reputation required to access premium services
    uint256 public requiredReputation;

    constructor(address _neoIDContractAddress, uint256 _requiredReputation) {
        neoIDContract = NeoID(_neoIDContractAddress);
        requiredReputation = _requiredReputation;
    }

    // Modifier to check if the user meets the required reputation
    modifier onlyReputableUsers() {
        (, uint256 reputation) = neoIDContract.getUser(msg.sender);
        require(reputation >= requiredReputation, "Not enough reputation to access this service");
        _;
    }

    // Example function that requires a high reputation
    function accessPremiumService() external onlyReputableUsers {
        // Premium service logic here
    }

    // Update the reputation requirement for access (only admin)
    function updateRequiredReputation(uint256 _newReputation) external {
        requiredReputation = _newReputation;
    }
}

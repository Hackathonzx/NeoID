// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NeoID.sol";

contract ReputationManager {
    NeoID public neoIDContract;

    // Only specific addresses (admin/dApps) can update reputation
    address public admin;

    // Event for reputation change
    event ReputationChanged(address indexed user, int256 change, uint256 newReputation);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor(address _neoIDContractAddress) {
        neoIDContract = NeoID(_neoIDContractAddress);
        admin = msg.sender;
    }

    // Function to increase reputation
    function increaseReputation(address _user, uint256 _amount) external onlyAdmin {
        (, uint256 reputation) = neoIDContract.getUser(_user); // Did variable removed
        uint256 newReputation = reputation + _amount;

        neoIDContract.updateReputation(_user, newReputation);
        emit ReputationChanged(_user, int256(_amount), newReputation);
    }

    // Function to decrease reputation
    function decreaseReputation(address _user, uint256 _amount) external onlyAdmin {
        (, uint256 reputation) = neoIDContract.getUser(_user); // Did variable removed
        require(reputation >= _amount, "Reputation cannot go below zero");
        
        uint256 newReputation = reputation - _amount;
        neoIDContract.updateReputation(_user, newReputation);
        emit ReputationChanged(_user, -int256(_amount), newReputation);
    }
}

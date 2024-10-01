// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NeoID {
    // Structure to hold user identity details
    struct User {
        string did; // Decentralized Identifier
        uint256 reputation; // Reputation score
        bool registered; // To track if user is already registered
    }

    // Mapping to store users' identities and reputation
    mapping(address => User) public users;

    // Only the admin or specific whitelisted addresses can update reputation
    address public admin;

    // Whitelist of authorized addresses
    mapping(address => bool) public isWhitelisted;

    // Event for user registration
    event UserRegistered(address indexed user, string did);
    
    // Event for updating reputation
    event ReputationUpdated(address indexed user, uint256 newReputation);

    // Event for managing whitelist
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);

    // Constructor to set the admin
    constructor() {
        admin = msg.sender; // Set the contract deployer as admin
    }

    // Modifier to allow only the admin or whitelisted addresses to update reputation
    modifier onlyWhitelisted() {
        require(msg.sender == admin || isWhitelisted[msg.sender], "Not authorized");
        _;
    }

    // Admin can add addresses to the whitelist
    function addToWhitelist(address _account) external {
        require(msg.sender == admin, "Only admin can add to whitelist");
        isWhitelisted[_account] = true;
        emit AddressWhitelisted(_account);
    }

    // Admin can remove addresses from the whitelist
    function removeFromWhitelist(address _account) external {
        require(msg.sender == admin, "Only admin can remove from whitelist");
        isWhitelisted[_account] = false;
        emit AddressRemovedFromWhitelist(_account);
    }

    // Function to register a new user
    function registerUser(string calldata _did) external {
        require(!users[msg.sender].registered, "User already registered");
        
        // Register the user with a unique DID and default reputation
        users[msg.sender] = User({
            did: _did,
            reputation: 0,
            registered: true
        });

        emit UserRegistered(msg.sender, _did);
    }

    // Function to update reputation (only callable by admin or whitelisted addresses)
    function updateReputation(address _user, uint256 _newReputation) external onlyWhitelisted {
        require(users[_user].registered, "User not registered");

        // Update the user's reputation
        users[_user].reputation = _newReputation;

        emit ReputationUpdated(_user, _newReputation);
    }

    // Function to view user details
    function getUser(address _user) external view returns (string memory, uint256) {
        require(users[_user].registered, "User not registered");
        User storage user = users[_user];
        return (user.did, user.reputation);
    }
}

# NeoID Reputation System

**Overview**
The NeoID Reputation System is a decentralized identity and reputation management solution that enables users to register with decentralized identifiers (DIDs), manage reputation scores, control access based on reputation, and vote on governance proposals. This system is built on Solidity and includes the following smart contracts:

- NeoID: Manages user identities and reputation scores.
- ReputationManager: Allows authorized entities to modify reputation scores.
- AccessControl: Restricts access to premium services based on user reputation.
- NeoIDGovernance: Implements a basic governance mechanism where users with reputation can create and vote on proposals.

**Contracts**
1. NeoID.sol
The NeoID contract handles the registration of users with Decentralized Identifiers (DIDs) and tracks their reputation scores. It ensures that only authorized addresses (whitelisted addresses or admin) can update reputation scores.

Features:
- User Registration: Users can register themselves with a unique DID.
- Reputation Management: Only admin or whitelisted addresses can update a user’s reputation.
- Whitelist Management: Admin can manage whitelisted addresses that have permission to modify reputation.

Events:
- UserRegistered(address indexed user, string did): Emitted when a user is registered.
- ReputationUpdated(address indexed user, uint256 newReputation): Emitted when a user's reputation is updated.
- AddressWhitelisted(address indexed account): Emitted when an address is added to the whitelist.
- AddressRemovedFromWhitelist(address indexed account): Emitted when an address is removed from the whitelist.

2. ReputationManager.sol
The ReputationManager contract interacts with the NeoID contract to manage user reputations. This contract allows only the admin to increase or decrease the reputation of users.

Features:
- Increase/Decrease Reputation: Admin can increase or decrease the reputation of users.

Events:
- ReputationChanged(address indexed user, int256 change, uint256 newReputation): Emitted when a user's reputation is changed.

3. AccessControl.sol
The AccessControl contract enforces access control based on a user’s reputation score. It interacts with the NeoID contract to determine whether users meet the minimum reputation required for accessing premium services.

Features:
- Premium Service Access: Users with sufficient reputation can access premium services.
- Reputation Requirement Management: Admin can update the minimum reputation required for access.

4. NeoIDGovernance.sol
The NeoIDGovernance contract enables users with reputation to participate in decentralized governance. Users can create proposals, vote on them, and proposals are executed based on majority votes.

Features:

- Proposal Creation: Any user can create a proposal.
- Voting: Users can vote based on their reputation score.
- Proposal Execution: Proposals are executed if the majority supports them.

Events:
- ProposalCreated(uint256 proposalId, string description): Emitted when a proposal is created.
- Voted(uint256 proposalId, address voter, bool support, uint256 reputation): Emitted when a user votes on a proposal.

**Deployment Instructions**
1. Install Dependencies: Ensure you have Node.js, npm, and Hardhat installed.

2. Clone the Repository:
git clone https://github.com/Hackathonzx/NeoID.git
cd NeoID.git

3. Install NPM Packages:
npm install

4. Compile the Contracts: 
npx hardhat compile

5. Deploy Contracts: 
npx hardhat run ignition/modules/deploy.js --network neoXTestnet
Interact with Contracts: After deploying, you can interact with the contracts via the Hardhat console or scripts.

- Here are the addresses to the deployed script:
NeoID deployed to: 0x7c9D4E3769FD085566de1DB20E5703D3Ec50d37f
ReputationManager deployed to: 0xe34c86A03F17E29F77beeE7c898Adae4dD578006
AccessControl deployed to: 0x7516abedc7e8ca01143ad636a6963B9887FC7Cf6
NeoIDGovernance deployed to: 0xA0BF7F60ec762cc7b88dEc415D46F12cFF130a55

**Usage**
1. Register a User: Users can register themselves by calling the registerUser() function in the NeoID contract:
   - neoID.registerUser("your-did");
2. Update Reputation: Admin or whitelisted addresses can update a user’s reputation through the updateReputation()
function:
   - neoID.updateReputation(userAddress, newReputation);
3. Access Premium Service: Users with sufficient reputation can access premium services via the AccessControl contract:
   - accessControl.accessPremiumService();
4. Create and Vote on Proposals: Users can create governance proposals and vote based on their reputation using the NeoIDGovernance contract:
   - neoIDGovernance.createProposal("Proposal description");
   - neoIDGovernance.vote(proposalId, true);  // true for supporting the proposal

**Access Control & Security**
- Whitelist Management: Only the admin can add or remove whitelisted addresses that have the authority to update reputations.
- Reputation-Based Access: The AccessControl contract restricts certain functionalities to users with a minimum reputation score.
- Governance Voting: Only users with reputation can participate in governance and voting.

**Testing**
To run the unit tests for the smart contracts, run:
npx hardhat test

**Future Improvements**
- Role-Based Access Control: Consider implementing roles to manage different levels of access beyond whitelisting.
- Tokenization of Reputation: Implement a token-based reward system for reputation increases, adding incentives for user participation.
- Reputation Slashing: Integrate a system where users can lose reputation for misbehavior or inactivity.

**License**
This project is licensed under the MIT License - see the LICENSE file for details.
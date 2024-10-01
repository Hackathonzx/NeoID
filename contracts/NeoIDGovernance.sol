// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NeoID.sol";

contract NeoIDGovernance {
    NeoID public neoIDContract;

    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    Proposal[] public proposals;

    // Mapping to track if a user has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool support, uint256 reputation);

    constructor(address _neoIDContractAddress) {
        neoIDContract = NeoID(_neoIDContractAddress);
    }

    // Function to create a new proposal
    function createProposal(string memory _description) external {
        proposals.push(Proposal({
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        }));

        emit ProposalCreated(proposals.length - 1, _description);
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalId, bool _support) external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        require(!hasVoted[_proposalId][msg.sender], "User has already voted");

        // Get user's reputation from NeoID contract
        (, uint256 reputation) = neoIDContract.getUser(msg.sender);
        require(reputation > 0, "Only users with reputation can vote");

        Proposal storage proposal = proposals[_proposalId];

        if (_support) {
            proposal.votesFor += reputation;
        } else {
            proposal.votesAgainst += reputation;
        }

        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _support, reputation);
    }

    // Function to execute a proposal (can be called after voting)
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal already executed");

        // Basic governance decision-making: majority wins
        if (proposal.votesFor > proposal.votesAgainst) {
            // Execute successful proposal (add your logic here)
        }

        proposal.executed = true;
    }
}

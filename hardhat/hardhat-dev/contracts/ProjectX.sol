// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * ProposalContract (simple prototype for ProjectX)
 *
 * - createProposal(description, ipfsHash)
 * - vote(proposalId)
 * - approveMilestone(proposalId, ipfsHash) -> only experts
 * - manage experts (owner can add/remove experts)
 *
 * Notes:
 * - For prototype we treat wallet address as the identity/SSI holder.
 * - IPFS hashes (CID strings) are stored as strings.
 */

contract ProjectX {
    address public owner;
    uint256 public proposalCount;

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        string ipfsHash;            // initial attached file/hash for proposal
        uint256 voteCount;
        bool finalized;             // true when experts approved and project accepted
        string[] milestoneHashes;   // IPFS hashes added by experts during implementation
        uint256 createdAt;
    }

    // proposalId => Proposal
    mapping(uint256 => Proposal) public proposals;

    // proposalId => voter address => bool
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // expert addresses
    mapping(address => bool) public experts;

    // events
    event ProposalCreated(uint256 indexed id, address indexed proposer, string ipfsHash);
    event Voted(uint256 indexed id, address indexed voter, uint256 newVoteCount);
    event MilestoneApproved(uint256 indexed id, address indexed expert, string ipfsHash);
    event ExpertAdded(address indexed expert);
    event ExpertRemoved(address indexed expert);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyExpert() {
        require(experts[msg.sender], "only expert");
        _;
    }

    constructor() {
        owner = msg.sender;
        proposalCount = 0;
    }

    // Owner can add experts (human or service acting as oracle)
    function addExpert(address _expert) external onlyOwner {
        require(_expert != address(0), "zero addr");
        require(!experts[_expert], "already expert");
        experts[_expert] = true;
        emit ExpertAdded(_expert);
    }

    function removeExpert(address _expert) external onlyOwner {
        require(experts[_expert], "not expert");
        experts[_expert] = false;
        emit ExpertRemoved(_expert);
    }

    // Create a proposal: proposer provides short description and optionally an IPFS hash
    function createProposal(string calldata _description, string calldata _ipfsHash) external {
        require(bytes(_description).length > 0, "description required");

        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.proposer = msg.sender;
        p.description = _description;
        p.ipfsHash = _ipfsHash;
        p.voteCount = 0;
        p.finalized = false;
        p.createdAt = block.timestamp;

        emit ProposalCreated(proposalCount, msg.sender, _ipfsHash);
    }

    // Vote once per address per proposal (one wallet == one vote in this prototype)
    function vote(uint256 _proposalId) external {
        require(_proposalId > 0 && _proposalId <= proposalCount, "invalid id");
        require(!hasVoted[_proposalId][msg.sender], "already voted");

        hasVoted[_proposalId][msg.sender] = true;
        proposals[_proposalId].voteCount += 1;

        emit Voted(_proposalId, msg.sender, proposals[_proposalId].voteCount);
    }

    // Experts approve milestone by attaching an IPFS hash (acts as human oracle confirmation)
    function approveMilestone(uint256 _proposalId, string calldata _ipfsHash) external onlyExpert {
        require(_proposalId > 0 && _proposalId <= proposalCount, "invalid id");
        require(bytes(_ipfsHash).length > 0, "ipfs required");

        proposals[_proposalId].milestoneHashes.push(_ipfsHash);
        emit MilestoneApproved(_proposalId, msg.sender, _ipfsHash);
    }

    // Finalize a proposal (like passing expert screening) - owner or an expert can finalize depending on your rules
    function finalizeProposal(uint256 _proposalId) external {
        require(_proposalId > 0 && _proposalId <= proposalCount, "invalid id");
        // For prototype: allow owner or expert to finalize
        require(msg.sender == owner || experts[msg.sender], "not authorized");
        proposals[_proposalId].finalized = true;
    }

    // Helper getters (optional but convenient)
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory description,
        string memory ipfsHash,
        uint256 voteCount,
        bool finalized,
        uint256 createdAt,
        string[] memory milestoneHashes
    ) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "invalid id");
        Proposal storage p = proposals[_proposalId];
        return (
            p.id,
            p.proposer,
            p.description,
            p.ipfsHash,
            p.voteCount,
            p.finalized,
            p.createdAt,
            p.milestoneHashes
        );
    }
}

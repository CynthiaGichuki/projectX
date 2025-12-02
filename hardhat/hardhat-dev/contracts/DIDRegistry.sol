// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    mapping(address => string) private dids;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function setDID(address did, string memory document) public onlyOwner {
        dids[did] = document;
    }

    function getDID(address did) public view returns (string memory) {
        return dids[did];
    }

    function deleteDID(address did) public onlyOwner {
        delete dids[did];
    }
}

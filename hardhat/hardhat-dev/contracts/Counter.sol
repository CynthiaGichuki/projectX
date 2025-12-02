// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Counter {
    uint256 private count;

    function increment() public {
        count += 1;
    }

    function decrement() public {
        require(count > 0, "Counter: count must be greater than zero");
        count -= 1;
    }

    function getCounter() public view returns (uint256) {
        return count;
    }
}

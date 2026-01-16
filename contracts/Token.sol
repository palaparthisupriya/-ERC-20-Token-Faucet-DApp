// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FaucetToken is ERC20 {
    address public minter;
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18;

    constructor() ERC20("Faucet Token", "FTK") {
        minter = msg.sender;
    }

    function setMinter(address _newMinter) external {
        require(msg.sender == minter, "Only current minter can change");
        minter = _newMinter;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only faucet can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds MAX_SUPPLY");
        _mint(to, amount);
    }
}
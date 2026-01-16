// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFaucetToken {
    function mint(address to, uint256 amount) external;
}

contract TokenFaucet {
    IFaucetToken public token;
    address public admin;
    bool public paused;

    uint256 public constant FAUCET_AMOUNT = 10 * 10**18;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 100 * 10**18;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address _tokenAddress) {
        token = IFaucetToken(_tokenAddress);
        admin = msg.sender;
    }

    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Check cooldown or limit");
        
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;
        
        token.mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (totalClaimed[user] + FAUCET_AMOUNT > MAX_CLAIM_AMOUNT) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        if (MAX_CLAIM_AMOUNT <= totalClaimed[user]) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }
}
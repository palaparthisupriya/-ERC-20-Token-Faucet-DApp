const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  // Use your private key from .env (NEVER hardcode this)
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.VITE_RPC_URL;
  
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contracts with the account:", wallet.address);

  // 1. Deploy Token
  const TokenABI = [/* Paste your Token JSON ABI here */];
  const TokenBytecode = "0x..."; // Paste your Token Bytecode from Remix here
  
  const TokenFactory = new ethers.ContractFactory(TokenABI, TokenBytecode, wallet);
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 2. Deploy Faucet
  const FaucetABI = [/* Paste your Faucet JSON ABI here */];
  const FaucetBytecode = "0x..."; // Paste your Faucet Bytecode here
  
  const FaucetFactory = new ethers.ContractFactory(FaucetABI, FaucetBytecode, wallet);
  const faucet = await FaucetFactory.deploy(tokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  console.log("\nDeployment Complete!");
  console.log("Update your .env file with these addresses.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
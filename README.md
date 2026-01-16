
# FTK Token Faucet DApp

A full-stack decentralized application that allows users to claim test FTK tokens on the Sepolia network. This project features a secure smart contract with a 24-hour cooldown and a Dockerized frontend.

## 🏗 Architecture Diagram

The following diagram illustrates how the User, MetaMask, and the Blockchain interact:

## 🔗 Smart Contract Details
Token Contract (FTK): 0xYourTokenAddressHere

Faucet Contract: 0xa17c398A040080211CCC6660b0230E36A34E9df2

Network: Sepolia Testnet

Explorer: Sepolia Etherscan

## 🖼 Screenshots
1. Successful Token Claim
The frontend updates to show the new balance once the transaction is confirmed.

2. Cooldown Error Logic
The smart contract prevents multiple claims within 24 hours.

3. Automated Evaluation Interface
Verification of the window.__EVAL__ object for grading.

## 🛠 Docker Deployment
To run this project locally:

Clone the repository.

Create a .env file in the root directory using .env.example.

Build and run the container:

Bash

docker-compose up --build -d
Access the app at http://localhost:3000.

Check health status at http://localhost:3000/health.

## 🧪 Evaluation Commands
Open the browser console (F12) to run:

window.__EVAL__.getContractAddresses() - Returns deployed addresses.

window.__EVAL__.canClaim(address) - Checks cooldown status.



# 3. Push
git push origin main

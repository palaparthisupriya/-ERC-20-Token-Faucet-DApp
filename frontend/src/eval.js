import { ethers } from "ethers";

const FAUCET_ABI = [
  "function requestTokens() external",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)"
];

export const initEval = (tokenAddr, faucetAddr) => {
  window.__EVAL__ = {
    connectWallet: async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    },
    requestTokens: async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(faucetAddr, FAUCET_ABI, signer);
      const tx = await faucet.requestTokens();
      const receipt = await tx.wait();
      return receipt.hash;
    },
    getContractAddresses: async () => {
      return { token: tokenAddr, faucet: faucetAddr };
    },
    canClaim: async (address) => {
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
      const faucet = new ethers.Contract(faucetAddr, FAUCET_ABI, provider);
      return await faucet.canClaim(address);
    }
  };
};
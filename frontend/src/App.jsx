import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { initEval } from './eval';

const TOKEN_ABI = ["function balanceOf(address) view returns (uint256)"];
const FAUCET_ABI = [
  "function requestTokens() external",
  "function canClaim(address) view returns (bool)"
];

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const TOKEN_ADDR = import.meta.env.VITE_TOKEN_ADDRESS;
  const FAUCET_ADDR = import.meta.env.VITE_FAUCET_ADDRESS;

  useEffect(() => {
    if (TOKEN_ADDR && FAUCET_ADDR) initEval(TOKEN_ADDR, FAUCET_ADDR);
  }, [TOKEN_ADDR, FAUCET_ADDR]);

  const updateData = async (addr) => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
    const token = new ethers.Contract(TOKEN_ADDR, TOKEN_ABI, provider);
    const bal = await token.balanceOf(addr);
    setBalance(ethers.formatEther(bal));
  };

  const connect = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    updateData(accounts[0]);
  };

  const claim = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucet = new ethers.Contract(FAUCET_ADDR, FAUCET_ABI, signer);
      const tx = await faucet.requestTokens();
      await tx.wait();
      updateData(account);
    } catch (err) {
      setError(err.reason || "Transaction failed. Are you in cooldown?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>FTK Token Faucet</h1>
      {!account ? (
        <button onClick={connect} style={btnStyle}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <p>Balance: {balance} FTK</p>
          <button onClick={claim} disabled={loading} style={btnStyle}>
            {loading ? "Processing..." : "Claim 10 Tokens"}
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

const btnStyle = { padding: '10px 20px', cursor: 'pointer', fontSize: '16px' };
export default App;
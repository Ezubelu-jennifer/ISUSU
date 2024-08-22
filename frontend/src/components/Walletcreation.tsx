import React, { useState } from 'react';
import { createWallet, checkBalance, fundWallet, transferTokens } from '../utils/walletFunctions';

const WalletCreation: React.FC = () => {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [transferRecipient, setTransferRecipient] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');

  const handleCreateWallet = () => {
    const newWallet = createWallet();
    setWallet(newWallet);
  };

  const handleCheckBalance = async () => {
    if (wallet) {
      const walletBalance = await checkBalance(wallet.address, 'https://enugu-rpc.assetchain.org/');
      setBalance(walletBalance);
    }
  };

  const handleFundWallet = async () => {
    if (wallet && fundAmount) {
      await fundWallet(wallet.address, fundAmount, 'https://enugu-rpc.assetchain.org/', wallet.privateKey);
      handleCheckBalance(); // Refresh balance after funding
    }
  };

  const handleTransferTokens = async () => {
    if (wallet && transferRecipient && transferAmount) {
      await transferTokens(transferRecipient, transferAmount, 'https://enugu-rpc.assetchain.org/', wallet.privateKey);
      handleCheckBalance(); // Refresh balance after transfer
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Create a New Wallet</h1>
        <button
          onClick={handleCreateWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Wallet
        </button>

        {wallet && (
          <div className="mt-6">
            <h2 className="text-2xl mb-2">Wallet Details</h2>
            <div>
              <strong>Address:</strong>
              <p>{wallet.address}</p>
            </div>
            <div className="mt-2">
              <strong>Private Key:</strong>
              <p>{wallet.privateKey}</p>
            </div>
          </div>
        )}

        {wallet && (
          <div className="mt-6">
            <button
              onClick={handleCheckBalance}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Check Balance
            </button>
            {balance && (
              <div className="mt-2">
                <strong>Balance:</strong>
                <p>{balance} ETH (or RWA)</p>
              </div>
            )}
          </div>
        )}

        {wallet && (
          <div className="mt-6">
            <h2 className="text-2xl mb-2">Fund Wallet</h2>
            <input
              type="text"
              placeholder="Amount to fund"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="border px-4 py-2 rounded"
            />
            <button
              onClick={handleFundWallet}
              className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
            >
              Fund Wallet
            </button>
          </div>
        )}

        {wallet && (
          <div className="mt-6">
            <h2 className="text-2xl mb-2">Transfer Tokens</h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              className="border px-4 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Amount to transfer"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="border px-4 py-2 rounded ml-2"
            />
            <button
              onClick={handleTransferTokens}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Transfer Tokens
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCreation;
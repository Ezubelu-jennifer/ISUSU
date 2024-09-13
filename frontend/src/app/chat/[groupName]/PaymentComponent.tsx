// PaymentComponent.tsx
import React, { useState } from 'react';
import { BrowserProvider, parseEther } from 'ethers';

interface PaymentComponentProps {
  groupWalletAddress: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ groupWalletAddress }) => {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleSendPayment = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: groupWalletAddress,
        value: parseEther(amount), // Updated to use `parseEther` in ethers v6
      });
      await tx.wait();
      alert('Payment sent successfully!');
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Check the console for details.');
    }
  };

 

  return (
    <div>
      <h3>Group Wallet Address: {groupWalletAddress}</h3>
      <input
        type="text"
        placeholder="Amount in Ether"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSendPayment}>Send Payment to Group Wallet</button>

      
    </div>
  );
};

export default PaymentComponent;

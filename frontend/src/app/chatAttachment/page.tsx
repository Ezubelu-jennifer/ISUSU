// src/app/wallet-addresses/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const WalletAddresses: React.FC = () => {
 const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
 const router = useRouter();

  useEffect(() => {
    // Retrieve the wallet addresses from localStorage
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      const addresses: string[] = groups.flatMap((group: any) =>
        group.members ? group.members.map((member: any) => member.walletAddress) : []
      );
      setWalletAddresses(addresses);
    }
  }, []);

  const handleSelectAddress = (address: string) => {
 // Save the selected wallet address to local storage
 localStorage.setItem('selectedWalletAddress', address);
  };
    
 
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4 text-center">Registered Wallet Addresses</h1>
      {walletAddresses.length > 0 ? (
        <ul className="list-disc list-inside">
          {walletAddresses.map((address, index) => (
            <li 
            key={index} 
            className="text-lg cursor-pointer hover:bg-gray-200 p-2"
            onClick={() => handleSelectAddress(address)}
            >
               {address}  
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg">No registered wallet addresses found.</p>
      )}
    </div>
  );
};

export default WalletAddresses;

"use client";

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/navigation';

// Function to escape special characters in a string for use in a regex pattern
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

const CreateWallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [combinedKey, setCombinedKey] = useState('');
  const [groupName, setGroupName] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get the group name dynamically
    const { pathname } = window.location;
    const match = pathname.match(/\/CreateAccount\/([^/]+)$/);
    if (match) {
      setGroupName(decodeURIComponent(match[1]));
    }
  },[]);
    
    useEffect(() =>{
     if(groupName){
      // Retrieve the stored groups and find the current group
      const storedGroups = localStorage.getItem('groups');
     if (storedGroups && groupName) {
      const groups = JSON.parse(storedGroups);
      const group = groups.find((group: any) => group.groupName === groupName);

      if (group && group.secretKeys) {
        // Check if the group has reached the minimum required members
        if (group.numMembers >= group.targetMembers / 2) {
          // Combine all the secret keys
          const combinedKey = group.secretKeys.join('-');
          setCombinedKey(combinedKey);
          setIsReady(true); // Indicate that the group is ready for wallet creation
        } else {
            alert(`Group requires ${Math.ceil(group.targetMembers / 2) - group.numMembers} more members to create the wallet.`);
            router.push('/dashboard'); // Redirect to the dashboard or any other page
        }
      } else {
        alert("No secret keys found for the group.");
        router.push('/dashboard');
      }
    } else {
      console.error("Group name is not available or groups not found in local storage.");
    }

    console.log("Group name:", groupName);
    console.log("Combined key:", combinedKey);
  }

  }, [groupName, router]);

  useEffect(() => {
    if (isReady) {
      // Automatically create the wallet once the group is ready
      createWallet();
    }
  }, [isReady]);

  const createWallet = () => {
    if (!combinedKey) {
      alert("Combined key not found. Please join a group first.");
      return;
    }

    try {
      // Initialize Web3
      const web3 = new Web3();
      
      // Create a new wallet
      const account = web3.eth.accounts.create();
      console.log('Wallet created:', account);

      setWalletAddress(account.address);
      setPrivateKey(account.privateKey);

      // Save wallet address and private key to local storage
      localStorage.setItem('walletAddress', account.address);
      localStorage.setItem('privateKey', account.privateKey);

      alert(`Wallet created successfully! Address: ${account.address}`);
    } catch (error) {
      console.error("Error creating wallet:", error);
      alert("Failed to create wallet. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4 text-center">Create MetaMask Wallet for {groupName}</h1>
      {isReady ? (
         <div className="text-center">
         <p>Your Wallet Address: {walletAddress}</p>
         <p className="text-center">Well Done, Happy Group Saving</p>

         <textarea
           readOnly
           value={privateKey}
           className="w-full p-2 border border-gray-300 rounded mt-2"
           rows={6}
              />
            </div>
      
      ) : (
        <p className="text-center">Waiting for group to reach minimum members...</p>
      )}
    </div>
  );
};

export default CreateWallet;

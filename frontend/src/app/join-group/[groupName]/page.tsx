"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaWallet, FaPhone, FaKey } from 'react-icons/fa'; // Icons for better UX


const JoinGroup: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  
  const [walletAddress, setWalletAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secretKey, setSecretKey] = useState(''); // Add secret key state
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [groupName, setGroupName] = useState<string | null>(null); // Initialize groupName
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

   // Retrieve stored user information
   const userData = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
        // Extract group name from url path
        const { pathname } = window.location;
        const match = pathname.match(/\/join-group\/([^/]+)$/);
        if (match) {
          setGroupName(decodeURIComponent(match[1]));
        }
      }, []);

      const validateInputs = () => {
        if (!walletAddress || !phoneNumber || !secretKey) {
          setErrorMessage('All fields are required.');
          return false;
        }
        return true;
      }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
   // const member = {
    //  walletAddress,
    //  phoneNumber,
    //  secretKey // Store secretKey for later login
    //};

    if (!validateInputs()) return;

    if (!groupName) {
      console.error("Group name is not available.");
      return;
    }

    const formData = {
      groupName,
      walletAddress,
      phoneNumber,
      secretKey
    };
     // Combine the user data with the group data
    const member = {
    ...userData, // contains fullName, username, email, etc.
    ...formData, // contains groupName, walletAddress, phoneNumber, secretKey
    };
    
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);

      const updatedGroups = groups.map((group: any) => {
      if (group.groupName === groupName) {
           const updatedNumMembers = group.numMembers + 1;
          const isFull = updatedNumMembers >= group.targetMembers;

          const updatedGroup = {
            ...group,
            numMembers: updatedNumMembers,
            joinable: !isFull,
            members: group.members ? [...group.members, member] : [member],
            secretKeys: group.secretKeys ? [...group.secretKeys, secretKey] : [secretKey],
          };

          // Check if minimum members are reached and navigate to the wallet creation page
        //  if (updatedNumMembers <= group.targetMembers/2) {
           // router.push(`/CreateAccount/${groupName}`);
        
           return updatedGroup;
          }

        return group;
      });

      localStorage.setItem('groups', JSON.stringify(updatedGroups));
     localStorage.setItem('Member',JSON.stringify(member));
      

  // Clear form fields if needed
  
    setWalletAddress('');
    setPhoneNumber('');
    setSecretKey('');
    setPhoneNumber('')
      
    
      // Find the updated group to check for wallet creation
    const updatedGroup = updatedGroups.find((group: any) => group.groupName === groupName);

    if (updatedGroup && updatedGroup.numMembers >= updatedGroup.targetMembers / 2) {
      // Navigate to the wallet creation page
      router.push(`/CreateAccount/${groupName}`);
    }

    }
    // Log submitted details
    console.log("Submitted details:", formData);



  // Set success message
  setSuccessMessage('Successfully joined the group!');

  setTimeout(() => setSuccessMessage(''), 5000);

  };

  return (
    <div className="container mx-auto p-6">
    <div className="bg-white rounded shadow-md p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Join {groupName ? groupName : 'a Group'}
      </h1>
      <p className="text-gray-600 mb-6 text-center">
          Provide your details to join the group and become a member. Make sure to enter the correct information.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Wallet Address Input */}
          <div className="mb-5">
            <label htmlFor="walletAddress" className="block text-lg font-medium mb-2">
              <FaWallet className="inline mr-2" /> Wallet Address
            </label>
            <input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

        {/* Phone Number Input */}
        <div className="mb-5">
            <label htmlFor="phoneNumber" className="block text-lg font-medium mb-2">
              <FaPhone className="inline mr-2" /> Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>


         {/* Secret Key Input */}
         <div className="mb-5">
            <label htmlFor="secretKey" className="block text-lg font-medium mb-2">
              <FaKey className="inline mr-2" /> Secret Key
            </label>
            <input
              id="secretKey"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

        {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200"
          >
            Join Group
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-5 p-4 bg-green-100 text-green-800 rounded text-center">
            {successMessage}
          </div>
        )}
        {/* Error Message */}
         {errorMessage && (
          <div className="mt-5 p-4 bg-red-100 text-red-800 rounded text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
export default JoinGroup;

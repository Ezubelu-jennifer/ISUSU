"use client";

import React, { useState } from 'react';

const CreateGroup: React.FC<{ saveGroup?: (group: any, secretKeys: string[]) => void }> = ({ saveGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [targetMembers, setTargetMembers] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('Naira'); // Default currency set to Naira
  const [joinable, setJoinable] = useState(true); // Default to joinable
  const [walletAddress, setWalletAddress] = useState(''); // Add wallet address state
  const [secretKeys, setSecretKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Create the member object for the group creator
    const creatorMember = {
      fullName: 'Group Creator', // Or any placeholder name
      walletAddress,
      secretKeys,
    };

    const newGroup = { groupName, targetMembers, phoneNumber, currency, joinable, numMembers: 1,  members: [creatorMember], }; // Initialize numMembers
    
    const storedGroups = localStorage.getItem('groups');
    const groups = storedGroups ? JSON.parse(storedGroups) : [];
    localStorage.setItem('groups', JSON.stringify([...groups, newGroup]));

    if (saveGroup) saveGroup(newGroup, secretKeys);

    setGroupName('');
    setTargetMembers('');
    setPhoneNumber('');
    setCurrency('Naira');
    setJoinable(true);
    setWalletAddress(''); // Clear wallet address field

    setSecretKeys([]);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
        Create a New Group
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div className="form-group">
            <label
              htmlFor="groupName"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Enter Group Name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Target Number of Members */}
          <div className="form-group">
            <label
              htmlFor="targetMembers"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Target Number of Members
            </label>
            <input
              id="targetMembers"
              type="number"
              value={targetMembers}
              onChange={(e) => setTargetMembers(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        
          {/* Currency Selection */}
          <div className="form-group">
            <label
              htmlFor="currency"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Select Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Naira">Naira</option>
              <option value="USDT">USDT</option>
              <option value="RWA">RWA</option>
            </select>
          </div>
        
        
        {/* Wallet Address */}
         <div className="form-group">
            <label
              htmlFor="walletAddress"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Wallet Address
            </label>
            <input
              id="walletAddress"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

           {/* Joinable Option */}
           <div className="form-group flex items-center">
            <input
              id="joinable"
              type="checkbox"
              checked={joinable}
              onChange={(e) => setJoinable(e.target.checked)}
              className="mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="joinable"
              className="text-lg font-medium text-gray-600"
            >
              Allow new members to join
            </label>
          </div>

         {/* Secret Keys */}
         <div className="form-group">
            <label
              htmlFor="secretKeys"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Secret Keys (for members only)
            </label>
            <textarea
              id="secretKeys"
              value={secretKeys.join("\n")}
              onChange={(e) => setSecretKeys(e.target.value.split("\n"))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter secret keys, one per line"
            />
          </div>

           {/* Submit Button */}
           <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateGroup;

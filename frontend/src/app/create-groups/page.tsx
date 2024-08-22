"use client"; 

import React, { useState } from 'react';

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [numMembers, setNumMembers] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState('Naira'); // Default currency set to Naira

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Group Name:', groupName);
    console.log('Number of Members:', numMembers);
    console.log('Phone Number:', phoneNumber);
    console.log('Selected Currency:', currency);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl mb-4">Create a New Group</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-lg font-medium mb-2">
              Enter Group Name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="numMembers" className="block text-lg font-medium mb-2">
              Number of Members
            </label>
            <input
              id="numMembers"
              type="number"
              value={numMembers}
              onChange={(e) => setNumMembers(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-lg font-medium mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="currency" className="block text-lg font-medium mb-2">
              Select Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Naira">Naira</option>
              <option value="USDT">USDT</option>
              <option value="RWA">RWA</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
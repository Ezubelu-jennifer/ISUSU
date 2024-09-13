"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';


const Settings: React.FC = () => {
  const [selectedVotingType, setSelectedVotingType] = useState<'normal' | 'weighted'>('normal');
  const router = useRouter();

  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [secretKey, setSecretKey] = useState('');
  const [password, setPassword] = useState('');

  const handleVotingTypeChange = (type: 'normal' | 'weighted') => {
    setSelectedVotingType(type);
    // Save the selectedVotingType in local storage
    localStorage.setItem('votingType', type);

     // Optionally, navigate to chat page or update state in a global context
    // router.push('/chat/[groupName]'); // Example for navigation
  };

  const handleSave = () => {
    // Logic to save the settings goes here
    console.log({
      selectedVotingType,
      startTime,
      endTime,
      secretKey,
      password,
    });
    alert('Settings saved successfully!');
  };
  const handleSubmit = () => {
    localStorage.setItem('votingStartTime', startTime);
    localStorage.setItem('votingEndTime', endTime);
    //router.push('/chat'); // Navigate to chat page
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Settings</h2>
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto space-y-8">
        
       {/* Voting Type Selection */}
       <div className="border-b pb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Voting Type</h3>
          <div className="flex gap-4">
            <button
              onClick={() => handleVotingTypeChange('normal')}
              className={`px-6 py-3 rounded-lg font-medium ${
                selectedVotingType === 'normal'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
          Normal Voting
          </button>
          <button
        
          onClick={() => handleVotingTypeChange('weighted')}
          className={`px-6 py-3 rounded-lg font-medium ${
          selectedVotingType === 'weighted'
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-200 text-gray-800'
          }`}
         >
           Weighted Voting
            </button>
          </div>
        </div>

      
 {/* Voting Time */}
 <div className="border-b pb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Voting Time</h3>
          <label className="block text-gray-700 mb-2 font-medium">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <label className="block text-gray-700 mb-2 font-medium">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
            <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Start Voting
          </button>
        </div>


         {/* Change Secret Key */}
         <div className="border-b pb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Change Secret Key</h3>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter new secret key"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

       {/* Change Password */}
       <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>
        
          {/* Save Button */}
           <div>
          <button
            onClick={handleSave}
            className="mt-6 w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

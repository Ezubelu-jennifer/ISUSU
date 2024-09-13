"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UpdatePassword: React.FC = () => {
  const [combinedKey, setCombinedKey] = useState('');
  const [groupName, setGroupName] = useState<string | null>(null);

  useEffect(() => {
    const { pathname } = window.location;
    const match = pathname.match(/\/update-password\/([^/]+)$/);
    if (match) {
      setGroupName(decodeURIComponent(match[1]));
    }

    const storedGroups = localStorage.getItem('groups');
    if (storedGroups && groupName) {
      const groups = JSON.parse(storedGroups);
      const group = groups.find((group: any) => group.groupName === groupName);

      if (group && group.secretKeys) {
        const combinedKey = group.secretKeys.join('-');
        setCombinedKey(combinedKey);
      } else {
        alert("No secret keys found for the group.");
      }
    }
  }, [groupName]);

  const updatePassword = async () => {
    try {
      if (!combinedKey) {
        alert("Combined key not found. Please provide secret keys.");
        return;
      }

      // Here you would implement the logic to update the password
      // by combining the new set of secret keys.
      // For example:
      // const wallet = ethers.Wallet.fromPhrase(combinedKey);
      // await wallet.encrypt(combinedKey);

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4 text-center">Update Group Password for {groupName || 'Group'}</h1>
      <div className="text-center">
        <button
          onClick={updatePassword}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;

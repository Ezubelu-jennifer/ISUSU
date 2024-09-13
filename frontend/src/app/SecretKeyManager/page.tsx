"use client";

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';


interface SecretKeyManagerProps {
  groupName: string;
}

const SecretKeyManager: React.FC<SecretKeyManagerProps> = ({ groupName }) => {
  const [allKeysSubmitted, setAllKeysSubmitted] = useState(false);
  const [totalMembersCount, setTotalMembersCount] = useState(0); // You may still want to track total members from a central source
  const [submittedKeysCount, setSubmittedKeysCount] = useState(0); // Track submitted keys count

  const [secretKey, setSecretKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [memberSubmitted, setMemberSubmitted] = useState(false);

  // Retrieve secret key from local storage on component mount
  useEffect(() => {
    const storedSecretKey = localStorage.getItem(`secretKey_${groupName}`); // Unique key for each group
    if (storedSecretKey) {
      setSecretKey(storedSecretKey);
      setMemberSubmitted(true); // Assume member has submitted if the key exists in local storage
    }
  }, [groupName]);

  // Retrieve private key from local storage
  useEffect(() => {
    const storedPrivateKey = localStorage.getItem('privateKey');
    setPrivateKey(storedPrivateKey || '');
  }, []);

  // Handle secret key input and submission
  const handleSecretKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretKey(e.target.value);
  };

  const handleSecretKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey) {
      alert('Please enter a secret key.');
      return;
    }

    // Save secret key to local storage
    localStorage.setItem(`secretKey_${groupName}`, secretKey); // Store secret key with group-specific key
    alert('Secret key submitted successfully!');
    setMemberSubmitted(true); // Indicate that the member has submitted their key
  };

  const viewPrivateKey = () => {
    if (allKeysSubmitted && privateKey) {
      alert(`Your Private Key is: ${privateKey}`);
    } else {
      alert('No private key found. Please ensure it is set correctly.');
    }
  };

  return (
     <div className="p-6 bg-white rounded shadow-md">
      {/* Secret Key Submission UI */}
      {allKeysSubmitted ? (
        <div>
          <p>All keys have been submitted!</p>
          <button onClick={viewPrivateKey} className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Private Key
          </button>
        </div>
      ) : (
        <div>
        <p>Waiting for members to submit their keys... ({submittedKeysCount}/{totalMembersCount})</p>
        {!memberSubmitted && (
          <form onSubmit={handleSecretKeySubmit} className="mt-4">
            <input
              type="text"
              placeholder="Enter your secret key"
              value={secretKey}
              onChange={handleSecretKeyChange}
              className="border border-gray-300 rounded p-2 mt-2"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit Secret Key
            </button>
          </form>
          )}
        {memberSubmitted && <p className="text-green-600 mt-4">Your key has already been submitted.</p>}
        </div>
      )}
    </div>
  );
};

export default SecretKeyManager;

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTrash, FaEye, FaUserPlus, FaLock } from 'react-icons/fa'; // Import icons for better UX


interface Member {
  fullName: string;
  email: string;
  walletAddress: string;
  phoneNumber: string;
};

interface Group {
  groupName: string;
  targetMembers: number;
  numMembers: number;
  phoneNumber: string;
  currency: string;
  joinable: boolean;
  walletCreated: boolean;
  members?: Member[]; // Ensure that members is part of the group type
};

const Groups: React.FC = () => {
  //const [groups, setGroups] = useState<Array<{ groupName: string; targetMembers: number; numMembers: number; phoneNumber: string; currency: string; joinable: boolean; walletCreated: boolean }>>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  //const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
     // Function to fetch groups from localStorage
     const fetchGroups = () => {
      const storedGroups = localStorage.getItem('groups');
      //console.log('Stored Groups:', storedGroups);
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups);
        console.log('Fetched Groups:', parsedGroups); // Debug log
        setGroups(parsedGroups);
      }
    };

    fetchGroups();


    // Set an interval to periodically check for updates
    const intervalId = setInterval(fetchGroups, 5000); // Update every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const canJoinGroup = (group: Group) => {
    return group.joinable && group.numMembers < group.targetMembers;
  };


  const handleDeleteGroup = (groupName: string) => {
    const updatedGroups = groups.filter(group => group.groupName !== groupName);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setGroups(updatedGroups);
  };

 // const getGroupDetails = (groupName: string): Member[] => {
   // const group = groups.find(g => g.groupName === groupName);
   // return group?.members || [];
  //};
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
    <div className="container mx-auto p-6">
    <h1 className="text-4xl font-bold mb-6 text-center">Groups</h1>

    {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{group.groupName}</h2>
              <p className="text-gray-700 mb-2">
                Members: {group.numMembers}/{group.targetMembers}
              </p>
              <p className="text-gray-700 mb-2">Phone: {group.phoneNumber}</p>
              <p className="text-gray-700 mb-4">Currency: {group.currency}</p>

              <div className="flex flex-wrap gap-3">
                {canJoinGroup(group) ? (
                  <Link href={`/join-group/${group.groupName}`} passHref>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
                      <FaUserPlus className="mr-2" /> Join Group
                    </button>
                  </Link>
                ) : (

                 <button
                    className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
                    disabled
                  >
                    <FaLock className="mr-2" />
                    {group.numMembers >= group.targetMembers ? 'Group Full' : 'Join Group'}
                  </button>
                )}
                {group.members && group.members.length > 0 && (
                  <Link href={`/group-details/${group.groupName}`} passHref>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
                      <FaEye className="mr-2" /> View Details
                    </button>
                  </Link>
                )}

                 <button
                  onClick={() => handleDeleteGroup(group.groupName)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete Group
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No groups available. Please create a group first.</p>
      )}
    </div>
    </div>
    </div>
  );
};

export default Groups;

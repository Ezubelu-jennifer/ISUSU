"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Member {
  fullName: string;
  walletAddress: string;
  phoneNumber: string;
}

interface Group {
  groupName: string;
  targetMembers: number;
  numMembers: number;
  phoneNumber: string;
  currency: string;
  joinable: boolean;
  walletCreated: boolean;
  members?: Member[];
}

const GroupDetailsPage = () => {
  const params = useParams();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state


  useEffect(() => {
    const groupName = params.groupName;
    console.log('Group Name from Params:', groupName);

    if (typeof groupName === 'string') {
      try {
         // Decode the groupName parameter
         const decodedGroupName = decodeURIComponent(groupName).trim().toLowerCase();
         console.log('Decoded Group Name:', decodedGroupName);

         const storedGroups = localStorage.getItem('groups');
         
        if (storedGroups) {
          const groups: Group[] = JSON.parse(storedGroups);
          console.log('Stored Groups:', groups); // Debugging log

          // Log all group names for comparison
           groups.forEach(group => {
            console.log('Group Name in Data:', group.groupName);
          });
         // Perform the comparison with the decoded groupName
         const foundGroup = groups.find(
         (g) => g.groupName.trim().toLowerCase() === decodedGroupName
         );
          console.log('Found Group:', foundGroup); // Debugging log
         setGroup(foundGroup || null);

        } else {
          console.warn('No groups found in localStorage.');
        }
      } catch (error) {
        console.error('Error parsing groups from localStorage:', error);
      }
    }
    else {
        console.error('Invalid groupName:', groupName);
      }
      setLoading(false); // Set loading to false after fetching data

    }, [params.groupName]);

    if (loading) {
      return (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold text-center">Loading...</h2>
        </div>
      );
    }

  if (!group) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-center">Group not found.</h2>
        <p className="text-center mt-4">
          The group you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-6 text-center">Details for {group.groupName}</h1>
      <div className="mb-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Property</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Target Members</td>
              <td className="border border-gray-300 px-4 py-2">{group.targetMembers}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Current Members</td>
              <td className="border border-gray-300 px-4 py-2">{group.numMembers}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Phone Number</td>
              <td className="border border-gray-300 px-4 py-2">{group.phoneNumber}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Currency</td>
              <td className="border border-gray-300 px-4 py-2">{group.currency}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Joinable</td>
              <td className="border border-gray-300 px-4 py-2">{group.joinable ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Wallet Created</td>
              <td className="border border-gray-300 px-4 py-2">{group.walletCreated ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-3xl mb-4">Members</h2>
      {group.members && group.members.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Wallet Address</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {group.members.map((member, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{member.fullName}</td>
                <td className="border border-gray-300 px-4 py-2">{member.walletAddress}</td>
                <td className="border border-gray-300 px-4 py-2">{member.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">No members in this group.</p>
      )}
    </div>
    </div>
    </div>
  );
};

export default GroupDetailsPage;

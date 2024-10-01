"use client";

import { useEffect, useState,useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";


interface Group {
    groupName: string;
    targetMembers: number;
    numMembers: number;
    phoneNumber: string;
    currency: string;
    joinable: boolean;
    walletCreated: boolean;
    members?: any[]; // Simplified for illustration
  }


const MemberDetails: React.FC = () => {
    const [member, setMember] = useState<any | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);

    const router = useRouter();
    const searchParams = useSearchParams();

    const [increment, setIncrement] = useState<number>(1);
    const votingPower = searchParams.get('calculatedRatio');

    const increments = [
      { max: 10, increment: 1 },
      { max: 20, increment: 2 },
      { max: 30, increment: 3 },
      { max: 40, increment: 4 },
      { max: 50, increment: 5 },
      { max: 60, increment: 6 },
      { max: 70, increment: 7 },
      { max: 80, increment: 8 },
      { max: 90, increment: 9 },
      { max: 100, increment: 10 },
      { max: Infinity, increment: 1 } // Default increment if none of the above conditions are met
    ];
   

    useEffect(() => {
      console.log('Voting Power:', votingPower);
      if (votingPower) {
        const ratio = parseFloat(votingPower);

        const foundIncrement = increments.find(range => ratio <= range.max)?.increment || 1;
        console.log('Calculated Increment:', foundIncrement);

      setIncrement(foundIncrement);
      localStorage.setItem('foundIncrement', foundIncrement.toString()); // Store in local storage

    }
  }, [votingPower]);

  

   useEffect(() => {
    const authenticatedMember = localStorage.getItem('authenticatedMember');

    if (authenticatedMember ) {
      const memberData = JSON.parse(localStorage.getItem("Member") || "{}");
      setMember(memberData);

      // const storedGroups = localStorage.getItem('groups');
        const storedGroups = localStorage.getItem("authenticatedGroups");
      if (storedGroups) {
        const allGroups: Group[] = JSON.parse(storedGroups);
        const memberGroups = allGroups.filter(group => group.members?.some(mem => mem.email === memberData.email));
        setGroups(memberGroups);
      }
    } else {
      router.push('/login'); // Redirect to login if no authenticated member
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authenticatedMember');
    localStorage.removeItem("authenticatedGroups");
    //localStorage.removeItem("authenticatedGroups");

    router.push('/login'); // Redirect to login page
  };


  const handleGroupClick = (groupName: string) => {
    router.push(`/chat/${encodeURIComponent(groupName)}`); // Navigate to the chat page
};

 
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
     {/* Header with Member Details and Logout Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Member Details</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>

      {member ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Full Name:</strong> {member.fullName}</p>
              <p><strong>Username:</strong> {member.username}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Address:</strong> {member.address}</p>
              <p><strong>Wallet Address:</strong> {member.walletAddress}</p>
              <p><strong>Phone Number:</strong> {member.phoneNumber}</p>
            </div>
           

            <h2 className="text-2xl font-bold mt-8 text-green-600">Groups</h2>
            {groups.length > 0 ? (
              <ul className="list-disc list-inside mt-4">
                {groups.map((group, index) => (
                  <li key={index} className="my-2">
                    <button
                      onClick={() => handleGroupClick(group.groupName)}
                      className="text-green-500 underline hover:text-blue-700"
                    >
                      {group.groupName}
                    </button>
                  </li>
                ))}
              </ul>
          ) : (
            <p className="mt-4 text-gray-600">No groups found.</p>
          )}

          <h2 className="text-2xl font-bold mt-8 text-green-600">Member Voting Power</h2>
          <p><strong>Ratio:</strong> {votingPower}</p>
          <p><strong>Voting Increment:</strong> {increment}</p>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading...</p>
      )}
    </div>
  </div>
);
};

export default MemberDetails;

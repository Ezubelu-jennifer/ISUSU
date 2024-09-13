"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = () => {
   // const authenticatedEmail = localStorage.getItem('authenticatedEmail');
    const storedGroups = localStorage.getItem('groups');

    if ( storedGroups) {
      const groups = JSON.parse(storedGroups);

        // Find member using phone number and secret key
      //const member = groups.flatMap((group: any) => group.members || []).find((member: any) =>  member.phoneNumber === phoneNumber && member.secretKey === secretKey);

      
      // Find member using phone number and secret key
      const memberGroups = groups.filter((group: any) =>
        group.members.some((member: any) => member.phoneNumber === phoneNumber && member.secretKey === secretKey)
      );

      //if (member) {
        // Login successful
        //localStorage.setItem('authenticatedMember', JSON.stringify(member));
       
        if (memberGroups.length > 0) {
          // Store only the groups the user is involved with
          localStorage.setItem('authenticatedGroups', JSON.stringify(memberGroups));
  
          // Store the authenticated member details
          const member = memberGroups[0].members.find((m: any) => m.phoneNumber === phoneNumber && m.secretKey === secretKey);
          localStorage.setItem('authenticatedMember', JSON.stringify(member));

        router.push('/member-details');
      } else {
        setError("Invalid email or secret key.");
      }
    } else {
      setError("No groups found.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Member Login</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2" htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
        />
        </div>
       <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="secretKey">Secret Key</label>
          <input
            type="text"
            id="secretKey"
            placeholder="Enter your secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
          />
        </div>

         <button
          onClick={handleLogin}
          className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg w-full hover:bg-blue-700 transition-colors duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

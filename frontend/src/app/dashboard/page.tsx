"use client";

import React from 'react';
import Link from 'next/link';
import { FaPlusCircle, FaUsers, FaCogs, FaUserFriends } from 'react-icons/fa';
import styles from './Dashboard.module.css';

//const Dashboard: React.FC = () => {
const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {

  const isAuthenticated = localStorage.getItem('authenticatedMember');
  return (
    <div className="relative min-h-screen bg-gray-800">
      {/* Background Image */}
      <div
        className={`absolute inset-0 bg-white ${styles.animateMoveBg}`}

        //className={`absolute inset-0 bg-cover bg-center ${styles.animateMoveBg}`}
       // style={{ backgroundImage: "url('')" }} // Make sure to use the correct path
      ></div>

       {/* Logout Button on the Right */}
       <Link href="/" passHref>
       <button
       className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 ease-in-out text-lg"
       onClick={onLogout}

      >
      Logout
      </button>
      </Link>


      {/* Main Dashboard Content */}
      <div className="relative z-10 p-6 text-white flex flex-col items-center justify-center h-full">
      
         {/* 2x2 Grid for Dashboard Options */}
         <div className="grid grid-cols-2 gap-16 w-full max-w-2xl">
          {/* Create Group */}
          <div className="p-8 bg-transparent  rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <Link href="/create-groups" className="flex flex-col items-center text-center">
            <FaPlusCircle className={`text-7xl text-blue-400 mb-4 `} />
            <span className="text-2xl font-semibold text-black">Create Group</span>
            </Link>
          </div>

          {/* Join Group */}
          <div className="p-8 bg-transparent rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <Link href="/groups" className="flex flex-col items-center text-center">
            <FaUsers className={`text-7xl text-green-400 mb-4 `} />
            <span className="text-2xl font-semibold text-black">Join Group</span>
            </Link>
          </div>

           {/* Members Section */}
           <div className="p-8 bg-transparent rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <Link href="/member-details" className="flex flex-col items-center text-center">
            <FaUserFriends className={`text-7xl text-purple-400 mb-4 `} />
            <span className="text-2xl font-semibold text-black">Members</span>
            </Link>
          </div>

          {/* Settings */}
          <div className="p-8 bg-transparent rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out transform hover:scale-105">
            <Link href="/settings" className="flex flex-col items-center text-center">
            <FaCogs className={`text-7xl text-yellow-400 mb-4 `} />
            <span className="text-2xl font-semibold text-black">Settings</span>
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

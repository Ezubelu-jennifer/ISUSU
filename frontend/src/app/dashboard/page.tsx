import React from 'react';
import Link from 'next/link';
import { FaUserFriends, FaUsers, FaMoneyBillWave, FaHistory, FaCogs, FaPlusCircle, FaHandHoldingUsd } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/create-group">
            <FaPlusCircle className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Create Group</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/add-members">
            <FaUserFriends className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Add Members</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/disburse">
            <FaHandHoldingUsd className="text-6xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Disburse</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/members">
            <FaUsers className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Members</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/make-payment">
            <FaMoneyBillWave className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Make Payment</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/payment-history">
            <FaHistory className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Payment History</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/settings">
            <FaCogs className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Settings</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4">
          <Link href="/groups">
            <FaUsers className="text-7xl text-blue-600 cursor-pointer" />
          </Link>
          <span className="mt-9">Groups</span>
        </div>
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4"></div> {/* Empty cell */}
      </div>
    </div>
  );
};

export default Dashboard;
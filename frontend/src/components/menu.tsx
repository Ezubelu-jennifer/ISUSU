import React, { useState } from 'react';
import VoteHistory from './VoteHistory'; // Ensure this path is correct

const Menu: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'viewHistory' | 'contribution' | null>(null);
  const [amount, setAmount] = useState<string>('');

  const handleMenuClick = (option: 'viewHistory' | 'contribution') => {
    setSelectedOption(option);
  };

  const handleContribution = () => {
    // Handle the contribution logic here
    console.log(`Contributing ${amount} ETH`);
    // You would integrate your MetaMask and transaction logic here
  };

  return (
    <div>
      <div className="menu">
        <button onClick={() => handleMenuClick('viewHistory')} className="menu-button">
          View History
        </button>
        <button onClick={() => handleMenuClick('contribution')} className="menu-button">
          Contribution
        </button>
      </div>

      <div className="content">
        {selectedOption === 'viewHistory' && <VoteHistory userId="yourUserId" groupName="" />} {/* Replace "yourUserId" */}
        {selectedOption === 'contribution' && (
          <div className="contribution-box">
            <h2>Make a Contribution</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in ETH"
              className="amount-input"
            />
            <button onClick={handleContribution} className="contribute-button">
              Contribute
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .menu {
          display: flex;
          justify-content: space-around;
          background: #f0f0f0;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        .menu-button {
          background-color: #0070f3;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .menu-button:hover {
          background-color: #005bb5;
        }

        .content {
          padding: 20px;
        }

        .contribution-box {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .amount-input {
          padding: 10px;
          font-size: 16px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .contribute-button {
          background-color: #28a745;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .contribute-button:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
};

export default Menu;

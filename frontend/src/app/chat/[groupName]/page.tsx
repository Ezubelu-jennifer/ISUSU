"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { collection, doc, onSnapshot, addDoc, orderBy, query, serverTimestamp, updateDoc, increment} from 'firebase/firestore';
import { firestore,storage } from '@/firebase/firebaseConfig';
import VoteHistory from '@/components/VoteHistory'; // Ensure the path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BrowserProvider, ethers, parseEther } from 'ethers';

import { useRouter, usePathname,useSearchParams } from 'next/navigation';
import { FaBars, FaCog, FaHistory, FaMoneyBill, FaUserCircle } from 'react-icons/fa'; // Import icons from react-icons library

// to interact with smart contract

import { createPublicClient, createWalletClient, http, custom, getContract } from "viem";
import { useAccount } from "wagmi";
import { assetchain_testnet } from "@/utils/assetchainTestnetChain";
import deployedContracts from "@/contracts/deployedContracts";

interface Message {
 id?: string; // Optional for when retrieving
  text: string;
  imageUrl?: string; // New field for image URL
  userId: string;
  timestamp: any; // Use `any` or a specific type depending on how you handle timestamps
  votesFor: number;
  votesAgainst: number;
  winner?: 'for' | 'against';
}


interface ChatProps {
    params: {
      groupName: string;
      
    };
  }

  
  const getUserPhoneNumber = () => {
    const userData = localStorage.getItem('authenticatedMember');
    if (userData) {
      const { phoneNumber } = JSON.parse(userData);
      return phoneNumber;
    }
    return '';
  };

  //let ratio: number = 0;
  //let increments  = 1;

  const Chat: React.FC<ChatProps> = ({ params }) => {
  const { groupName } = params; // Retrieve dynamic parameter from props
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const router = useRouter();
  const [messagew, setMessagew] = useState('');

  const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility
  const [hoveredButton, setHoveredButton] = useState<string | null>(null); // Correctly typed as 'string | null'


  const [imageFile, setImageFile] = useState<File | null>(null); // State to store selected image

  //wallet address
  
  const walletAddress = localStorage.getItem('walletAddress')|| '';
  const groupWalletAddress = walletAddress; 
  const safeGroupWalletAddress = groupWalletAddress ?? ''; // Provide an empty string if null
  const [status, setStatus] = useState<string>('');
  const walletKey = localStorage.getItem('privateKey')|| '';
  const key = walletKey;

  //state management
  const [transactionHash, setTransactionHash] = useState<string>("");
  const { address: account } = useAccount();
  const [balance, setBalance] = useState<string | null>(null);
  const [showAccountInput, setShowAccountInput] = useState(false);
  
//chat group settling parameters
const [isusuType, setIsusuType] = useState<'normal' | 'purpose'>('normal');// State to manage Isusu Type
const [isusuDuration, setIsusuDuration] = useState<'weekly'|'monthly'|'annually'|'yearly'>('monthly'); // State to manage Isusu Duration

  const [amount, setAmount] = useState('');
  const userId = getUserPhoneNumber();
  const [selectedOption, setSelectedOption] = useState<'viewHistory' | 'contribution' | 'groupAccount' |'Settings'|null>(null);

  const [selectedVotingType, setSelectedVotingType] = useState<'normal' | 'weighted'>('normal');
 //votingStartTime  time parameters

 const [timeLeft, setTimeLeft] = useState<number>(0);
 const [timeLefts, setTimeLefts] = useState<number>(0);
  
 const publicClient = createPublicClient({
  chain: assetchain_testnet,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: assetchain_testnet,
  transport: custom(window.ethereum!),
});

const contract = getContract({
  address: deployedContracts.assetchain_testnet.address as `0x${string}`,
  abi: deployedContracts.assetchain_testnet.abi,
  client: publicClient,
});

//use effect for isusuduartions 

useEffect(() => {
  const calculateEndTime = () => {
    const now = new Date();
    let endTime = new Date(now);
    switch (isusuDuration) {
      case 'weekly':
        endTime.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        endTime.setMonth(now.getMonth() + 1);
        break;
      case 'annually':
      case 'yearly':
        endTime.setFullYear(now.getFullYear() + 1);
        break;
      default:
        endTime.setMonth(now.getMonth() + 1);
        break;
    }
    return endTime;
  };

  const endTime = calculateEndTime().getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      clearInterval(interval);
      setTimeLefts(0);
    } else {
      setTimeLefts(distance);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [isusuDuration]);

const formatTimeDay = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};



 //use effect for vote type selection from local storage
 useEffect(() => {
  const savedVotingType = localStorage.getItem('votingType') as 'normal' | 'weighted';
  if (savedVotingType) {
    setSelectedVotingType(savedVotingType);
  }
}, []);

//Handle voting time countdown


useEffect(() => {
  const startTime = localStorage.getItem('votingStartTime');
  const endTime = localStorage.getItem('votingEndTime');

  if (endTime) {
    const endDate = new Date(endTime).getTime();
    const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;

    if (distance < 0) {
      clearInterval(interval);
      setTimeLeft(0);
      

    } else {
      setTimeLeft(distance);
    }
    }, 1000);

    return () => clearInterval(interval);
  }
}, []);

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const messageId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

// use effect for the actual voting time and the total vote

useEffect(() => {
  if (timeLeft === 0) {
    // Voting time has expired
    countVotes();
  }
}, [timeLeft]);

//fetch message and calculate voting result

const countVotes = async () => {

    if (!groupName ) return; //    if (!groupName || !account) return;
    try {
      const messagesRef = collection(doc(firestore, 'groups', groupName), 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));


      onSnapshot(q, snapshot => {
        const newMessages: Message[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Message, 'id'>,
        }));
        setMessages(newMessages);
      });

        //console.log('countvote newmessageid:',message);
        console.log(' newmessage:',messages);
 
    // Count votes for each message
    const results = messages.map(message => {
  return {
        id: message.id,
        votesFor: message.votesFor,
        votesAgainst: message.votesAgainst,
        winner: message.votesFor > message.votesAgainst ? 'for' : 'against'
      };
    });

  console.log('Vote results:', results);
 // Optionally, update the results in Firestore or elsewhere
 for (const result of results) {
  if (result.id) { // Ensure result.id is defined
    const messageRef = doc(firestore, 'groups', groupName, 'messages', result.id);
    await updateDoc(messageRef, { winner: result.winner });
    handleEndVoting(result.id);
  }
}

} catch (error) {
console.error('Error counting votes: ', error);
}



};


 
//wallet address use effect
useEffect(() => {
  // Check local storage for a selected wallet address
  const selectedAddress = localStorage.getItem('selectedWalletAddress');
  if (selectedAddress) {
    setMessagew(selectedAddress);
    setTransactionHash(selectedAddress);

    // Optionally, clear the selected address after it's been used
    //localStorage.removeItem('selectedWalletAddress');
   }
 }, []);



 const handleSetGroupWalletAddress = async () => {
  try {
    if (!safeGroupWalletAddress) {
      throw new Error("New wallet address is required.");
    }

    // Simulate the contract call to get the request object
    const { request } = await publicClient.simulateContract({
      address: deployedContracts.assetchain_testnet.address as `0x${string}`, // Replace with your contract address
      abi: deployedContracts.assetchain_testnet.abi,
      functionName: "updateGroupWalletAddress",
      args: [safeGroupWalletAddress],
      account,
    });

    // Write the transaction to the blockchain
    const hash = await walletClient.writeContract(request)
  // Update the status with the transaction hash
  setStatus(`Group wallet address updated successfully! Transaction Hash: ${hash}`);
  } catch (error) {
  setStatus("Failed to update group wallet address");
  console.error("Update Wallet Address error:", error);
  }
 };


const handleEndVoting = async (messageId: string) => {
  try {
    //if (!account) return;
    if (!messageId) {
      throw new Error("Message ID is required to end voting.");
    }
     console.log("selectedAddress:",messagew);
     handleSetGroupWalletAddress();

    // Simulate the contract call to get the request object
    const { request } = await publicClient.simulateContract({
      address: messagew as `0x${string}`,
      abi: deployedContracts.assetchain_testnet.abi,
      functionName: "endVoting",  // Replace this with your actual function name
      args: [messageId],          // Arguments passed to the contract function
      account,
    });

    // Write the transaction to the blockchain
    const hash = await walletClient.writeContract(request);

    // Update the status with the transaction hash
    setStatus(`Voting ended successfully! Transaction Hash: ${hash}`);
  } catch (error) {
    setStatus("Failed to end voting");
    console.error("End Voting error:", error);
  }
};


//Handle vote submission


const handleVote = async (messageId: string, voteType: 'for' | 'against') => {
  const messageRef = doc(firestore, 'groups', groupName, 'messages', messageId);
  const userVoteRef = collection(doc(firestore, 'groups', groupName), 'userVotes');

  //if (!account || !messageId) return;

  try {
  const incrementValue = localStorage.getItem('foundIncrement');

  const increments = selectedVotingType === 'weighted' && incrementValue
  ? parseFloat(incrementValue)
  : 1;

   // Prepare the contract request
   const { request } = await publicClient.simulateContract({
    address: deployedContracts.assetchain_testnet.address as `0x${string}`, // Replace with your contract address
    abi: deployedContracts.assetchain_testnet.abi, // Replace with your contract ABI
    functionName: "vote",
    args: [messageId, voteType, increments], // Pass message ID, vote type, and weight
    account, // The account making the transaction
  });

  // Update the vote count with the calculated increment

    await updateDoc(messageRef, {
      [voteType === 'for' ? 'votesFor' : 'votesAgainst']: increment(increments )
    });

    // Store vote record in the user's document
    const userVotesRef = collection(firestore, 'users', userId, 'votes');

      // Send the transaction
    const tx = await walletClient.writeContract(request);
    
    // Record the user's vote
   await addDoc(userVoteRef, {
    messageId,
    userId: getUserPhoneNumber(),
    voteType,
    incrementValue: incrementValue, // Optionally store the increment value with the vote

    timestamp: serverTimestamp()
   });
    

  } catch (error) {
    console.error('Error updating vote: ', error);
  }
};


const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  setMessageText(event.target.value);
};

 //image data manipulation

 const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
  }
};

const uploadImage = async (file: File): Promise<string> => {
const storageRef = ref(storage, file.name); // Create a reference to the file
await uploadBytes(storageRef, file); // Upload the file
return await getDownloadURL(storageRef); // Get the download URL
};


const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  if (messageText.trim() === '' && !imageFile) return;

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : ""; // Convert image to URL if available

  const newMessage: Omit<Message, 'id'> = {
    text: messageText.trim(),
    imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined, // Convert image to a URL

    userId: getUserPhoneNumber(), // Replace with actual user ID
    timestamp: serverTimestamp(),
    votesFor: 0,
    votesAgainst: 0
  };

  try {

      await addDoc(collection(doc(firestore, 'groups', groupName), 'messages'), newMessage);
      setMessageText('');
      setImageFile(null); // Clear image file
      console.log('Message created successfully!');

  } catch (error) {
    console.error('Error adding message: ', error);
  }
};


//to get the voting result

const getVoteResult = (message: Message) => {
  if (message.winner) {

    return `The winning vote is ${message.winner === 'for' ? 'For' : 'Against'}.`;
  }
  
  return 'Voting in progress.';
};


  //const handleAccountValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    //setAccountValue(event.target.value);
 // };


 
  const handleCalculateRatio = async () => {
    try {
      if (!account) return; // Ensure the user's account is connected
      if (!accountValue || isNaN(parseFloat(accountValue)) || parseFloat(accountValue) <= 0) {
        console.error("Invalid account value.");
        return;
      }
  
      // Convert the account value to a BigNumber
      const accountValueInWei = ethers.parseEther(accountValue);
  
      // Simulate the contract call to calculateRatio
      const { request } = await publicClient.simulateContract({
        address: deployedContracts.assetchain_testnet.address as `0x${string}`,
        abi: deployedContracts.assetchain_testnet.abi,
        functionName: "calculateRatio",
        args: [accountValueInWei], // Pass the account value as an argument
        account,
      });
  
      // Execute the contract call
      const hash = await walletClient.writeContract(request);
      
      console.log(`Ratio calculation transaction successful! Transaction Hash: ${hash}`);
      setTransactionHash(hash); // Save transaction hash for future reference
  
      // Fetch and display the ratio after the transaction
      const calculatedRatio = await contract.read.ratio(); // Replace with the actual call to get the ratio
      router.push(`/member-details?ratio=${calculatedRatio}`);
    } catch (error) {
      console.error("Ratio calculation error:", error);
    }
  };

  const handleMenuClick = (option: 'viewHistory' | 'contribution'| 'groupAccount'|'Settings') => {
   // setSelectedOption(option);
    if (selectedOption === option) {
      setSelectedOption(null); // Close the menu if it's already open
      setShowMenu(false); // Close menu after selecting an option

    } else {
      setSelectedOption(option); // Open the clicked menu

    }
  };

  const handleContribution = async () => {
    try {
      if (!account) return; // Ensure the user's account is connected
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        console.error("Invalid contribution amount.");
        return;
      }
  
      // Convert the amount to Wei
      const amountInWei = ethers.parseEther(amount);
  
      // Simulate the contract call to contribute
      const { request } = await publicClient.simulateContract({
        address: safeGroupWalletAddress as `0x${string}`,
        abi: deployedContracts.assetchain_testnet.abi,
        functionName: "contribute",
        args: [],
        account,
        value: amountInWei, // Pass the contribution amount as value
      });
  
      // Execute the contract call
      const hash = await walletClient.writeContract(request);
      
      console.log(`Contribution successful! Transaction Hash: ${hash}`);
      setTransactionHash(hash); // Save transaction hash for future reference
    } catch (error) {
      console.error("Contribution error:", error);
    }
  };


  
  const handleViewAccount = async () => {
    setShowAccountInput(true);
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

     // Create a new provider with MetaMask
     const provider = new BrowserProvider(window.ethereum);
     // Request account access if needed
     await provider.send("eth_requestAccounts", []);

     // Fetch the balance of the group wallet address
     const balance = await provider.getBalance(safeGroupWalletAddress);

     // Convert the balance from Wei to Ether
     const balanceInEther = ethers.formatEther(balance);

     // Set the balance in state
     setBalance(balanceInEther);
   };

  const handleViewWalletAddresses = () => {
    router.push('/chatAttachment');
  };

  const handleUpdateAccount = () =>{
    router.push('/update-password');
  }

  
  //const handleHover = (button: React.SetStateAction<string | null>) => {
   // setHoveredButton(button); // Update hoveredButton state
  //};

  //const handleMouseLeave = () => {
   // setHoveredButton(null); // Reset hoveredButton state
  //};

  const handleIsusuTypeChange = (type:'normal'|'purpose') => {
    setIsusuType(type); // Set the selected Isusu Type
    console.log(`Isusu Type set to ${type}`); // Logging for debugging purposes
  };
  
  const handleIsusuDurationChange = (duration:'weekly'|'monthly'|'annually'|'yearly') => {
    setIsusuDuration(duration); // Set the selected Isusu Duration
    console.log(`Isusu Duration set to ${duration}`); // Logging for debugging purposes
  };
  

  
//secret key use effect
const goToSecretKeyManager = () => {
  router.push('/SecretKeyManager');  // Navigate to the SecretKeyManager page
};

 //display the walletAddress and private key if the condition is meant
  const openMetaMask = () => {
    if (walletAddress) {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            // Open MetaMask with the specific wallet address
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xA5B5' }] // Chain ID for 42421
              }).then(() => {
                window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Token type
                        options: {
                            address: walletAddress, // The wallet address you want to view
                            symbol: 'RWA', // A ticker symbol or shorthand, up to 5 chars
                            decimals: 18, // The number of decimals in the token
                        },
                    },
                });
            }).catch((error: any) => {
                console.error("MetaMask error:", error);
                alert("Failed to open MetaMask. Please make sure it is installed and try again.");
            });
        } else {
            alert("MetaMask is not installed. Please install it to view the group account.");
        }
    } else {
        alert("No wallet address found. Please create the wallet first.");
    }
};
  
  return (

    <div className="chat-page min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 ">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">

    {/* Header */}
    <header className="header w-full bg-[#1d292c] text-white p-4 flex justify-center items-center">
    <h1 className="title text-2xl font-bold "> {groupName}</h1>
    </header>
  
      {/* Main Content Layout */}
      <div className="flex flex-col flex-1">

         
      {/* Row Layout for Menu and Timers */}
      <div className="flex w-full">

      {/* Left Menu (List Buttons) */}
      <nav className="menu bg-white-200 p-4 absolute z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="menu-button bg-green-500 text-white p-2 w-full mb-2 hover:bg-green-700"
        >
        <FaBars /> {/* List icon */}
        </button>
        {showMenu && (
           <ul className="menu-list space-y-2">
            <li className="menu-item relative">
            <button
                onMouseEnter={() => setHoveredButton('viewHistory')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleMenuClick('viewHistory')}
                className="menu-button bg-gray-300 hover:bg-gray-400 p-2 w-full text-left"
              > 
              <FaHistory /> View History {/* Icon and text */}
            </button>
             {hoveredButton === 'viewHistory' && (
                <span className="absolute left-full ml-2 bg-white border p-2 shadow-lg">
                  View voting history for this group.
                </span>
              )}
          </li>

          <li className="menu-item relative">
              <button
                onMouseEnter={() => setHoveredButton('contribution')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleMenuClick('contribution')}
                className="menu-button bg-gray-300 hover:bg-gray-400 p-2 w-full text-left"
              >
                <FaMoneyBill /> Contribution
              </button>
              {hoveredButton === 'contribution' && (
                <span className="absolute left-full ml-2 bg-white border p-2 shadow-lg">
                  Make a financial contribution to the group.
                </span>
              )}
            </li>

          <li className="menu-item relative">
              <button
                onMouseEnter={() => setHoveredButton('groupAccount')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleMenuClick('groupAccount')}
                className="menu-button bg-gray-300 hover:bg-gray-400 p-2 w-full text-left"
              >
                <FaUserCircle /> Group Account
              </button>
              {hoveredButton === 'groupAccount' && (
                <span className="absolute left-full ml-2 bg-white border p-2 shadow-lg">
                  Manage the group's account and settings.
                </span>
              )}
            </li>

               {/* Settings Button */}
               <li className="menu-item relative">
              <button
                onMouseEnter={() => setHoveredButton('settings')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleMenuClick('Settings')}
                className="menu-button bg-gray-300 hover:bg-gray-400 p-2 w-full text-left"
              >
                 <FaCog /> Settings
              </button>
              {hoveredButton === 'settings' && (
                <span className="absolute left-full ml-2 bg-white border p-2 shadow-lg">
                  Configure Isusu Type and Duration.
                </span>
              )}
            </li>
        </ul>

      )}
      </nav>
       
   

  
    <main className="content w-1/5 p-4 bg-white absolute z-5">
      {selectedOption === 'viewHistory' && (
        <VoteHistory userId={getUserPhoneNumber()} groupName={groupName} />
      )}
      {selectedOption === 'contribution' && (
        <div className="contribution-box  absolute z-5"
        style={{
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Box shadow for depth
          margin: '0px auto', // Center the box horizontally
          maxWidth: '260px', // Limit the width of the box
          overflowX: 'auto', // Enable horizontal scrolling
          whiteSpace: 'nowrap', // Prevent wrapping of inner content
        }}>
          <h2>Make a Contribution</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            className="amount-input border p-1 mb-1 w-full"
          />
          <button onClick={handleContribution} className="contribute-button bg-green-500 text-white p-2">
            Contribute
          </button>
           <h2>Group wallet Address</h2>
           <p>{safeGroupWalletAddress}</p>
           <p>{key}</p>

        </div>
      )}
       

         {selectedOption === 'groupAccount' && (
          <div className="account-box absolute z-5"
          style={{
            padding: '20px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Box shadow for depth
            margin: '20px auto', // Center the box horizontally
            maxWidth: '260px', // Limit the width of the box
            overflowX: 'auto', // Enable horizontal scrolling
            whiteSpace: 'nowrap', // Prevent wrapping of inner content
          }}>
            <h2>Group Account</h2>
            <div className="account-options">

            {/* MetaMask connection */}
            <button onClick={openMetaMask} className="btn bg-green-500 text-white mb-3 p-2">Connect MetaMask</button>

            {/* Account management buttons */}
            <button onClick={handleUpdateAccount} className="btn bg-blue-500 text-white mb-2 p-2">Update Account Password</button>
            <button onClick={handleViewAccount} className="btn bg-green-500 text-white mb-2 p-2">View Account Balance</button>
               {/* Display balance right under "View Account Balance" */}
               {balance !== null && (
                  <p className="balance-info bg-gray-100 p-2 border mt-2">Balance: {balance} RWA</p>
                )}

             {/* Navigation to Secret Key Manager */}
             <button onClick={goToSecretKeyManager} className="btn bg-blue-500 text-white mt-4 p-2">Manage Secret Key</button>
             </div>

            
             {showAccountInput && (
        
                
                <button onClick={handleCalculateRatio} className="btn bg-green-500 text-white mt-4 p-2">
                  Calculate Ratio
                </button>

              
             )}
          </div>

         )}
         
         {selectedOption === 'Settings' && (
          <div className="Settings-box absolute z-5"
          style={{
            padding: '20px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Box shadow for depth
            margin: '20px auto', // Center the box horizontally
            maxWidth: '260px', // Limit the width of the box
            overflowX: 'auto', // Enable horizontal scrolling
            whiteSpace: 'nowrap', // Prevent wrapping of inner content
          }}>
            {/* Settings Content */}
            <h2>Settings</h2>
            {/* Isusu Type Selection */}
            <div className="isusu-type-selection mb-4">
            <h3 className="font-bold">Select Isusu Type</h3>
              <button onClick={() =>  handleIsusuTypeChange('normal')} className={`btn ${isusuType === 'normal' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Normal</button>
              <button onClick={() =>  handleIsusuTypeChange('purpose')} className={`btn ${isusuType === 'purpose' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Purpose</button>
            </div>
            {/* Isusu Duration Selection */}
            <div className="isusu-duration-selection">
            <h3 className="font-bold">Select Isusu Duration</h3>
              <button onClick={() => handleIsusuDurationChange('weekly')} className={`btn ${isusuDuration === 'weekly' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Weekly</button>
              <button onClick={() => handleIsusuDurationChange('monthly')}className={`btn ${isusuDuration === 'monthly' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Monthly</button>
              <button onClick={() => handleIsusuDurationChange('annually')} className={`btn ${isusuDuration === 'annually' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Annually</button>
              <button onClick={() => handleIsusuDurationChange('yearly')} className={`btn ${isusuDuration === 'yearly' ? 'bg-green-500' : 'bg-gray-300'} text-white p-2 m-2`}>Yearly</button>
            </div>
          </div>
         )}
         
    </main>

    <div className="flex flex-1 justify-around items-center px-40 space-x-4 ">
    <div className="timer bg-white-100 p-4 flex-1 text-center ">
   
    <h2 className="font-bold absolute z-5">Voting Time Left:</h2>
    <p className="text-red-500">{formatTime(timeLeft)}</p>
    {status && <div className="payment-status">{status}</div>}
    </div>

    <div className="timer bg-white-100 p-4 flex-1 text-center">
    <h2 className="font-bold absolute z-5">Isusu Duration Countdown:</h2>
    <p className="text-red-500">{timeLefts > 0 ? formatTimeDay(timeLefts) : "Isusu has ended"}</p>
    </div>
    </div>
    </div>
    


   {/* Chat Messages Section */}
    <section className="chat-container bg-white p-4 flex-1 flex flex-col h-full">
      <div className="messages border-b p-2 max-h-80 overflow-hidden hover:overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className="message border-b p-2">
            <div className="message-header font-bold">
              <strong>{message.userId}</strong>
            </div>
            <div className="message-text">{message.text}</div>

            {message.imageUrl ? (
                <img src={message.imageUrl} alt="User uploaded" className="message-image" />
            ) : (
                <div className="message-text">{message.text}</div>
            )}

            <div className="message-actions">
              <button className="vote-button bg-green-500 text-white p-1" onClick={() => message.id && handleVote(message.id, 'for')}>
                Vote For
              </button>
              <button className="vote-button bg-red-500 text-white p-1" onClick={() => message.id && handleVote(message.id, 'against')}>
                Vote Against
              </button>
            </div>
            <div className="message-votes">
              <p>Votes For: {message.votesFor}</p>
              <p>Votes Against: {message.votesAgainst}</p>
               <p>{getVoteResult(message)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Box */}
  
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={handleChange}
          placeholder="Type a message"
          className="message-input border flex-1 p-2 mr-2"
        />
        
         <input 
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="iimage-upload-input border p-2 mr-2"
         />
        
        <button type="submit" className="send-button bg-green-500 text-white p-2">
          Send
          </button>

          <input
          type="text"
          placeholder="Type your message..."
          value={messagew}
          onChange={(e) => setMessagew(e.target.value)}
          className="message-input-field"
        />
        <button type="button" className="wallet-address-button bg-green-500 text-white p-2 ml-2" onClick={handleViewWalletAddresses}>
        View Wallet Addresses
        </button>
      </form>
    </section>
    
  
   
   </div>
   </div>
   </div>
  );
};

export default Chat;

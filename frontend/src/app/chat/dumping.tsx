"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { collection, doc, onSnapshot, addDoc, orderBy, query, serverTimestamp, updateDoc, increment} from 'firebase/firestore';
import { firestore } from '@/firebase/firebaseConfig';
import VoteHistory from '@/components/VoteHistory'; // Ensure the path is correct


import { useRouter, usePathname,useSearchParams } from 'next/navigation';

interface Message {
 id?: string; // Optional for when retrieving
  text: string;
  userId: string;
  timestamp: any; // Use `any` or a specific type depending on how you handle timestamps
  votesFor: number;
  votesAgainst: number;
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

  let ratio: number = 0;
  let increments  = 1;


  const Chat: React.FC<ChatProps> = ({ params }) => {
  const { groupName } = params; // Retrieve dynamic parameter from props
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const router = useRouter();

  const [showAccountInput, setShowAccountInput] = useState(false);
  const [amount, setAmount] = useState('');
  const userId = getUserPhoneNumber();
  const [selectedOption, setSelectedOption] = useState<'viewHistory' | 'contribution' | 'groupAccount' |null>(null);

  const [selectedVotingType, setSelectedVotingType] = useState<'normal' | 'weighted'>('normal');
 //votingStartTime  time parameters

 const [timeLeft, setTimeLeft] = useState<number>(0);


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
      //if (timeLeft === 0) {
        // Voting time has expired
       // countVotes();}

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


//useeffect for vote type selection
  useEffect(() => {
    const savedVotingType = localStorage.getItem('votingType') as 'normal' | 'weighted';
    if (savedVotingType) {
      setSelectedVotingType(savedVotingType);
    }
  }, []);


  useEffect(() => {
    if (!groupName) return;

    const messagesRef = collection(doc(firestore, 'groups', groupName), 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
        const newMessages: Message[] = snapshot.docs.map(doc => ({
            id: doc.id,
            //...doc.data() as Message
            ...doc.data() as Omit<Message, 'id'> // Spread the rest of the data, but id is handled separately

          }));
          
          
          setMessages(newMessages);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  },  [groupName]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (messageText.trim() === '') return;

    const newMessage: Omit<Message, 'id'> = {
        text: messageText,
        userId: getUserPhoneNumber(), // Replace with actual user ID
        timestamp: serverTimestamp(),
        votesFor: 0,
        votesAgainst: 0
    };

    try {
        await addDoc(collection(doc(firestore, 'groups', groupName), 'messages'), newMessage);
        setMessageText('');
    } catch (error) {
      console.error('Error adding message: ', error);
    }
  };

  const handleVote = async (messageId: string, voteType: 'for' | 'against') => {
    const messageRef = doc(firestore, 'groups', groupName, 'messages', messageId);
    const userVoteRef = collection(doc(firestore, 'groups', groupName), 'userVotes');


    try {
    const incrementValue = localStorage.getItem('foundIncrement');

   if (selectedVotingType === 'weighted' && incrementValue) {
    
    increments = parseFloat(incrementValue);
  }


    // Update the vote count with the calculated increment

      await updateDoc(messageRef, {
        [voteType === 'for' ? 'votesFor' : 'votesAgainst']: increment(increments )
      });

      // Store vote record in the user's document
      const userVotesRef = collection(firestore, 'users', userId, 'votes');

      
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


  
  const handleAccountValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccountValue(event.target.value);
  };


  const handleCalculateRatio = () => {
    ratio = (parseFloat(amount) / parseFloat(accountValue)) * 100;
    router.push(`/member-details?ratio=${ratio}`);
    //router.push(`/member-details?voting power=${incrementValue}`);

    console.log(`/member-details?ratio=${ratio}`);
   
  };

  const handleMenuClick = (option: 'viewHistory' | 'contribution'| 'groupAccount') => {
    setSelectedOption(option);
  };

  const handleContribution = () => {
    // Handle the contribution logic here
    console.log(`Contributing ${amount} ETH`);
    // You would integrate your MetaMask and transaction logic here
  };


  const handleViewAccount = () => {
    setShowAccountInput(true);

  }
  
  return (

    <div className="chat-page">
    <header className="header">
      <h1 className="title">Chat - {groupName}</h1>
    </header>
  
    <nav className="menu">
      <button onClick={() => handleMenuClick('viewHistory')} className="menu-button">
        View History
      </button>
      <button onClick={() => handleMenuClick('contribution')} className="menu-button">
        Contribution
      </button>
      <button onClick={() => handleMenuClick('groupAccount')} className="menu-button">
      Group Account
        </button>
    </nav>

  
    <main className="content">
      {selectedOption === 'viewHistory' && (
        <VoteHistory userId={getUserPhoneNumber()} groupName={groupName} />
      )}
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

         {selectedOption === 'groupAccount' && (
          <div className="account-box">
            <h2>Group Account</h2>
            <div className="account-options">
            <button>Create Account</button>
              <button onClick={handleViewAccount}>View Account</button>
              <button>Delete Account</button>
            </div>
            {showAccountInput && (
              <div className="account-input">
                <input
                  type="number"
                  value={accountValue}
                  onChange={handleAccountValueChange}
                  placeholder="Enter a value"
                  className="account-value-input"
                />
                <button onClick={handleCalculateRatio} className="calculate-button">
                  Calculate Ratio
                </button>
              </div>
            )}
          </div>
         )}
    </main>

    <h2>Voting Time Left:</h2>
      <p>{formatTime(timeLeft)}</p>
  
    <section className="chat-container">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <div className="message-header">
              <strong>{message.userId}</strong>
            </div>
            <div className="message-text">{message.text}</div>
            <div className="message-actions">
              <button className="vote-button" onClick={() => message.id && handleVote(message.id, 'for')}>
                Vote For
              </button>
              <button className="vote-button" onClick={() => message.id && handleVote(message.id, 'against')}>
                Vote Against
              </button>
            </div>
            <div className="message-votes">
              <p>Votes For: {message.votesFor}</p>
              <p>Votes Against: {message.votesAgainst}</p>
            </div>
          </div>
        ))}
      </div>
  
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={handleChange}
          placeholder="Type a message"
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </section>
  
    <style jsx>{`
      .chat-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f5f5f5;
      }
  
      .header {
        background: #f0f0f0;
        padding: 10px;
        border-bottom: 1px solid #ddd;
         text-align: center;
      }
  
      .title {
        text-align: center;
        font-size: 2rem;
        margin: 0;
      }
  
      .menu {
        display: flex;
        justify-content: center;
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
        margin: 0 5px;
      }
  
      .menu-button:hover {
        background-color: #005bb5;
      }

  
      .content {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
      }
  
     .contribution-box, .account-box {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 0 auto;
    }
  
     .amount-input, .account-value-input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.25rem;
    }
  
      
    .contribute-button, .calculate-button {
      background-color: #2d3748;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 100%;
      border-radius: 0.25rem;
    }

      
      .account-options {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

     .account-option-button {
      background-color: #2d3748;
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 0.25rem;
      flex-grow: 1;
      margin: 0 0.5rem;
    }

     .account-input {
    margin-top: 1rem;
  }
  
      .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px;
        overflow: hidden;
      }
  
      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid #ddd;
      }
  
      .message {
        padding: 10px;
        margin-bottom: 10px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
  
      .message-header {
        font-weight: bold;
        margin-bottom: 5px;
      }
  
      .message-text {
        margin-top: 0.5rem;
      }
  
      .message-actions {
        display: flex;
        justify-content: space-between;
         margin-top: 0.5rem;
      }
  
      .vote-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-right: 5px;
        cursor: pointer;
        font-size: 14px;
      }
  
      .vote-button:hover {
        background-color: #005bb5;
      }
  
      .message-votes {
        font-size: 14px;
        color: #555;
      }
  
      .message-form {
        display: flex;
        padding: 10px;
        background: #f0f0f0;
        border-top: 1px solid #ddd;
        position: fixed; /* Keep the form fixed at the bottom */
        bottom: 50;
        width: 100%;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      }
  
      .message-input {
        flex: 1;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-right: 10px;
      }
  
      .send-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
  
      .send-button:hover {
        background-color: #005bb5;
      }
    `}</style>
  </div>
  
   
  );
};

export default Chat;


"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { collection, doc, onSnapshot, addDoc, orderBy, query, serverTimestamp, updateDoc, increment} from 'firebase/firestore';
import { firestore,storage } from '@/firebase/firebaseConfig';
import VoteHistory from '@/components/VoteHistory'; // Ensure the path is correct
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BrowserProvider, parseEther } from 'ethers';

import PaymentComponent from './PaymentComponent';
import { useRouter, usePathname,useSearchParams } from 'next/navigation';
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

  let ratio: number = 0;
  let increments  = 1;


  const Chat: React.FC<ChatProps> = ({ params }) => {
  const { groupName } = params; // Retrieve dynamic parameter from props
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const router = useRouter();
  const [messagew, setMessagew] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null); // State to store selected image

  //wallet address
  
  const walletAddress = localStorage.getItem('walletAddress')|| '';
  const groupWalletAddress = walletAddress; 
  const safeGroupWalletAddress = groupWalletAddress ?? ''; // Provide an empty string if null
  const [status, setStatus] = useState<string>('');

  //state management
  const [transactionHash, setTransactionHash] = useState<string>("");
  const { address: account } = useAccount();

  const [showAccountInput, setShowAccountInput] = useState(false);
  const [amount, setAmount] = useState('');
  const userId = getUserPhoneNumber();
  const [selectedOption, setSelectedOption] = useState<'viewHistory' | 'contribution' | 'groupAccount' |null>(null);

  const [selectedVotingType, setSelectedVotingType] = useState<'normal' | 'weighted'>('normal');
 //votingStartTime  time parameters

 const [timeLeft, setTimeLeft] = useState<number>(0);
  
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


// use effect for the actual voting time and the total vote

useEffect(() => {
  if (timeLeft === 0) {
    // Voting time has expired
    countVotes();
  }
}, [timeLeft]);

//fetch message and calculate voting result

const countVotes = async () => {

    if (!groupName) return;
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
     // Optionally, clear the selected address after it's been used
     //localStorage.removeItem('selectedWalletAddress');
    }
  }, []);


//to handle payment of selected address
const handlePayment = async (toAddress: string) => {
  try {
    const provider = new BrowserProvider((window as any).ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();

    const tx = await signer.sendTransaction({
      to: toAddress,
      value: parseEther(amount), // Payment amount in Ether
    });

    setStatus(`Payment successful! Transaction Hash: ${tx.hash}`);
  } catch (error) {
    setStatus(`Payment failed`);
  }
};


//Handle vote submission


const handleVote = async (messageId: string, voteType: 'for' | 'against') => {
  const messageRef = doc(firestore, 'groups', groupName, 'messages', messageId);
  const userVoteRef = collection(doc(firestore, 'groups', groupName), 'userVotes');


  try {
  const incrementValue = localStorage.getItem('foundIncrement');

 if (selectedVotingType === 'weighted' && incrementValue) {
  
  increments = parseFloat(incrementValue);
}


  // Update the vote count with the calculated increment

    await updateDoc(messageRef, {
      [voteType === 'for' ? 'votesFor' : 'votesAgainst']: increment(increments )
    });

    // Store vote record in the user's document
    const userVotesRef = collection(firestore, 'users', userId, 'votes');

    
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

  } catch (error) {
    console.error('Error adding message: ', error);
  }
};


//to get the voting result

const getVoteResult = (message: Message) => {

  if (message.winner) {

    if (message.winner === 'for' && messagew) {
      handlePayment(messagew);
      //return messagew;
     
   }
    return `The winning vote is ${message.winner === 'for' ? 'For' : 'Against'}.`;
  }
  
  return 'Voting in progress.';
};


  const handleAccountValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccountValue(event.target.value);
  };


  const handleCalculateRatio = () => {
    ratio = (parseFloat(amount) / parseFloat(accountValue)) * 100;
    router.push(`/member-details?ratio=${ratio}`);
    console.log(`/member-details?ratio=${ratio}`);
   
  };

  const handleMenuClick = (option: 'viewHistory' | 'contribution'| 'groupAccount') => {
    setSelectedOption(option);
  };

  const handleContribution = () => {
    // Handle the contribution logic here
    console.log(`Contributing ${amount} ETH`);
    // You would integrate your MetaMask and transaction logic here
  };


  const handleViewAccount = () => {
    setShowAccountInput(true);

  }

  const handleViewWalletAddresses = () => {
    router.push('/chatAttachment');
  };

  const handleUpdateAccount = () =>{
    router.push('/update-password');
  }

  
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

    <div className="chat-page">
    <header className="header">
      <h1 className="title">Chat - {groupName}</h1>
    </header>
  
    <nav className="menu">
      <button onClick={() => handleMenuClick('viewHistory')} className="menu-button">
        View History
      </button>
      <button onClick={() => handleMenuClick('contribution')} className="menu-button">
        Contribution
      </button>
      <button onClick={() => handleMenuClick('groupAccount')} className="menu-button">
      Group Account
        </button>
      
    </nav>

  
    <main className="content">
      {selectedOption === 'viewHistory' && (
        <VoteHistory userId={getUserPhoneNumber()} groupName={groupName} />
      )}
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

          <PaymentComponent groupWalletAddress={safeGroupWalletAddress} />

        </div>
      )}
      <h2>Voting Time Left:</h2>
      <p>{formatTime(timeLeft)}</p>

      {status && <div className="payment-status">{status}</div>}


         {selectedOption === 'groupAccount' && (
          <div className="account-box">
            <h2>Group Account</h2>
            <div className="account-options">
            <button onClick={handleUpdateAccount}>Update Account Password</button>
            <button onClick={handleViewAccount}>View Account</button>  
            <button onClick={openMetaMask}>Connect MetaMask</button>
            <button onClick={goToSecretKeyManager} className="btn btn-primary mt-4">
             Manage Secret Key
            </button>           
             </div>
            {showAccountInput && (
              <div className="account-input">

                <input
                  type="number"
                  value={accountValue}
                  onChange={handleAccountValueChange}
                  placeholder="Enter a value"
                  className="account-value-input"
                />
                <button onClick={handleCalculateRatio} className="calculate-button">
                  Calculate Ratio
                </button>

              </div>
            )}
          </div>
         )}
    </main>

  
    <section className="chat-container">
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <div className="message-header">
              <strong>{message.userId}</strong>
            </div>
            <div className="message-text">{message.text}</div>

            {message.imageUrl ? (
                <img src={message.imageUrl} alt="User uploaded" className="message-image" />
            ) : (
                <div className="message-text">{message.text}</div>
            )}

            <div className="message-actions">
              <button className="vote-button" onClick={() => message.id && handleVote(message.id, 'for')}>
                Vote For
              </button>
              <button className="vote-button" onClick={() => message.id && handleVote(message.id, 'against')}>
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
  
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={handleChange}
          placeholder="Type a message"
          className="message-input"
        />
        
         <input 
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-upload-input"
         />
        
        <button type="submit" className="send-button">
          Send
          </button>

          <input
          type="text"
          placeholder="Type your message..."
          value={messagew}
          onChange={(e) => setMessagew(e.target.value)}
          className="message-input-field"
        />
        <button type="button" className="wallet-address-button" onClick={handleViewWalletAddresses}>
        View Wallet Addresses
        </button>
      </form>
    </section>
    
  
    <style jsx>{`
      .chat-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f5f5f5;
      }
  
      .header {
        background: #f0f0f0;
        padding: 10px;
        border-bottom: 1px solid #ddd;
         text-align: center;
      }
  
      .title {
        text-align: center;
        font-size: 2rem;
        margin: 0;
      }
  
      .menu {
        display: flex;
        justify-content: center;
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
        margin: 0 5px;
      }
  
      .menu-button:hover {
        background-color: #005bb5;
      }

  
      .content {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
      }
  
     .contribution-box, .account-box {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 0 auto;
    }
  
     .amount-input, .account-value-input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.25rem;
    }
   .message-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
   }

      
    .contribute-button, .calculate-button {
      background-color: #2d3748;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 100%;
      border-radius: 0.25rem;
    }

      
      .account-options {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

     .account-option-button {
      background-color: #2d3748;
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      border-radius: 0.25rem;
      flex-grow: 1;
      margin: 0 0.5rem;
    }

     .account-input {
    margin-top: 1rem;
  }
  
      .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px;
        overflow: hidden;
      }
  
      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid #ddd;
      }
  
      .message {
        padding: 10px;
        margin-bottom: 10px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
  
      .message-header {
        font-weight: bold;
        margin-bottom: 5px;
      }
  
      .message-text {
        margin-top: 0.5rem;
      }
  
      .message-actions {
        display: flex;
        justify-content: space-between;
         margin-top: 0.5rem;
      }
  
      .vote-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-right: 5px;
        cursor: pointer;
        font-size: 14px;
      }
  
      .vote-button:hover {
        background-color: #005bb5;
      }
  
      .message-votes {
        font-size: 14px;
        color: #555;
      }
  
      .message-form {
        display: flex;
        padding: 10px;
        background: #f0f0f0;
        border-top: 1px solid #ddd;
        position: fixed; /* Keep the form fixed at the bottom */
        bottom: 50;
        width: 100%;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      }
  
      .message-input,.image-upload-input, .message-input-field {
        flex: 1;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-right: 10px;
      }
  
      .send-button, .wallet-address-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
  
      .send-button:hover,.wallet-address-button:hover {
        background-color: #005bb5;
      }

      .payment-status {
        color: green;
      }
    `}</style>
  </div>
  
   
  );
};

export default Chat;














<style jsx>{`
      .chat-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f5f5f5;
      }
  
      .header {
        background: #f0f0f0;
        padding: 10px;
        border-bottom: 1px solid #ddd;
         text-align: center;
      }
  
      .title {
        text-align: center;
        font-size: 2rem;
        margin: 0;
      }
  
      .menu {
        position: relative;
        margin: 10px;
      }
  
      .menu-button {
       background-color: #007bff;
       color: white;
       border: none;
       padding: 10px;
       border-radius: 5px;
       cursor: pointer;
       display: flex;
       align-items: center;
       justify-content: center;
      }
  
      .menu-list {
       position: absolute;
       top: 40px; /* Adjust based on your layout */
       left: 0;
       background-color: white;
       border: 1px solid #ddd;
       border-radius: 5px;
       list-style: none;
       padding: 0;
       margin: 0;
       width: 200px; /* Adjust width as needed */
      z-index: 100;
      display: flex;
     flex-direction: column; /* Ensures the list is vertical */
     }

     .menu-item {
     width: 100%; /* Makes the buttons fill the width */
     }

   .menu-item .menu-button {
     width: 100%;
     background-color: #f8f9fa;
      color: #333;
     padding: 10px;
     border: none;
     text-align: left; /* Align text to the left */
     cursor: pointer;
     display: flex;
     align-items: center;
     transition: background-color 0.2s;
   }

   .menu-item .menu-button:hover {
  background-color: #e9ecef;
}

.menu-item svg {
  margin-right: 8px; /* Spacing between icon and text */
}

.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: #fff;
  background-color: blue; /* Default background color */
}

.timer.active {
  background-color: red; /* Red background when active */
  border-radius: 80%; /* Make it round */
  width: 80px; /* Adjust width and height to make it round */
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.payment-status {
  margin-top: 10px;
  color: #000;
}
  
      .content {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
      }
  
     .contribution-box, .account-box {
      background-color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 550px;
      margin: 0 auto;
    }
  
     .amount-input, .account-value-input {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #cbd5e0;
      border-radius: 0.25rem;
    }
   .message-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
   }

      
    .contribute-button, .calculate-button {
      background-color: #2d3748;
      color: blue;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 100%;
      border-radius: 0.25rem;
    }
    
    .account-box {
     padding: 10px;
     border: 1px solid #ccc;
     border-radius: 8px;
     background-color: #f9f9f9;
     max-width: 600px;
     margin: auto;
     }
      
    .account-options {
      display: flex;
      justify-content: space-between;
      margin-bottom:20px;
    }

   .btn {
  padding: 10px 15px;
  margin: 5px 0;
  width: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}


.btn-warning {
  background-color: #ffc107;
  color: #fff;
}

.btn-info {
  background-color: #17a2b8;
  color: #fff;
}

.balance-info {
  font-size: 16px;
  margin-top: 10px;
}

 .account-option-button {
  background-color: #2d3748;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 0.25rem;
  flex-grow: 1;
  margin: 0 0.5rem;
   }

  .account-input {
  margin-top: 1rem;
  }
  
      .chat-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px;
        overflow: hidden;
      }
  
      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid #ddd;
      }
  
      .message {
        padding: 10px;
        margin-bottom: 10px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
  
      .message-header {
        font-weight: bold;
        margin-bottom: 5px;
      }
  
      .message-text {
        margin-top: 0.5rem;
      }
  
      .message-actions {
        display: flex;
        justify-content: space-between;
         margin-top: 0.5rem;
      }
  
      .vote-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        margin-right: 5px;
        cursor: pointer;
        font-size: 14px;
      }
  
      .vote-button:hover {
        background-color: #005bb5;
      }
  
      .message-votes {
        font-size: 14px;
        color: #555;
      }
  
      .message-form {
        display: flex;
        padding: 10px;
        background: #f0f0f0;
        border-top: 1px solid #ddd;
        position: fixed; /* Keep the form fixed at the bottom */
        bottom: 50;
        width: 100%;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      }
  
      .message-input,.image-upload-input, .message-input-field {
        flex: 1;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-right: 10px;
      }
  
      .send-button, .wallet-address-button {
        background-color: #0070f3;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
  
      .send-button:hover,.wallet-address-button:hover {
        background-color: #005bb5;
      }

      .payment-status {
        color: green;
      }
    `}</style>
  </div>
  
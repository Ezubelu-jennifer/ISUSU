import React, { useEffect, useState } from 'react';
import { collection, doc, query, where, onSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebase/firebaseConfig'; // Adjust path as needed

interface Vote {
  messageId: string;
  userId: string;
  voteType: 'for' | 'against';
  timestamp: any;
}

interface VoteHistoryProps {
  userId: string; // Phone number as user ID
  groupName: string; // Group name to query
}

const VoteHistory: React.FC<VoteHistoryProps> = ({ userId, groupName }) => {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    if (!userId || !groupName) return;

    const votesRef = collection(doc(firestore, 'groups', groupName), 'userVotes');
    const q = query(votesRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, snapshot => {
      const newVotes: Vote[] = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          messageId: doc.id, // Use document ID as messageId
          userId: data.userId,
          voteType: data.voteType,
          timestamp: data.timestamp,
        };
      });
      setVotes(newVotes);
    }, (error) => {
      console.error("Error fetching vote history:", error);
    });

    return () => unsubscribe();
  }, [userId, groupName]);

  return (
    <div className="vote-history">
      <h2>Your Vote History</h2>
      {votes.length > 0 ? (
        <ul>
          {votes.map((vote, index) => (
            <li key={index} className="vote-item">
              <p><strong>Message ID:</strong> {vote.messageId}</p>
              <p><strong>Vote Type:</strong> {vote.voteType}</p>
              <p><strong>Timestamp:</strong> 
                {vote.timestamp && vote.timestamp.seconds ? 
                new Date(vote.timestamp.seconds * 1000).toLocaleString() : 
                'N/A'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vote history available.</p>
      )}
      <style jsx>{`
        .vote-history {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-bottom: 20px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .vote-item {
          padding: 10px;
          margin-bottom: 10px;
          background: #f4f4f4;
          border-radius: 4px;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #555;
        }

        strong {
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default VoteHistory;

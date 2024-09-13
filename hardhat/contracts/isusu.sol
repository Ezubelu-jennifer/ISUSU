// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract VotingAndPayment {
    struct Message {
        string text;
        address creator;
        uint256 votesFor;
        uint256 votesAgainst;
        string imageUrl;
        uint256 timestamp;
        string winner;
        
        //bool exists;
    }

    struct UserVote {
        address userAddress;
        string voteType;  // "for" or "against"
        uint256 weight;   // Voting weight
    }


    address public groupWalletAddress;
    address public owner;
    uint256 public totalContributions;
    uint256 public ratio;
    uint256 public votingEndTime;

     mapping(address => bool) public authenticatedMembers;
    mapping(string => Message) public messages;
    mapping(string => mapping(address => UserVote)) public userVotes;
    string[] public messageIds;  // Array of message IDs

    //event MessageCreated(string messageId, string text, string imageUrl, address creator);
    event Voted(string messageId, address voter, string voteType, uint256 weight);
    event PaymentProcessed(address indexed to, uint256 amount);
    event ContributionMade(address indexed contributor, uint256 amount);
    event GroupWalletAddressUpdated(address newAddress);


   modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthenticatedMember() {
        require(authenticatedMembers[msg.sender], "Only authenticated members can vote");
        _;
    }

   // constructor(address _groupWalletAddress) {
    constructor() {

        owner = msg.sender;
        authenticatedMembers[msg.sender] = true;  // Owner is an authenticated member
    }

    function updateGroupWalletAddress(address newAddress) external onlyOwner {
        groupWalletAddress = newAddress;
        emit GroupWalletAddressUpdated(newAddress);
    }

     function authenticateMember(address member) external onlyOwner {
        authenticatedMembers[member] = true;
    }

    //function createMessage(string memory messageId, string memory text, string memory imageUrl) external onlyAuthenticatedMember {
      //  require(bytes(messageId).length > 0, "Message ID is required");
      //  require(bytes(text).length > 0 || bytes(imageUrl).length > 0, "Text or image is required");

      //  Message memory newMessage = Message({
        //    text: text,
       //     creator: msg.sender,
       //     timestamp: block.timestamp,
         //   votesFor: 0,
        //    votesAgainst: 0,
        //    imageUrl: imageUrl,
        //     winner: ""
       // });
        // messages[messageId] = newMessage;
       // messageIds.push(messageId);

     //   emit MessageCreated(messageId, text, imageUrl, msg.sender);
   // }

    function vote(string memory messageId, string memory voteType, uint256 weight) external onlyAuthenticatedMember {
        require(bytes(voteType).length > 0, "Vote type is required");
        require(keccak256(bytes(voteType)) == keccak256("for") || keccak256(bytes(voteType)) == keccak256("against"), "Invalid vote type");

        Message storage message = messages[messageId];
        //require(message.timestamp > 0, "Message does not exist");

        if (keccak256(bytes(voteType)) == keccak256("for")) {
            message.votesFor += weight;
        } else {
            message.votesAgainst += weight;
        }
        userVotes[messageId][msg.sender] = UserVote({
            userAddress: msg.sender,
            voteType: voteType,
            weight: weight
        });

        emit Voted(messageId, msg.sender, voteType, weight);
    }

        function endVoting(string memory messageId) external onlyOwner {
        Message storage message = messages[messageId];
       // require(message.timestamp > 0, "Message does not exist");
       // require(votingEndTime <= block.timestamp, "Voting period has not ended");

        if (message.votesFor > message.votesAgainst) {
            message.winner = "for";
            // Payment to the winner
            processPayment(message.creator);
        } else {
            message.winner = "against";
        }
    }

    function processPayment(address to) internal {
        uint256 amount = address(this).balance;

        require(amount >= 0, "No funds available for payment");
        require(groupWalletAddress != address(0), "Group wallet address not set");


      // Transfer from groupWalletAddress to 'to' address
        payable(groupWalletAddress).transfer(amount);
        payable(to).transfer(amount);
        emit PaymentProcessed(to, amount);
    }
   

    function contribute() external payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        totalContributions += msg.value;
        emit ContributionMade(msg.sender, msg.value);
    }

    function calculateRatio(uint256 value) external onlyAuthenticatedMember {
        require(totalContributions > 0, "Total contributions must be greater than 0");
        ratio = (value * 100) / totalContributions;
    }

    // Helper functions to get the state
    function getMessageIds() external view returns (string[] memory) {
        return messageIds;
    }

    function getMessage(string memory messageId) external view returns (Message memory) {
        return messages[messageId];
    }

    function getUserVote(string memory messageId, address user) external view returns (UserVote memory) {
        return userVotes[messageId][user];
    }

    receive() external payable {}
}

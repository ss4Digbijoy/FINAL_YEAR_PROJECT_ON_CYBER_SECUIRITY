// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract UserManagement {
    struct User {
        
        address userAddress;
        string name;
        bool registered;
        string fingerprintHash;
    }
    
    struct Transaction {
        uint senderId;
        uint recipientId;
        uint amount;
        uint date;
    }
    
    mapping(uint => User) private users;
    mapping(address => uint) private addressToId;
    Transaction[] private transactions;
    
    modifier onlyRegisteredUser(uint _uniqueId) {
        require(users[_uniqueId].registered, "User not registered");
        _;
    }
    modifier onlyRegisteredAddress(address _useradd) {
        require(addressToId[_useradd]!=0, "User not registered");
        _;
    }
    
    function register(uint _uniqueId, string memory _name, string memory _fingerprintHash) public {
        require(_uniqueId!=0, "0 NOT ALLOWED AS AADHAR NO");
        require(!users[_uniqueId].registered, "Aadhar user already registered");
        require(addressToId[msg.sender] == 0, "Your address is already registered");
        
        users[_uniqueId] = User( msg.sender, _name, true, _fingerprintHash); // Store fingerprint hash
        addressToId[msg.sender] = _uniqueId;
    }
    
    function transfer(uint _recipientId, string memory _fingerprintHash) payable public onlyRegisteredAddress(msg.sender) onlyRegisteredUser(_recipientId) {
        uint senderId = addressToId[msg.sender];
        address receiver=users[_recipientId].userAddress;
        require(keccak256(abi.encode(users[senderId].fingerprintHash ))== keccak256(abi.encode(_fingerprintHash)), "Fingerprint verification failed"); // Verify fingerprint
        
        require(msg.value <= msg.sender.balance, "Insufficient balance");
        payable(receiver).transfer(msg.value);
        
        transactions.push(Transaction(senderId, _recipientId, msg.value, block.timestamp));
    }
    
    function getBalance() public view onlyRegisteredAddress(msg.sender) returns (uint) {
        return msg.sender.balance;
    }
    
    function getTransactions() public view onlyRegisteredAddress(msg.sender) returns (Transaction[] memory) {
        uint userId = addressToId[msg.sender];
        uint count = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].senderId == userId || transactions[i].recipientId == userId) {
                count++;
            }
        }
        Transaction[] memory userTransactions = new Transaction[](count);
        count = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].senderId == userId || transactions[i].recipientId == userId) {
                userTransactions[count] = transactions[i];
                count++;
            }
        }
        return userTransactions;
    }
}


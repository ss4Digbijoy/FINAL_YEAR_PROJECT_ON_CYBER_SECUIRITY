// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract UserManagement {
    struct User {
        uint uniqueId;
        address userAddress;
        string name;
        uint balance;
        bool registered;
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
    
    function register(uint _uniqueId, string memory _name) public {
        require(!users[_uniqueId].registered, "Aadhar user already registered");
        require(addressToId[msg.sender] == 0, "Your address is already registered");
        
        users[_uniqueId] = User(_uniqueId, msg.sender, _name, 100, true);
        addressToId[msg.sender] = _uniqueId;
    }
    
    function transfer(uint _recipientId, uint _amount) public onlyRegisteredUser(addressToId[msg.sender]) onlyRegisteredUser(_recipientId) {
        uint senderId = addressToId[msg.sender];
        
        require(users[senderId].balance >= _amount, "Insufficient balance");
        
        users[senderId].balance -= _amount;
        users[_recipientId].balance += _amount;
        
        transactions.push(Transaction(senderId, _recipientId, _amount, block.timestamp));
    }
    
    function getBalance() public view onlyRegisteredUser(addressToId[msg.sender]) returns (uint) {
        uint userId = addressToId[msg.sender];
        return users[userId].balance;
    }
    
    function getTransactions() public view onlyRegisteredUser(addressToId[msg.sender]) returns (Transaction[] memory) {
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

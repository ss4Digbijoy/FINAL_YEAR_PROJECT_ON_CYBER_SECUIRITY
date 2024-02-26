import React, { useState, useEffect } from 'react';

import Web3 from 'web3';
 

const App = () => {

    const [web3, setWeb3] = useState(null);

    const [contract, setContract] = useState(null);

    const [accountId, setAccountId] = useState(null);

    const [formData, setFormData] = useState({

        recipientId: '',

        amount: ''

    });

    const [message, setMessage] = useState('');

 
   const connectToMetamask = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);

                await window.ethereum.enable();

                setWeb3(web3Instance);         
                const UserManagementABI= [
                  {
                    "inputs": [],
                    "name": "getBalance",
                    "outputs": [
                      {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "inputs": [],
                    "name": "getTransactions",
                    "outputs": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "senderId",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "recipientId",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                          }
                        ],
                        "internalType": "struct UserManagement.Transaction[]",
                        "name": "",
                        "type": "tuple[]"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "_uniqueId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                      }
                    ],
                    "name": "register",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "_recipientId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                      }
                    ],
                    "name": "transfer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                  }
                ];

                const contractInstance = new web3Instance.eth.Contract(UserManagementABI, '0xbe3cd86E9bdea35563F220CF96E2399364efc150');

                setContract(contractInstance);
                setMessage('Done Connecting');

        } else {
          setMessage('Please install Metamask to use this app');

        }
      } catch (err) {
        alert(err.message);
      }
    };
  
    useEffect(() => {

        const loadWeb3 = async () => {

            if (window.ethereum) {

                const web3Instance = new Web3(window.ethereum);

                await window.ethereum.enable();

                setWeb3(web3Instance);         
                const Userabi= [
                  {
                    "inputs": [],
                    "name": "getBalance",
                    "outputs": [
                      {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "inputs": [],
                    "name": "getTransactions",
                    "outputs": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "senderId",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "recipientId",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                          },
                          {
                            "internalType": "uint256",
                            "name": "date",
                            "type": "uint256"
                          }
                        ],
                        "internalType": "struct UserManagement.Transaction[]",
                        "name": "",
                        "type": "tuple[]"
                      }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                  },
                  {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "_uniqueId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                      }
                    ],
                    "name": "register",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                  },
                  {
                    "inputs": [
                      {
                        "internalType": "uint256",
                        "name": "_recipientId",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                      }
                    ],
                    "name": "transfer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                  }
                ];

                const contractInstance = new web3Instance.eth.Contract(Userabi, '0xbe3cd86E9bdea35563F220CF96E2399364efc150');

                setContract(contractInstance);
                setMessage('Done Connecting');


            } else {

                setMessage('Please install Metamask to use this app');

            }

        };
       try{
        loadWeb3();
       }catch(error){
        setMessage(error.message)
       }

    }, []);

 

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

    };

 

    const handleRegister = async (e) => {

        e.preventDefault();

        try {
          if(!accountId){
            const accounts = await web3.eth.getAccounts();

            setAccountId(accounts[0]);}

            await contract.methods.register(parseInt(formData.uniqueId), formData.name).send({ from: accountId });

            setMessage('Registered');

        } catch (error) {

            setMessage(error.message);

        }

    };

 

    const handleTransfer = async (e) => {

        e.preventDefault();

        try {
          if(!accountId){
            const accounts = await web3.eth.getAccounts();

            setAccountId(accounts[0]);}

            await contract.methods.transfer(parseInt(formData.recipientId), parseInt(formData.amount)).send({ from: accountId });

            setMessage('Transfer successful');

        } catch (error) {

            setMessage(error.message);

        }

    };

 

    const getBalance = async () => {
      try{
        if(!accountId){
          const accounts = await web3.eth.getAccounts();

          setAccountId(accounts[0]);}

        const balance = await contract.methods.getBalance().call({ from: accountId });

        setMessage(`Balance: ${balance}`);}
        catch(error){
          setMessage(error.message);
        }

    };

 

    const getTransactions = async () => {
      try{
        if(!accountId){
          const accounts = await web3.eth.getAccounts();

          setAccountId(accounts[0]);}

        const transactions = await contract.methods.getTransactions().call({ from: accountId });

        const transactionsStringified = transactions.map(tx => ({
          senderId: tx.senderId.toString(),
          recipientId: tx.recipientId.toString(),
          amount: tx.amount.toString(),
          timestamp: tx.date.toString(),
      }));
  
      setMessage(`Transactions: ${JSON.stringify(transactionsStringified)}`);
    }catch(error){
      setMessage(error.message);
    }
    };

 

    return (

        <div>
                  <button onClick={connectToMetamask}>Connect to MetaMask</button>
                  <br/>

            <form onSubmit={handleRegister}>

                <input type="number" name="uniqueId" placeholder="Unique ID" value={formData.uniqueId} onChange={handleInputChange} />

                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />

                <button type="submit">Register</button>

            </form>

            <form onSubmit={handleTransfer}>

                <input type="number" name="recipientId" placeholder="Recipient's Unique ID" value={formData.recipientId} onChange={handleInputChange} />

                <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} />

                <button type="submit">Transfer</button>

            </form>

            <button onClick={getBalance}>Get Balance</button>

            <button onClick={getTransactions}>Get Transactions</button>

            <p>{message}</p>

        </div>

    );

};

 

export default App;

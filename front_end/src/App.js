import React, { useState, useEffect } from 'react';

import Web3 from 'web3';
import User from './UserManagement.json';
 

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

                const contractInstance = new web3Instance.eth.Contract(User.abi, User.deployedAddress[0]);

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

                const contractInstance = new web3Instance.eth.Contract(User.abi, User.deployedAddress[0]);

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

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import fingerprint from 'fingerprintjs2';
import './App.css';
const abi = [
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
        },
        {
          "internalType": "string",
          "name": "_fingerprintHash",
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
          "internalType": "string",
          "name": "_fingerprintHash",
          "type": "string"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
];


const Header = () => (
    <header className="header">
        <nav>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/transfer">Transfer</Link></li>
                <li><Link to="/balance">Get Balance</Link></li>
                <li><Link to="/transactions">Get Transactions</Link></li>
            </ul>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="footer">
        <p>&copy; 2024 aePS STCET GROUP 7</p>
    </footer>
);

const Home = ({ connectToMetamask, message }) => {
    useEffect(() => {
        document.title = "aePS Home";
    }, []);

    return (
        <div className="container">
            <button className="button" onClick={connectToMetamask}>Connect to MetaMask</button>
            <p>{message}</p>
        </div>
    );
};

const Register = ({ handleInputChange, handleRegister, formData, fileError }) => {
    useEffect(() => {
        document.title = "Register";
    }, []);

    return (
        <div className="container">
            <form onSubmit={handleRegister} className="form">
                <input type="number" name="uniqueId" placeholder="Unique ID" value={formData.uniqueId} onChange={handleInputChange} className="input" />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="input" />
                <input type="file" name="file" accept="image/bmp" onChange={handleInputChange} className="input" />
                {fileError && <p className="error">{fileError}</p>}
                <button type="submit" className="button">Register</button>
            </form>
        </div>
    );
};

const Transfer = ({ handleInputChange, handleTransfer, formData, fileError}) => {
    useEffect(() => {
        document.title = "Transfer";
    }, []);

    return (
        <div className="container">
            <form onSubmit={handleTransfer} className="form">
                <input type="number" name="recipientId" placeholder="Recipient's Unique ID" value={formData.recipientId} onChange={handleInputChange} className="input" />
                <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} className="input" />
                <input type="file" name="file" accept="image/bmp" onChange={handleInputChange} className="input" />
                {fileError && <p className="error">{fileError}</p>}

                <button type="submit" className="button">Transfer</button>
            </form>
        </div>
    );
};

const Balance = ({ getBalance, message }) => {
    useEffect(() => {
        document.title = "Get Balance";
    }, []);

    return (
        <div className="container">
            <button className="button" onClick={getBalance}>Get Balance</button>
            <p>{message}</p>
        </div>
    );
};

const Transactions = ({ getTransactions, message }) => {
    useEffect(() => {
        document.title = "Get Transactions";
    }, []);

    return (
        <div className="container">
            <button className="button" onClick={getTransactions}>Get Transactions</button>
            <p>{message}</p>
        </div>
    );
};

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accountId, setAccountId] = useState(null);
    const [formData, setFormData] = useState({
        uniqueId: '',
        name: '',
        recipientId: '',
        amount: '',
        file: null,
    });
    const [message, setMessage] = useState('');
    const [fileError, setFileError] = useState('');

    const connectToMetamask = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                const contractInstance = new web3Instance.eth.Contract(abi, '0x35e9ef02E08fDDF01581974BB8D4Ee0AA82a8C03');
                setContract(contractInstance);
                setMessage('Done Connecting');
            } else {
                setMessage('Please install Metamask to use this app');
            }
        } catch (error) {
            setMessage(`Error connecting to Metamask: ${error.message}`);
        }
    };

    useEffect(() => {
        const initializeWeb3 = async () => {
            try {
                if (window.ethereum) {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    const contractInstance = new web3Instance.eth.Contract(abi, '0x35e9ef02E08fDDF01581974BB8D4Ee0AA82a8C03');
                    setContract(contractInstance);
                    setMessage('Done Connecting');
                } else {
                    setMessage('Please install Metamask to use this app');
                }
            } catch (error) {
                setMessage(`Error initializing Web3: ${error.message}`);
            }
        };
        initializeWeb3();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === 'file') {
        const file = e.target.files[0];
        if (!file || !file.name.endsWith('.bmp')) {
          setFileError('Please upload a BMP file.');
          return;
        }
        setFileError('');
        const reader = new FileReader();
        reader.onloadend = () => {
          const image = new Image();
          image.src = reader.result;
  
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
  
            canvas.width = image.width;
            canvas.height = image.height;
  
            ctx.drawImage(image, 0, 0);
  
            const base64Data = canvas.toDataURL('image/bmp');
            const hashValue = fingerprint.x64hash128(base64Data, 31);
            setFormData((prevData) => ({
              ...prevData,
              file: hashValue,
            }));
          };
        };
  
        reader.readAsDataURL(file);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.register(parseInt(formData.uniqueId), formData.name, formData.file).send({ from: accounts[0] });
            setMessage('Registered');
        } catch (error) {
            setMessage(`Error during registration: ${error.message}`);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.transfer(parseInt(formData.recipientId), formData.file).send({ from: accounts[0], value: web3.utils.toWei(formData.amount, 'ether') });
            setMessage('Transfer successful');
        } catch (error) {
            setMessage(`Error during transfer: ${error.message}`);
        }
    };

    const getBalance = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const balance = await contract.methods.getBalance().call({ from: accounts[0] });
            setMessage(`Balance: ${balance}`);
        } catch (error) {
            setMessage(`Error getting balance: ${error.message}`);
        }
    };

    const getTransactions = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const transactions = await contract.methods.getTransactions().call({ from: accounts[0] });
            const transactionsStringified = transactions.map(tx => ({
                senderId: tx.senderId.toString(),
                recipientId: tx.recipientId.toString(),
                amount: tx.amount.toString(),
                timestamp: tx.date.toString(),
            }));
            setMessage(`Transactions: ${JSON.stringify(transactionsStringified)}`);
        } catch (error) {
            setMessage(`Error getting transactions: ${error.message}`);
        }
    };

    return (
      <Router>
            <div>
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home connectToMetamask={connectToMetamask} message={message} />} />
                        <Route path="/register" element={<Register handleInputChange={handleInputChange} handleRegister={handleRegister} formData={formData} fileError={fileError} />} />
                        <Route path="/transfer" element={<Transfer handleInputChange={handleInputChange} handleTransfer={handleTransfer} formData={formData} fileError={fileError} />} />
                        <Route path="/balance" element={<Balance getBalance={getBalance} message={message} />} />
                        <Route path="/transactions" element={<Transactions getTransactions={getTransactions} message={message} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;


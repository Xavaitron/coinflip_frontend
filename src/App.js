import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

function App() {
    const [walletAddress, setWalletAddress] = useState("");
    const [result, setResult] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const init = async () => {
            await connectWallet();
        };
        init();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);

            const contractAddress = 0xe22C453e9F4B7Ab875550200390B6381432bab2F;  
            const abi = [ {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "outcome",
                    "type": "bool"
                  }
                ],
                "name": "CoinFlipped",
                "type": "event"
              },
              {
                "inputs": [],
                "name": "flipCoin",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "owner",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              }
            ];
            const contractInstance = new ethers.Contract(contractAddress, abi, signer);
            console.log(contractInstance)
            setContract(contractInstance);
        } else {
            alert("Please install MetaMask!");
        }
    };

    const flipCoin = async () => {
        if (contract) {
            try {
                const tx = await contract.flipCoin();
                const receipt = await tx.wait();
                const outcome = receipt.events[0].args.outcome;
                setResult(outcome ? "Heads" : "Tails");
            } catch (error) {
                console.error("Coin flip failed:", error);
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Coin Flip Game</h1>
                {walletAddress ? (
                    <>
                        <p>Connected Wallet: {walletAddress}</p>
                        <button onClick={flipCoin}>Flip Coin</button>
                        {result && <p>Result: {result}</p>}
                    </>
                ) : (
                    <button onClick={connectWallet}>Connect Wallet</button>
                )}
            </header>
        </div>
    );
}

export default App;

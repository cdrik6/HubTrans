What is Solidity?
    Solidity is a programming language used to write smart contracts — programs that run on a blockchain.
    Think of smart contracts like backend APIs, but once deployed, they are immutable and decentralized.
    Example: You’ll write a Solidity contract that stores and updates tournament scores.

What is Avalanche?
    Avalanche is a blockchain platform, like Ethereum.
    It supports running smart contracts written in Solidity.
    Avalanche is known for being fast, cheap, and scalable.
    You'll deploy your Solidity smart contract on Avalanche's C-Chain (compatible with Ethereum).

Relation between Solidity and Avalanche
    You write your smart contract in Solidity.
    You deploy it to the Avalanche blockchain.
    Once deployed, you interact with the contract (e.g. to store/retrieve scores) using transactions.

How does this fit into a backend website?
To integrate the blockchain logic into your website, here’s the flow:
1. Frontend/Backend Tech (JavaScript, Node.js, React, etc.)
    Use web3.js, ethers.js, or Avalanche’s API in your backend to communicate with the contract.
2. Smart Contract Deployment (via Hardhat/Remix/Truffle)
    You compile and deploy your Solidity contract to Avalanche.
3. Interaction with Contract
    On your website:
        Users submit scores.
        Backend sends a transaction to the smart contract (through JSON-RPC or an SDK).
        The smart contract updates the score on the blockchain.
        Anyone can read scores from the blockchain — it's transparent.

Example Stack Component -> Tool
Smart contract -> Solidity
Blockchain -> Avalanche (C-Chain)
Contract deployment	-> Hardhat or Remix
Backend API	-> Node.js with ethers.js or web3
Frontend -> React or any HTML/JS frontend

https://www.youtube.com/watch?v=EhPeHeoKF88
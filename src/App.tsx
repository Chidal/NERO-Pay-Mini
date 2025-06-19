import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletConnect from './components/WalletConnect';
import PaymentForm from './components/PaymentForm';
import TransactionStatus from './components/TransactionStatus';
import { motion } from 'framer-motion';
import './App.css';

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [eoaAddress, setEoaAddress] = useState<string>('');
  const [aaAddress, setAaAddress] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string>('');
  const [userOpHash, setUserOpHash] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handleWalletConnected = async (eoaAddr: string, aaAddr: string, signer: ethers.Signer) => {
    try {
      setEoaAddress(eoaAddr);
      setAaAddress(aaAddr);
      setSigner(signer);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error handling wallet connection:', error);
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-primary mb-8"
      >
        NERO-Pay Mini
      </motion.h1>
      {!signer ? (
        <WalletConnect onWalletConnected={handleWalletConnected} />
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-600 mb-4"
          >
            Connected AA Address: {aaAddress}
          </motion.p>
          <PaymentForm signer={signer} aaAddress={aaAddress} />
          <TransactionStatus status={txStatus} userOpHash={userOpHash} transactionHash={transactionHash} />
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
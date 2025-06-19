import React, { useState, useEffect } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { ethers } from 'ethers';
import { getSigner, getAAWalletAddress } from '../utils/aaUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface WalletConnectProps {
  onWalletConnected: (eoaAddress: string, aaAddress: string, signer: ethers.Signer) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      const web3authInstance = new Web3Auth({
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
        chainConfig: {
          chainNamespace: 'eip155',
          chainId: '0x2b1', // 689 in hex
          rpcTarget: 'https://rpc-testnet.nerochain.io',
          displayName: 'NERO Testnet',
          blockExplorer: 'https://testnet.neroscan.io',
          ticker: 'NERO',
          tickerName: 'NERO',
        },
      });
      await web3authInstance.initModal();
      setWeb3auth(web3authInstance);
    };
    initWeb3Auth();
  }, []);

  const connectWallet = async (method: 'metamask' | 'social') => {
    setIsLoading(true);
    setError(null);
    try {
      let signer: ethers.Signer;
      let eoaAddress: string;
      if (method === 'metamask') {
        signer = await getSigner();
        eoaAddress = await signer.getAddress();
      } else {
        if (!web3auth) throw new Error('Web3Auth not initialized');
        await web3auth.connect();
        const provider = new ethers.providers.Web3Provider(web3auth.provider as any);
        signer = provider.getSigner();
        eoaAddress = await signer.getAddress();
      }
      const aaAddress = await getAAWalletAddress(signer);
      setIsConnected(true);
      onWalletConnected(eoaAddress, aaAddress, signer);
      toast.success('Wallet connected successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex space-x-4"
    >
      <button
        onClick={() => connectWallet('metamask')}
        disabled={isLoading}
        className="px-6 py-3 bg-primary text-white rounded-full hover:bg-secondary transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      <button
        onClick={() => connectWallet('social')}
        disabled={isLoading}
        className="px-6 py-3 bg-accent text-white rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'Connecting...' : 'Connect with Social'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </motion.div>
  );
};

export default WalletConnect;
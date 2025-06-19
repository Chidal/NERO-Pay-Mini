import React from 'react';
import { motion } from 'framer-motion';

interface TransactionStatusProps {
  status: string;
  userOpHash?: string;
  transactionHash?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, userOpHash, transactionHash }) => {
  if (!status) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-neutral rounded-lg p-4"
    >
      <p className="text-sm font-medium">
        Status: <span className={status.includes('Success') ? 'text-accent' : 'text-red-500'}>{status}</span>
      </p>
      {userOpHash && (
        <p className="text-xs mt-1 break-all">
          <span className="font-medium">UserOp Hash:</span> {userOpHash}
        </p>
      )}
      {transactionHash && (
        <p className="text-xs mt-1 break-all">
          <span className="font-medium">Transaction Hash:</span>{' '}
          <a
            href={`https://testnet.neroscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            {transactionHash}
          </a>
        </p>
      )}
    </motion.div>
  );
};

export default TransactionStatus;
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { executePayment } from '../utils/aaUtils';
import { getReadableErrorMessage } from '../utils/errorHandler';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import TokenSelector from './TokenSelector';

interface PaymentFormProps {
  signer: ethers.Signer | undefined;
  aaAddress: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ signer, aaAddress }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');

  const handlePayment = async () => {
    if (!signer || !recipient || !amount) {
      toast.error('Please connect wallet and fill all fields');
      return;
    }
    setIsLoading(true);
    setTxStatus('');
    try {
      const result = await executePayment(signer, recipient, amount, selectedToken || '0xStablecoinAddress', paymentType);
      setTxStatus(`Success! Transaction Hash: ${result.transactionHash}`);
      toast.success('Payment sent successfully!');
    } catch (error: any) {
      const errorMessage = getReadableErrorMessage(error);
      setTxStatus(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Send Payment</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient (Phone or Email)</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter phone or email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
          >
            <option value={0}>Sponsored (Free)</option>
            <option value={1}>Prepay with Token</option>
            <option value={2}>Postpay with Token</option>
          </select>
        </div>
        <TokenSelector paymentType={paymentType} onTokenSelect={setSelectedToken} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
          disabled={isLoading || !signer}
          className="w-full px-4 py-3 text-white font-medium rounded-full bg-accent hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Send Payment'}
        </motion.button>
        {txStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-sm ${txStatus.includes('Success') ? 'text-accent' : 'text-red-500'}`}
          >
            {txStatus}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentForm;
import React, { useState, useEffect } from 'react';
import { getSupportedTokens } from '../utils/aaUtils';
import { motion } from 'framer-motion';

interface TokenSelectorProps {
  paymentType: number;
  onTokenSelect: (tokenAddress: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ paymentType, onTokenSelect }) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');

  useEffect(() => {
    const fetchTokens = async () => {
      const supportedTokens = await getSupportedTokens();
      const filteredTokens = supportedTokens.filter(
        (token) => token.type == paymentType || (paymentType === 1 && token.prepay) || (paymentType === 2 && token.postpay)
      );
      setTokens(filteredTokens);
      if (filteredTokens.length > 0) {
        setSelectedToken(filteredTokens[0].address);
        onTokenSelect(filteredTokens[0].address);
      }
    };
    if (paymentType !== 0) fetchTokens();
    else setTokens([]);
  }, [paymentType, onTokenSelect]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      {tokens.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => {
              setSelectedToken(e.target.value);
              onTokenSelect(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary"
          >
            {tokens.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} ({token.address.slice(0, 6)}...)
              </option>
            ))}
          </select>
        </div>
      )}
    </motion.div>
  );
};

export default TokenSelector;
export const NERO_CHAIN_CONFIG = {
  rpcUrl: process.env.REACT_APP_NERO_RPC_URL || 'https://rpc-testnet.nerochain.io',
  chainId: 689,
};

export const AA_PLATFORM_CONFIG = {
  paymasterRpc: 'https://paymaster.nerochain.io', // Replace with actual Paymaster RPC
  bundlerRpc: 'https://bundler.nerochain.io', // Replace with actual Bundler RPC
};

export const CONTRACT_ADDRESSES = {
  entryPoint: '0xYourEntryPointAddress', // Replace with actual EntryPoint address
  accountFactory: '0xYourAccountFactoryAddress', // Replace with actual Account Factory address
};

export const API_KEY = process.env.REACT_APP_PAYMASTER_API_KEY || '';
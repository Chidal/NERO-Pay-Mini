import { ethers } from 'ethers';
import { Presets } from 'userop';
import { API_KEY, NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES } from '../config';

export const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error('No crypto wallet found. Please install MetaMask.');
  }
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('Connected wallet address:', address);
    return signer;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

export const getAAWalletAddress = async (accountSigner: ethers.Signer) => {
  try {
    if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
      throw new Error('Invalid signer object: must have a getAddress method');
    }
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
      accountSigner,
      NERO_CHAIN_CONFIG.rpcUrl,
      {
        overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
        entryPoint: CONTRACT_ADDRESSES.entryPoint,
        factory: CONTRACT_ADDRESSES.accountFactory,
      }
    );
    const address = await simpleAccount.getSender();
    console.log('AA wallet address:', address);
    return address;
  } catch (error) {
    console.error('Error getting AA wallet address:', error);
    throw error;
  }
};

export const initAABuilder = async (accountSigner: ethers.Signer, apiKey?: string) => {
  try {
    if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
      throw new Error('Invalid signer object: must have a getAddress method');
    }
    const builder = await Presets.Builder.SimpleAccount.init(
      accountSigner,
      NERO_CHAIN_CONFIG.rpcUrl,
      {
        overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
        entryPoint: CONTRACT_ADDRESSES.entryPoint,
        factory: CONTRACT_ADDRESSES.accountFactory,
      }
    );
    builder.setPaymasterOptions({
      apikey: apiKey || API_KEY,
      rpc: AA_PLATFORM_CONFIG.paymasterRpc,
      type: '0', // Default to sponsored gas
    });
    builder.setCallGasLimit(300000);
    builder.setVerificationGasLimit(2000000);
    builder.setPreVerificationGas(100000);
    return builder;
  } catch (error) {
    console.error('Error initializing AA builder:', error);
    throw error;
  }
};

export const setPaymentType = (builder: any, paymentType: number, tokenAddress: string = '') => {
  const paymasterOptions: any = {
    type: paymentType.toString(),
    apikey: API_KEY,
    rpc: AA_PLATFORM_CONFIG.paymasterRpc,
  };
  if (paymentType > 0 && tokenAddress) {
    paymasterOptions.token = tokenAddress;
  }
  builder.setPaymasterOptions(paymasterOptions);
  return builder;
};

export const executePayment = async (
  accountSigner: ethers.Signer,
  recipient: string,
  amount: string,
  tokenAddress: string,
  paymentType: number = 0
) => {
  try {
    const client = await Presets.Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
      overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    });
    const builder = await initAABuilder(accountSigner);
    if (paymentType > 0 && tokenAddress) {
      builder.setPaymasterOptions({
        apikey: API_KEY,
        rpc: AA_PLATFORM_CONFIG.paymasterRpc,
        type: paymentType.toString(),
        token: tokenAddress,
      });
    }
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl));
    const decimals = await contract.decimals();
    const amountInWei = ethers.utils.parseUnits(amount, decimals);
    const callData = contract.interface.encodeFunctionData('transfer', [recipient, amountInWei]);
    const userOp = await builder.execute(tokenAddress, 0, callData);
    const res = await client.sendUserOperation(userOp);
    console.log('UserOperation sent with hash:', res.userOpHash);
    const receipt = await res.wait();
    return {
      userOpHash: res.userOpHash,
      transactionHash: receipt?.transactionHash || '',
      receipt,
    };
  } catch (error) {
    console.error('Error executing payment:', error);
    throw error;
  }
};

export const getSupportedTokens = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.paymasterRpc);
    const minimalUserOp = {
      sender: '0x0000000000000000000000000000000000000000',
      nonce: '0x0',
      initCode: '0x',
      callData: '0x',
      callGasLimit: '0x88b8',
      verificationGasLimit: '0x33450',
      preVerificationGas: '0xc350',
      maxFeePerGas: '0x2162553062',
      maxPriorityFeePerGas: '0x40dbcf36',
      paymasterAndData: '0x',
      signature: '0x',
    };
    const tokensResponse = await provider.send('pm_supported_tokens', [
      minimalUserOp,
      API_KEY,
      CONTRACT_ADDRESSES.entryPoint,
    ]);
    const tokens = tokensResponse?.tokens || tokensResponse || [];
    return tokens.map((token: any) => ({
      address: token.token || token.address,
      decimal: parseInt(token.decimal || token.decimals || '18'),
      symbol: token.symbol,
      type: token.type !== undefined ? parseInt(token.type) : 1,
      price: token.price ? parseFloat(token.price) : undefined,
      prepay: token.prepay === true,
      postpay: token.postpay === true,
      freepay: token.freepay === true,
    }));
  } catch (error) {
    console.error('Error fetching supported tokens:', error);
    return [];
  }
};
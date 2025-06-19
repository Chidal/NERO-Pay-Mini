export const extractErrorCode = (error: any): string | null => {
  if (!error) return null;
  const errorMessage = error.message || error.toString();
  const aaMatch = errorMessage.match(/AA(\d\d)/);
  if (aaMatch) return `AA${aaMatch[1]}`;
  const pmMatch = errorMessage.match(/PM(\d\d)/);
  if (pmMatch) return `PM${pmMatch[1]}`;
  const failedOpMatch = errorMessage.match(/FailedOp\((\d+),\s*"([^"]*)"/);
  if (failedOpMatch) {
    const code = parseInt(failedOpMatch[1]);
    if (code >= 0 && code <= 99) {
      return `AA${code.toString().padStart(2, '0')}`;
    }
  }
  return null;
};

export const getReadableErrorMessage = (error: any): string => {
  const errorCode = extractErrorCode(error);
  const errorMessage = error.message || error.toString();
  if (errorCode) {
    return `Error ${errorCode}: Transaction failed. Please try again.`;
  }
  if (errorMessage.includes('insufficient funds')) {
    return 'Insufficient funds to execute this transaction';
  }
  if (errorMessage.includes('execution reverted')) {
    const revertMatch = errorMessage.match(/execution reverted: (.*?)($|")/);
    if (revertMatch) {
      return `Transaction reverted: ${revertMatch[1]}`;
    }
    return 'Transaction reverted - check the target contract';
  }
  return errorMessage;
};
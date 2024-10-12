import { tool } from '@langchain/core/tools';

export const currentWalletAddressTool = tool(
  () => 'STOP_CURRENT_WALLET_ADDRESS',
  {
    name: 'currentWalletAddress',
    description: 'Returns the address of the connected wallet',
  },
);

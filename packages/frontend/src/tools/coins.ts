import { tool } from '@langchain/core/tools';
import { z } from 'zod';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';

const searchCoinSchema = z.object({
  query: z
    .string()
    .describe(
      'The search query. Can be symbol (e.g., "APT", "USDC"), name, or any field in token_type',
    ),
});
export const searchCoinTool = tool(
  async ({ query }) => {
    const results = APTOS_MAINNET_COINS.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase()),
    );

    if (results.length === 0) {
      return 'No coins found matching the search criteria.';
    }

    return JSON.stringify(results, null, 2);
  },
  {
    name: 'searchCoin',
    description:
      'Search for coins by symbol, name, or token type fields. Coin data includes symbol, name, token type, and more metadata.',
    schema: searchCoinSchema,
  },
);

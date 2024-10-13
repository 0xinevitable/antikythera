import { tool } from '@langchain/core/tools';
import { z } from 'zod';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';
import { Brands } from '@/constants/brands';

export const searchCoinTool = tool(
  async ({ query }) => {
    const results = APTOS_MAINNET_COINS.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase()),
    );

    if (results.length === 0) {
      return JSON.stringify({
        error: 'No coins found matching the search criteria.',
      });
    }

    return JSON.stringify(results, null, 2);
  },
  {
    name: 'searchCoin',
    description:
      'Search for coins by symbol or name. Coin data includes symbol, name, token type, and more metadata.',
    schema: z.object({
      query: z
        .string()
        .describe(
          'The search query. Can be symbol (e.g., "APT", "USDC") or name.',
        ),
    }),
  },
);

export const getCoinTool = tool(
  async ({ coin_type }) => {
    const results = APTOS_MAINNET_COINS.filter((coin) =>
      coin.token_type.type.toLowerCase().includes(coin_type.toLowerCase()),
    );

    if (results.length === 0) {
      return JSON.stringify({
        error: 'No coins found with the given coin_type',
      });
    }

    return JSON.stringify(results, null, 2);
  },
  {
    name: 'getCoin',
    description:
      "Get a coin information with it's coin type. Coin data includes symbol, name, token type, and more metadata.",
    schema: z.object({
      coin_type: z
        .string()
        .describe(
          'The coin type to search for. (e.g., "0x1::aptos_coin::AptosCoin")',
        ),
    }),
  },
);

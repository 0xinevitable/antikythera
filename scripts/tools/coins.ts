import { tool } from '@langchain/core/tools';
import { z } from 'zod';

import { APTOS_MAINNET_COINS } from '../constants/aptos-coins';

const searchCoinSchema = z.object({
  query: z
    .string()
    .describe(
      'The search query. Can be symbol (e.g., "APT", "USDC"), name, or any field in token_type',
    ),
  field: z
    .enum([
      'symbol',
      'name',
      'token_type.type',
      'token_type.account_address',
      'token_type.module_name',
      'token_type.struct_name',
    ])
    .describe('The specific field to search in.'),
});
export const searchCoinTool = tool(
  async ({ query, field }) => {
    const searchInField = (
      coin: any,
      fieldPath: string,
      searchQuery: string,
    ) => {
      const value = fieldPath
        .split('.')
        .reduce((obj, key) => obj && obj[key], coin);
      return (
        typeof value === 'string' &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };

    const results = APTOS_MAINNET_COINS.filter((coin) => {
      if (field) {
        return searchInField(coin, field, query);
      } else {
        return (
          searchInField(coin, 'symbol', query) ||
          searchInField(coin, 'name', query) ||
          searchInField(coin, 'token_type.type', query) ||
          searchInField(coin, 'token_type.account_address', query) ||
          searchInField(coin, 'token_type.module_name', query) ||
          searchInField(coin, 'token_type.struct_name', query)
        );
      }
    });

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

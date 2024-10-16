import { tool } from '@langchain/core/tools';
import axios from 'axios';
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
      'Search for coins by symbol or name. Coin data includes symbol, name, token type, and more metadata. (Source: Nodit, Hippo Labs)',
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
    coin_type = coin_type.startsWith('0x') ? coin_type : `0x${coin_type}`;
    const result = APTOS_MAINNET_COINS.find(
      (coin) => coin.token_type.type.toLowerCase() === coin_type.toLowerCase(),
    );

    if (!result) {
      return JSON.stringify({
        error: 'No coins found with the given coin_type',
      });
    }

    return JSON.stringify([result], null, 2);
  },
  {
    name: 'getCoin',
    description:
      "Get a coin information with it's coin type. Coin data includes symbol, name, token type, and more metadata. (Source: Nodit, Hippo Labs)",
    schema: z.object({
      coin_type: z
        .string()
        .describe(
          'The coin type to search for. (e.g., "0x1::aptos_coin::AptosCoin")',
        ),
    }),
  },
);

interface CoinBalance {
  amount: number;
  metadata: {
    asset_type: string;
  };
}

interface FetchCoinBalancesResponse {
  data: {
    current_fungible_asset_balances: CoinBalance[];
  };
}

async function fetchCoinBalances(
  accountAddress: string,
  limit: number = 10,
): Promise<CoinBalance[]> {
  const url =
    'https://aptos-mainnet.nodit.io/4_c~5EHF2Z6hvc8K-MH2H_CW5Wtoe7BI/v1/graphql';

  const query = `
    query FetchCoinBalances($owner_address: String!, $limit: Int!) {
      current_fungible_asset_balances(
        limit: $limit
        where: {
          owner_address: {
            _eq: $owner_address
          },
          metadata: {
            asset_type: {
              _is_null: false
            }
          }
        }
      ) {
        amount
        metadata {
          asset_type
        }
      }
    }
  `;

  try {
    const response = await axios.post<FetchCoinBalancesResponse>(url, {
      query,
      variables: {
        owner_address: accountAddress,
        limit,
      },
    });

    return response.data.data.current_fungible_asset_balances;
  } catch (error) {
    console.error('Error fetching coin balances:', error);
    throw error;
  }
}

export const getBalanceTool = tool(
  async ({ address }) => {
    try {
      const balances = await fetchCoinBalances(address);
      return JSON.stringify(balances, null, 2);
    } catch (error) {
      return JSON.stringify({
        error: (error as Error)?.message || 'Error fetching coin balances',
      });
    }
  },
  {
    name: 'getBalance',
    description: 'Get token balances of an Aptos Wallet Address',
    schema: z.object({
      address: z
        .string()
        .describe('The address to query balance for (starts with 0x)'),
    }),
  },
);

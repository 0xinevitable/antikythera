import { tool } from '@langchain/core/tools';
import axios from 'axios';
import queryString from 'query-string';
import { z } from 'zod';

export type KanaSwapQuoteResponse = {
  status: string;
  cacheInfo: string;
  message: string;
  data: KanaSwapRouteOption[];
};

export type KanaSwapRouteOption = {
  chainId: number;
  sourceToken: string;
  targetToken: string;
  amountIn: string;
  amountOut: string;
  minimumOutAmount: string;
  amountOutWithSlippage: string;
  steps: number;
  stepTokens: string[];
  stepAmounts: string[];
  provider: string;
  protocols: string[];
  slippage: number;
  route: KanaSwapRoute;
  kanaFee: number;
  sourceTokenInUSD: string;
  targetTokenInUSD: string;
  sourceTokenPrice: number;
  targetTokenPrice: number;
  priceImpact: number;
};

export type KanaSwapRoute = {
  markets: KanaSwapMarket[];
  coinX: string;
  coinY: string;
  amountIn: string;
  amountOut: string;
  amountOutWithSlippage: string;
  finalOutAmount: string;
  isFeeReferrer: boolean;
  integratorFee: string;
  kanaFee: string;
  slippage: string;
  is_fee_coin_in: boolean;
};

export type KanaSwapMarket = {
  coinX: string;
  coinY: string;
  amountIn: string;
  amountOut: string;
  direction: boolean;
  provider: string;
  curve: string;
  curveType: string;
  pool: string;
};

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const kanaSwapQuoteTool = tool(
  async ({ inputToken, outputToken, amountIn, slippage }) => {
    try {
      const {
        data: { data: results },
      } = await axios.get<KanaSwapQuoteResponse>(
        queryString.stringifyUrl({
          url: 'https://ag.kanalabs.io/v1/swapQuote',
          query: {
            inputToken,
            outputToken,
            chain: 2,
            amountIn,
            slippage,
          },
        }),
      );

      const foundRoutes: Omit<KanaSwapRouteOption, 'chainId'>[] = [];
      const hashSet = new Set<string>();

      for (const { chainId, ...route } of results) {
        const hash = cyrb53(JSON.stringify(route));
        if (!hashSet.has(hash.toString())) {
          hashSet.add(hash.toString());
          foundRoutes.push(route);
        }
      }

      return JSON.stringify({ foundRoutes });
    } catch (error) {
      console.log(error);
      return JSON.stringify({
        error: `Error querying TVL: ${(error as Error).message}`,
      });
    }
  },
  {
    name: 'kanaSwapQuote',
    description: 'Get the best rate for a swap with DEX Aggregator in KanaSwap',
    schema: z.object({
      inputToken: z
        .string()
        .describe(
          'The full coin type of the token to swap from (e.g., "0x1::aptos_coin::AptosCoin")',
        ),
      outputToken: z
        .string()
        .describe(
          'The full coin type of the token to swap to (e.g., "0x1::aptos_coin::AptosCoin")',
        ),
      amountIn: z
        .number()
        .describe(
          'The amount of input token to swap. Parsed Units (e.g., 1000000000 for 1 APT with 9 decimals)',
        ),
      slippage: z.number().describe('The slippage tolerance (e.g., 0.5)'),
    }),
  },
);

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

export const kanaSwapQuoteTool = tool(
  async ({ inputToken, outputToken, amountIn, slippage }) => {
    try {
      const {
        data: { data: foundRoutes },
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
      return JSON.stringify({
        foundRoutes: foundRoutes.map(({ chainId, ...v }) => v),
      });
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
        .describe('The amount of input token to swap. Parsed Units'),
      slippage: z.number().describe('The slippage tolerance (e.g., 0.5)'),
    }),
  },
);

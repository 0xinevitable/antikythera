import { Network } from '@aptos-labs/ts-sdk';
import { Aptos, AptosConfig, MoveFunctionVisibility } from '@aptos-labs/ts-sdk';
import { tool } from '@langchain/core/tools';
import { ThalaswapRouter } from '@thalalabs/router-sdk';
import path from 'path';
import { z } from 'zod';

import { ThalaSwapPackageId } from '../vectorstore-abi';
import { loadOrCreateVectorStore } from '../vectorstore-abi';

// Initialize the ThalaSwap Router
const router = new ThalaswapRouter(
  Network.MAINNET,
  'https://fullnode.mainnet.aptoslabs.com/v1',
  '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af',
  '0x60955b957956d79bc80b096d3e41bad525dd400d8ce957cdeb05719ed1e4fc26',
);

const findSwapRouteSchema = z.object({
  fromTokenType: z
    .string()
    .describe(
      'The full coin type of the token to swap from (e.g., "0x1::aptos_coin::AptosCoin")',
    ),
  toTokenType: z
    .string()
    .describe('The full coin type of the token to swap to'),
  amountIn: z
    .number()
    .positive()
    .describe('The amount of fromToken to swap. Formatted units.'),
});

const findSwapRouteTool = tool(
  async ({ fromTokenType: fromToken, toTokenType: toToken, amountIn }) => {
    try {
      const route = await router.getRouteGivenExactInput(
        fromToken,
        toToken,
        amountIn,
      );

      if (!route) {
        return 'No valid route found for the given swap parameters.';
      }

      return JSON.stringify(route, null, 2);
    } catch (error) {
      return `Error finding swap route: ${(error as Error).message}`;
    }
  },
  {
    name: 'findSwapRoute',
    description: 'Find optimal swap route for ThalaSwap',
    schema: findSwapRouteSchema,
  },
);

const thalaSwapABISchema = z.object({
  query: z
    .string()
    .optional()
    .describe('Optional query to search for specific functions in the ABI'),
  limit: z
    .number()
    .int()
    .positive()
    .default(1)
    .describe('Number of results to return for each category'),
});

const thalaSwapABITool = tool(
  async ({ query, limit }) => {
    try {
      const config = new AptosConfig({ network: Network.MAINNET });
      const aptos = new Aptos(config);
      const modules = await aptos.getAccountModules({
        accountAddress: ThalaSwapPackageId,
      });

      const packageId = path.basename(ThalaSwapPackageId);

      const allAbis = modules.flatMap((module) => {
        if (!module.abi) {
          return [];
        }
        const { address: _address, ...abi } = module.abi;
        return abi.exposed_functions.flatMap((func) => {
          if (func.visibility === MoveFunctionVisibility.PUBLIC) {
            return { module: module.abi!.name, ...func, is_view: func.is_view };
          }
          return [];
        });
      });

      const viewAbis = allAbis.filter((abi) => abi.is_view);
      const nonViewAbis = allAbis.filter((abi) => !abi.is_view);

      const viewVectorStore = await loadOrCreateVectorStore(
        packageId,
        true,
        viewAbis,
      );
      const nonViewVectorStore = await loadOrCreateVectorStore(
        packageId,
        false,
        nonViewAbis,
      );

      if (query) {
        const viewResults = await viewVectorStore.similaritySearch(
          query,
          limit,
        );
        const nonViewResults = await nonViewVectorStore.similaritySearch(
          query,
          limit,
        );

        return JSON.stringify(
          {
            viewFunctions: viewResults.map((r) => JSON.parse(r.pageContent)),
            nonViewFunctions: nonViewResults.map((r) =>
              JSON.parse(r.pageContent),
            ),
          },
          null,
          2,
        );
      } else {
        return JSON.stringify(
          {
            viewFunctions: viewAbis,
            nonViewFunctions: nonViewAbis,
          },
          null,
          2,
        );
      }
    } catch (error) {
      return `Error fetching or processing ThalaSwap ABI: ${(error as any).message}`;
    }
  },
  {
    name: 'getThalaSwapABI',
    description:
      'Fetch and search ThalaSwap ABI, separating view and non-view functions',
    schema: thalaSwapABISchema,
  },
);

export { findSwapRouteTool, thalaSwapABITool };

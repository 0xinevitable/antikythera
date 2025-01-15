import {
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from '@aptos-labs/ts-sdk';
import { Environment, NetworkId, SwapAggregator } from '@kanalabs/aggregator';
import { tool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import * as dotenv from 'dotenv';
import 'dotenv/config';
import { formatUnits } from 'viem';
import { z } from 'zod';

import { getBalanceOfAddressTool, getCoinTool, searchCoinTool } from './coins';
import { chainTVLTool, listChainProtocolsTool } from './defillama';
import { listEchelonMarketsTool } from './echelon';
import { kanaSwapQuoteTool } from './kanaswap';
import { formatUnitsTool, parseUnitsTool } from './units';

const APTOS_COIN_DECIMALS = 8;

dotenv.config();

// FIXME: Move + Refactor tx building tools soon

// Initialize Aptos client
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptosClient = new Aptos(aptosConfig);

// Create account from private key
const defaultAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY || ''),
  legacy: true,
});

const KanaSwapAggregator = new SwapAggregator(Environment.production, {
  providers: {
    aptos: aptosClient,
  },
  signers: {
    // (transaction: any, options?: any): Promise<{
    //         hash: Types.HexEncodedBytes;
    //     } | AptosWalletErrorResult>;
    aptos: async (transaction: any, options?: any) => {
      // transaction: {
      //   data: {
      //     function: '0x9538c839fe490ccfaf32ad9f7491b5e84e610ff6edc110ff883f06ebde82463d::KanalabsRouterV2::swap',
      //     typeArguments: [Array],
      //     functionArguments: [Array]
      //   }
      // },
      // options: undefined
      console.log(transaction, options);
      console.log({ transaction, options });
      const rawTransaction = await aptosClient.transaction.build.simple({
        ...transaction,
      });
      return aptosClient.signAndSubmitTransaction({
        transaction: rawTransaction,
        signer: defaultAccount,
      });
    },
  },
});

// Helper function for transactions
async function submitTransaction(transaction: AnyRawTransaction) {
  const pendingTxn = await aptosClient.signAndSubmitTransaction({
    signer: defaultAccount,
    transaction,
  });

  const response = await aptosClient.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });

  return { pendingTxn, response };
}

// Basic Wallet Tools
const getBalanceTool = tool(
  async () => {
    try {
      const balance = await aptosClient.getAccountAPTAmount({
        accountAddress: defaultAccount.accountAddress,
      });
      return `Current balance: ${formatUnits(BigInt(balance), APTOS_COIN_DECIMALS)} APT`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  },
  {
    name: 'get_balance',
    description: 'Get the APT balance of my wallet',
    schema: z.object({}),
  },
);

const transferTool = tool(
  async ({ recipient, amount }) => {
    try {
      const transaction = await aptosClient.transaction.build.simple({
        sender: defaultAccount.accountAddress,
        data: {
          function: '0x1::aptos_account::transfer',
          functionArguments: [recipient, BigInt(amount)],
        },
      });

      const { pendingTxn, response } = await submitTransaction(transaction);

      if (response.success) {
        return `Transfer successful! Transaction hash: ${pendingTxn.hash}`;
      } else {
        return `Transfer failed. Transaction hash: ${pendingTxn.hash}`;
      }
    } catch (error) {
      return `Error during transfer: ${error}`;
    }
  },
  {
    name: 'transfer_apt',
    description: 'Transfer APT to another address',
    schema: z.object({
      recipient: z.string().describe('Recipient address starting with 0x'),
      amount: z.string().describe('Amount of APT to transfer (in octas)'),
    }),
  },
);

// ANS Tools
const registerNameTool = tool(
  async ({ name, expirationType, toAddress }) => {
    if (expirationType !== 'domain') {
      return 'Only domain expiration policy is supported for now';
    }
    try {
      const transaction = await aptosClient.registerName({
        sender: defaultAccount,
        name: name,
        expiration: { policy: expirationType },
        ...(toAddress && { toAddress }),
      });

      const { pendingTxn, response } = await submitTransaction(transaction);

      if (response.success) {
        return `Successfully registered ${name}! Transaction hash: ${pendingTxn.hash}.`;
      } else {
        return `Failed to register ${name}. Transaction hash: ${pendingTxn.hash}. ${JSON.stringify(response)}`;
      }
    } catch (error) {
      return `Error registering name: ${error}`;
    }
  },
  {
    name: 'register_name',
    description: 'Register a new ANS name (domain or subdomain)',
    schema: z.object({
      name: z
        .string()
        .describe('Name to register (with or without .apt suffix)'),
      expirationType: z
        .enum(['domain', 'subdomain:follow-domain', 'subdomain:independent'])
        .describe('Expiration policy for the name'),
      toAddress: z
        .string()
        .optional()
        .describe('Optional address to transfer the name to'),
    }),
  },
);

const getNameInfoTool = tool(
  async ({ name }) => {
    try {
      const nameInfo = await aptosClient.getName({ name });
      if (!nameInfo) {
        return `No information found for ${name}`;
      }
      return JSON.stringify(nameInfo, null, 2);
    } catch (error) {
      return `Error getting name information: ${error}`;
    }
  },
  {
    name: 'get_name_info',
    description: 'Get information about an ANS name',
    schema: z.object({
      name: z.string().describe('Name to query (with or without .apt suffix)'),
    }),
  },
);

const setPrimaryNameTool = tool(
  async ({ name }) => {
    try {
      const transaction = await aptosClient.setPrimaryName({
        sender: defaultAccount,
        name: name,
      });

      const { pendingTxn, response } = await submitTransaction(transaction);

      if (response.success) {
        return `Successfully set ${name} as primary name! Transaction hash: ${pendingTxn.hash}`;
      } else {
        return `Failed to set primary name. Transaction hash: ${pendingTxn.hash}`;
      }
    } catch (error) {
      return `Error setting primary name: ${error}`;
    }
  },
  {
    name: 'set_primary_name',
    description: 'Set a name as the primary name for the account',
    schema: z.object({
      name: z.string().describe('Name to set as primary'),
    }),
  },
);

const getAccountNamesTool = tool(
  async ({ address }) => {
    try {
      const names = await aptosClient.getAccountNames({
        accountAddress: address,
      });
      return JSON.stringify(names, null, 2);
    } catch (error) {
      return `Error getting account names: ${error}`;
    }
  },
  {
    name: 'get_account_names',
    description: 'Get all names owned by an account',
    schema: z.object({
      address: z.string().describe('Account address to query'),
    }),
  },
);

export const kanaSwapQuoteTool2 = tool(
  async ({ inputToken, outputToken, amountIn, slippage }) => {
    try {
      const quote = await KanaSwapAggregator.swapQuotes({
        apiKey: process.env.KANA_API_KEY || '',
        inputToken: inputToken,
        outputToken: outputToken,
        amountIn: amountIn,
        slippage: slippage,
        network: NetworkId.aptos,
        options: {
          // integratorAddress: '0x000...........', // if ur an integrator and want to collect fee then u can pass ur address here
          // is_fee_coin_in: true, // u can pass this one as true if u want collect fee from input Token , but by Default it will be false (Output Token)
          // isFeeReferrer: true, // this one should be true , if integrator wants to collect fee
        },
      });

      // const foundRoutes: Omit<KanaSwapRouteOption, 'chainId'>[] = [];
      // const hashSet = new Set<string>();

      // for (const { chainId, ...route } of results) {
      //   const hash = cyrb53(JSON.stringify(route));
      //   if (!hashSet.has(hash.toString())) {
      //     hashSet.add(hash.toString());
      //     foundRoutes.push(route);
      //   }
      // }

      return JSON.stringify({ foundRoutes: quote.data });
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
        .string()
        .describe(
          'The amount of input token to swap. Parsed Units (e.g., "100000000" for 1 APT with 8 decimals)',
        ),
      slippage: z.number().describe('The slippage tolerance (e.g., 0.5)'),
    }),
  },
);

const executeKanaSwapTool = tool(
  async ({ kanaSwapQuote }) => {
    try {
      const executeSwap = await KanaSwapAggregator.executeSwapInstruction({
        apiKey: process.env.KANA_API_KEY || '',
        quote: {
          chainId: 2, // ('aptos' = 2) on KanaChainID
          ...kanaSwapQuote,
        },
        address: defaultAccount.accountAddress.toString(),
      });

      return JSON.stringify(executeSwap, null, 2);
    } catch (error) {
      return JSON.stringify({
        error: `Error querying TVL: ${(error as Error).message}`,
      });
    }
  },
  {
    name: 'ExecuteKanaSwapTool',
    description:
      'Execute a swap with a DEX Aggregator in KanaSwap with my wallet',
    schema: z.object({
      kanaSwapQuote: z
        .any()
        .describe(
          'KanaSwap Quote object (sourceToken,targetToken,amountIn,amountOut,amountOutWithSlippage,steps,stepToke,stepAmoun,provider,protocols,slippage,minimumOutAmount?,route,estimatedGas?,integratorFee?,kanaFee?,finalAmountOut?,finalAmountOutMin?,maximumGasFee?,feeObject?}',
        ),
    }),
  },
);

// Combine all tools
export const tools = [
  getBalanceTool,
  transferTool,
  registerNameTool,
  getNameInfoTool,
  setPrimaryNameTool,
  getAccountNamesTool,
  executeKanaSwapTool,
  //

  // getBalanceOfAddressTool,
  getCoinTool,
  searchCoinTool,
  chainTVLTool,
  listChainProtocolsTool,
  listEchelonMarketsTool,
  // kanaSwapQuoteTool2,
  kanaSwapQuoteTool,
  formatUnitsTool,
  parseUnitsTool,
];

export const toolNode = new ToolNode(tools, {
  tags: ['tool_llm'],
});

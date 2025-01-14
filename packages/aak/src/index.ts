import {
  APTOS_COIN,
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from '@aptos-labs/ts-sdk';
import { ChatAnthropic } from '@langchain/anthropic';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { StateGraph } from '@langchain/langgraph';
import {
  Annotation,
  MemorySaver,
  messagesStateReducer,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Initialize Aptos client for both mainnet and testnet
const testnetConfig = new AptosConfig({ network: Network.TESTNET });
const testnetClient = new Aptos(testnetConfig);

// const mainnetConfig = new AptosConfig({ network: Network.MAINNET });
// const mainnetClient = new Aptos(mainnetConfig);

// Create account from private key in environment variables
const defaultAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY || ''),
});

// Define the graph state
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
});

// Helper function to handle transaction submission
async function submitTransaction(transaction: AnyRawTransaction) {
  const pendingTxn = await testnetClient.signAndSubmitTransaction({
    signer: defaultAccount,
    transaction,
  });

  const response = await testnetClient.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });

  return { pendingTxn, response };
}

// Basic Wallet Tools
const getBalanceTool = tool(
  async () => {
    try {
      const balance = await testnetClient.getAccountAPTAmount({
        accountAddress: defaultAccount.accountAddress,
      });
      return `Current balance: ${balance.toString()} APT`;
    } catch (error) {
      return `Error getting balance: ${error}`;
    }
  },
  {
    name: 'get_balance',
    description: 'Get the APT balance of the wallet',
    schema: z.object({}),
  },
);

const transferTool = tool(
  async ({ recipient, amount }) => {
    try {
      const transaction = await testnetClient.transaction.build.simple({
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
      const transaction = await testnetClient.registerName({
        sender: defaultAccount,
        name: name,
        expiration: { policy: expirationType },
        ...(toAddress && { toAddress }),
      });

      const { pendingTxn, response } = await submitTransaction(transaction);

      if (response.success) {
        return `Successfully registered ${name}! Transaction hash: ${pendingTxn.hash}`;
      } else {
        return `Failed to register ${name}. Transaction hash: ${pendingTxn.hash}`;
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
      const nameInfo = await testnetClient.getName({ name });
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
      const transaction = await testnetClient.setPrimaryName({
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
      const names = await testnetClient.getAccountNames({
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

// Combine all tools
const tools = [
  getBalanceTool,
  transferTool,
  registerNameTool,
  getNameInfoTool,
  setPrimaryNameTool,
  getAccountNamesTool,
];
const toolNode = new ToolNode(tools);

// Initialize the model with tools
const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20240620',
  temperature: 0,
}).bindTools(tools);

// Define the routing logic
function shouldContinue(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    return 'tools';
  }
  return '__end__';
}

// Define the model calling function
async function callModel(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const response = await model.invoke(messages);
  return { messages: [response] };
}

// Create and configure the graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('agent', callModel)
  .addNode('tools', toolNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue)
  .addEdge('tools', 'agent');

// Initialize memory
const checkpointer = new MemorySaver();

// Main function to run the agent
const main = async () => {
  const app = workflow.compile({ checkpointer });

  // Example interactions with the agent
  const queries = [
    // 'What is my current APT balance?',
    'I want to use a new domain name test3rff123.apt',
    // 'Set test123.apt as my primary name',
    // 'Show me all the names owned by my address',
  ];

  for (const query of queries) {
    const finalState = await app.invoke(
      {
        messages: [new HumanMessage(query)],
      },
      { configurable: { thread_id: `aptos-wallet-${Date.now()}` } },
    );

    console.log(`Query: ${query}`);
    console.log(
      'Response:',
      finalState.messages[finalState.messages.length - 1].content,
    );
    console.log('---');
  }
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

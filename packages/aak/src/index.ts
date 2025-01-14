import {
  Account,
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
import { formatUnits } from 'viem';
import { z } from 'zod';

const APTOS_COIN_DECIMALS = 8;

dotenv.config();

// Initialize Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

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

// Tool to query account balance
const getBalanceTool = tool(
  async () => {
    try {
      const balance = await aptos.getAccountAPTAmount({
        accountAddress: defaultAccount.accountAddress,
      });
      const formattedBalance = formatUnits(
        BigInt(balance),
        APTOS_COIN_DECIMALS,
      );
      return `Current balance: ${formattedBalance} APT`;
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

// Tool to transfer APT
const transferTool = tool(
  async ({ recipient, amount }) => {
    try {
      // Build transaction
      const transaction = await aptos.transaction.build.simple({
        sender: defaultAccount.accountAddress,
        data: {
          function: '0x1::aptos_account::transfer',
          functionArguments: [recipient, BigInt(amount)],
        },
      });

      // Sign and submit transaction
      const pendingTxn = await aptos.signAndSubmitTransaction({
        signer: defaultAccount,
        transaction,
      });

      // Wait for transaction completion
      const response = await aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });

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

// Combine all tools
const tools = [getBalanceTool, transferTool];
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

  // Example usage
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage('What is my current APT balance?')],
    },
    { configurable: { thread_id: 'aptos-wallet-1' } },
  );

  // console.log(finalState.messages[finalState.messages.length - 1].content);

  // print all messages
  finalState.messages.forEach((message) => {
    console.log(message.content);
  });
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

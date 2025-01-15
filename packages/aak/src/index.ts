import {
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from '@aptos-labs/ts-sdk';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { Annotation, MemorySaver } from '@langchain/langgraph';
import * as dotenv from 'dotenv';

import { tools } from './tools';

dotenv.config();

// Initialize Aptos client
const testnetConfig = new AptosConfig({ network: Network.TESTNET });
const testnetClient = new Aptos(testnetConfig);

// Create account from private key
const defaultAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVATE_KEY || ''),
});

// Helper function for transactions
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

// Define the state schema
const PlanExecuteState = Annotation.Root({
  input: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
  }),
  plan: Annotation<string[]>({
    reducer: (x, y) => y ?? x ?? [],
  }),
  pastSteps: Annotation<[string, string][]>({
    reducer: (x, y) => x.concat(y),
  }),
  response: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
});

// Initialize the model
const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20240620',
  temperature: 0,
}).bindTools(tools);

// Planning step
async function planStep(
  state: typeof PlanExecuteState.State,
): Promise<Partial<typeof PlanExecuteState.State>> {
  const plannerPrompt = `Create a specific step-by-step plan for the following crypto operation. Each step should map to one of these available operations:

  Available operations:
  - Check wallet balance
  - Transfer APT tokens
  - Register ANS name
  - Get ANS name info
  - Set primary ANS name
  - Get account ANS names

  Operation requested: ${state.input}

  Return only the numbered steps, each on a new line.`;

  const response = await model.invoke([new HumanMessage(plannerPrompt)]);
  const content = response.content.toString();

  // Extract numbered steps
  const steps = content
    .split('\n')
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((step) => step.length > 0);

  return { plan: steps };
}

// Execution step
async function executeStep(
  state: typeof PlanExecuteState.State,
): Promise<Partial<typeof PlanExecuteState.State>> {
  const currentStep = state.plan[0];

  // Get tool execution plan from LLM
  const toolSelectionPrompt = `Given this operation: "${currentStep}"
  Determine the appropriate tool to use and its parameters.
  Available tools:
  - get_balance: Get wallet balance
  - transfer_apt: Transfer APT (needs recipient and amount)
  - register_name: Register ANS name (needs name and expirationType)
  - get_name_info: Get ANS name info (needs name)
  - set_primary_name: Set primary name (needs name)
  - get_account_names: Get account names (needs address)`;

  const toolPlan = await model.invoke([new HumanMessage(toolSelectionPrompt)]);
  const toolResponse = await model.invoke([new HumanMessage(currentStep)]);

  let result = '';

  try {
    if (toolResponse.tool_calls && toolResponse.tool_calls.length > 0) {
      const toolCall = toolResponse.tool_calls[0];

      // Match tool name to function
      const tool = tools.find((t) => t.name === toolCall.name);
      if (tool) {
        // @ts-ignore
        result = await tool.invoke(toolCall.args);
      } else {
        result = 'Error: Tool not found';
      }
    } else {
      // Fallback to direct model response
      result =
        typeof toolResponse.content === 'string'
          ? toolResponse.content
          : JSON.stringify(toolResponse.content);
    }
  } catch (error) {
    result = `Error executing operation: ${(error as Error).message}`;
  }

  return {
    pastSteps: [[currentStep, result]],
    plan: state.plan.slice(1),
  };
}

// Re-planning step
async function replanStep(
  state: typeof PlanExecuteState.State,
): Promise<Partial<typeof PlanExecuteState.State>> {
  if (state.plan.length === 0) {
    const results = state.pastSteps
      .map(([step, result]) => {
        return `${step}: ${result}`;
      })
      .join('\n');

    return {
      response: `Operation results:\n${results}`,
    };
  }

  return { plan: state.plan };
}

// Define when to end
function shouldEnd(state: typeof PlanExecuteState.State) {
  return state.response ? 'true' : 'false';
}

// Create and configure the graph
const workflow = new StateGraph(PlanExecuteState)
  .addNode('planner', planStep)
  .addNode('agent', executeStep)
  .addNode('replan', replanStep)
  .addEdge('__start__', 'planner')
  .addEdge('planner', 'agent')
  .addEdge('agent', 'replan')
  .addConditionalEdges('replan', shouldEnd, {
    true: '__end__',
    false: 'agent',
  });

// Initialize memory
const checkpointer = new MemorySaver();

// Main function
const main = async () => {
  const app = workflow.compile({ checkpointer });

  const query = 'Check wallet balance and register aptos.apt domain';

  const finalState = await app.invoke(
    { input: query },
    {
      configurable: { thread_id: `aptos-wallet-${Date.now()}` },
    },
  );

  console.log('Final State:', JSON.stringify(finalState, null, 2));
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

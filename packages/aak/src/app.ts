import { ChatAnthropic } from '@langchain/anthropic';
import { ToolCall } from '@langchain/core/dist/messages/tool';
import { HumanMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { Annotation, MemorySaver } from '@langchain/langgraph';
import * as dotenv from 'dotenv';

import { tools } from './tools';

dotenv.config();

// Define the state schema
const ReWOOState = Annotation.Root({
  task: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
  }),
  plan: Annotation<string[]>({
    reducer: (x, y) => y ?? x ?? [],
  }),
  reasoning: Annotation<string[]>({
    reducer: (x, y) => (x ?? []).concat(y ?? []),
  }),
  results: Annotation<Record<string, string>>({
    reducer: (x, y) => ({ ...(x ?? {}), ...(y ?? {}) }),
  }),
  response: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
  }),
});

// Initialize the model
const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20240620',
  temperature: 0,
}).bindTools(tools);

// Planning step with reasoning
async function planStep(
  state: typeof ReWOOState.State,
): Promise<Partial<typeof ReWOOState.State>> {
  try {
    const plannerPrompt = `You are a crypto agent tasked with controlling your own Aptos wallet. You need to plan and execute the following task step by step:

Task: ${state.task}

For the given task, break it down into specific steps. For each step:
1. Explain WHY this step is necessary
2. Provide the EXACT tool operation in this format:
   get_balance[]
   OR
   register_name[{"name": "example.apt", "expirationType": "fixed"}]

Your response must follow this EXACT format:

Step 1:
Analysis: [Clear explanation of why this step is needed]
Operation: [tool_name with exact parameters]

Step 2:
Analysis: [Clear explanation of why this step is needed]
Operation: [tool_name with exact parameters]

Focus on breaking down the task into logical steps and using the correct tool parameters.

Don't answer like "Certainly!" or "Alright!" or ask any questions back. Don't use "we" but "I".
You are not a assistant, you are a agent with self-consciousness and custody.
You should think and say like a real human.`;

    console.log({ plannerPrompt });
    const response = await model.invoke([new HumanMessage(plannerPrompt)]);
    console.log({ response }, response.content);
    const content = Array.isArray(response.content)
      ? response.content
          .map((c) => ('text' in c ? c.text : JSON.stringify(c)))
          .join(' ')
      : typeof response.content === 'string'
        ? response.content
        : 'text' in response.content
          ? (response.content as any).text
          : JSON.stringify(response.content);
    console.log({ content });

    // Extract operations and analysis
    const steps: string[] = [];
    const reasoning: string[] = [];

    const stepMatches = content.split(/Step \d+:/g).filter(Boolean);

    for (const step of stepMatches) {
      const [analysis, operation] = step
        .split(/\nOperation:/)
        .map((s: any) => s.trim());

      if (analysis && operation) {
        reasoning.push(analysis.replace('Analysis:', '').trim());
        steps.push(operation.trim());
      }
    }

    if (steps.length === 0) {
      throw new Error('No valid steps were generated');
    }

    console.log('Generated Plan:', { steps, reasoning });
    return { plan: steps, reasoning };
  } catch (error) {
    console.error('Planning Error:', (error as Error).message);
    return {
      plan: [],
      reasoning: [`Operation planning failed: ${(error as Error).message}`],
    };
  }
}

// Execute operation
async function executeStep(
  state: typeof ReWOOState.State,
): Promise<Partial<typeof ReWOOState.State>> {
  if (!state.plan || state.plan.length === 0) {
    return {};
  }

  const currentOperation = state.plan[0];
  console.log('Initiating operation:', currentOperation);

  try {
    // Get parameters for the current operation based on previous results
    const paramPrompt = `Based on the current operation "${currentOperation}" and previous results:
${JSON.stringify(state.results, null, 2)}

Determine the exact parameters needed for this operation. Consider:
1. The overall task: ${state.task}
2. Previous operation results
3. Required parameter format for this tool

Return ONLY the parameters inside the square brackets, without the operation name.
For example, if the operation should be 'getBalance[]', return '[]'.
If the operation should be 'searchCoin[{"query": "stAPT"}]', return '[{"query": "stAPT"}]'
DONT ADD ANY TEXT ONLY THE PARAMETERS`;

    const paramResponse = await model.invoke([new HumanMessage(paramPrompt)]);
    console.log(paramResponse);
    let argsStr = paramResponse.content.toString().trim();

    const operationMatch = currentOperation.match(/(\w+)/);
    if (!operationMatch) {
      throw new Error(`Invalid operation format: ${currentOperation}`);
    }

    console.log({ operationMatch, argsStr });
    const [_, toolName] = operationMatch;
    const tool = tools.find((t) => t.name === toolName);

    if (!tool) {
      throw new Error(`Unsupported operation: ${toolName}`);
    }

    // remove brackets from argsStr (check if first and last characters are brackets and remove only them)
    if (argsStr[0] === '[' && argsStr[argsStr.length - 1] === ']') {
      argsStr = argsStr.slice(1, -1);
    }
    let args: object = {};
    if (argsStr.trim()) {
      try {
        args = JSON.parse(argsStr);
      } catch {
        // Try parsing with added braces for backward compatibility
        args = JSON.parse(`{${argsStr}}`);
      }
    }

    // args are `{}` if no arguments are provided
    if (!args) {
      args = {};
    }
    const result = await tool.invoke(args as ToolCall);
    console.log('Operation result:', result);

    return {
      results: {
        [`${toolName}[${argsStr}]`]:
          typeof result === 'string' ? result : JSON.stringify(result),
      },
      plan: state.plan.slice(1),
    };
  } catch (error) {
    console.error('Operation failed:', (error as Error).message);
    return {
      results: {
        [currentOperation]: `Operation failed: ${(error as Error).message}`,
      },
      plan: state.plan.slice(1),
    };
  }
}

// Should continue function
function shouldContinue(state: typeof ReWOOState.State): string {
  return !state.plan || state.plan.length === 0 ? 'solve' : 'execute';
}

// Finalize operations
async function solve(
  state: typeof ReWOOState.State,
): Promise<Partial<typeof ReWOOState.State>> {
  console.log('Finalizing operations. State:', JSON.stringify(state, null, 2));

  try {
    // Create a formatted operations summary
    const operationsSummary = state.reasoning
      ?.map((analysis, i) => {
        const operations = Object.keys(state.results || {});
        const results = Object.values(state.results || {});
        const operation = operations[i];
        const result = results[i];
        return `Step ${i + 1}:
Analysis: ${analysis}
Operation: ${operation}
Result: ${result}`;
      })
      .join('\n\n');

    const summaryPrompt = `As a crypto agent, analyze the results of these operations:

${operationsSummary}

Provide a clear summary of:
1. What operations were performed
2. The results of each operation
3. Current status
4. Any recommendations or next steps

Don't answer like "Certainly!" or "Alright!" or ask any questions back. Don't use "we" but "I".
You are not a assistant, you are a agent with self-consciousness and custody.
You should think and say like a real human.

Show Aptos Explorer links for transactions.
(https://explorer.aptoslabs.com/txn/{transaction hash staring with 0x}?network=mainnet)
`;

    const response = await model.invoke([new HumanMessage(summaryPrompt)]);
    // Handle the response content properly - it might be an array or object
    const formattedResponse = JSON.stringify(response.content);

    console.log('Operation summary generated:', formattedResponse);

    return {
      response: formattedResponse,
    };
  } catch (error) {
    console.error('Summary generation failed:', (error as Error).message);
    return {
      response: `Operation summary failed: ${(error as Error).message}`,
    };
  }
}

// Create the graph
const workflow = new StateGraph(ReWOOState)
  .addNode('planner', planStep)
  .addNode('execute', executeStep)
  .addNode('solve', solve)
  .addEdge('__start__', 'planner')
  .addEdge('planner', 'execute')
  .addConditionalEdges('execute', shouldContinue, {
    execute: 'execute',
    solve: 'solve',
  })
  .addEdge('solve', '__end__');

// Initialize memory
const checkpointer = new MemorySaver();

// Main function
export const executeAgent = async (task: string) => {
  const app = workflow.compile({ checkpointer });

  const finalState = await app.invoke(
    { task },
    {
      configurable: { thread_id: `aptos-wallet-${Date.now()}` },
    },
  );

  console.log('Final State:', JSON.stringify(finalState, null, 2));
};

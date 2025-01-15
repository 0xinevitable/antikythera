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
    const content = response.content.toString();

    // Extract operations and analysis
    const steps: string[] = [];
    const reasoning: string[] = [];

    const stepMatches = content.split(/Step \d+:/g).filter(Boolean);

    for (const step of stepMatches) {
      const [analysis, operation] = step
        .split(/\nOperation:/)
        .map((s) => s.trim());

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
  console.log('Executing operation. Current state:', state);

  if (!state.plan || state.plan.length === 0) {
    console.log('No operations pending');
    return {};
  }

  const currentOperation = state.plan[0];
  console.log('Initiating operation:', currentOperation);

  try {
    const operationMatch = currentOperation.match(/(\w+)\[(.*)\]/);
    if (!operationMatch) {
      throw new Error(`Invalid operation format: ${currentOperation}`);
    }

    const [_, toolName, argsStr] = operationMatch;
    const tool = tools.find((t) => t.name === toolName);

    if (!tool) {
      throw new Error(`Unsupported operation: ${toolName}`);
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
        [currentOperation]:
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
You should think and say like a real human.`;

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
const main = async () => {
  const app = workflow.compile({ checkpointer });

  const query =
    "Check my wallet balance and register the domain name 'aptos.apt'";

  const finalState = await app.invoke(
    { task: query },
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

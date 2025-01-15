import { tool } from '@langchain/core/tools';
import { formatUnits, parseUnits } from 'viem';
import { z } from 'zod';

const parseUnitsSchema = z.object({
  value: z.string().describe('The value to parse as a string'),
  decimals: z.number().describe('The number of decimal places'),
});
export const parseUnitsTool = tool(
  async ({ value, decimals }) => {
    try {
      const result = parseUnits(value, decimals);
      return result.toString();
    } catch (error) {
      return `Error parsing units: ${(error as Error).message}`;
    }
  },
  {
    name: 'parseUnits',
    description: 'Parse a number with a given decimal places into a BigInt',
    schema: parseUnitsSchema,
  },
);

const formatUnitsSchema = z.object({
  value: z.string().describe('The BigInt value as a string'),
  decimals: z.number().describe('The number of decimal places'),
});
export const formatUnitsTool = tool(
  async ({ value, decimals }) => {
    try {
      const bigIntValue = BigInt(value.split('.')[0]);
      const result = formatUnits(bigIntValue, decimals);
      return result;
    } catch (error) {
      return `Error formatting units: ${(error as Error).message}`;
    }
  },
  {
    name: 'formatUnits',
    description:
      'Format a BigInt value with given decimal places into a human-readable string',
    schema: formatUnitsSchema,
  },
);

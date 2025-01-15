import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';

import { getBalanceTool, getCoinTool, searchCoinTool } from '@/tools/coins';
import { chainTVLTool, listChainProtocolsTool } from '@/tools/defillama';
import { listEchelonMarketsTool } from '@/tools/echelon';
import { kanaSwapQuoteTool } from '@/tools/kanaswap';
import { formatUnitsTool, parseUnitsTool } from '@/tools/units';

export type ExtendedTool = DynamicTool | DynamicStructuredTool<any>;

export const getAllTools = (): ExtendedTool[] => {
  return [
    searchCoinTool,
    getCoinTool,
    getBalanceTool,
    // findSwapRouteTool,
    kanaSwapQuoteTool,
    // thalaSwapABITool,
    chainTVLTool,
    listChainProtocolsTool,
    listEchelonMarketsTool,
    parseUnitsTool,
    formatUnitsTool,
  ];
};

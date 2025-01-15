import { tool } from '@langchain/core/tools';
import axios from 'axios';

export const chainTVLTool = tool(
  async () => {
    try {
      const { data: results } = await axios.get<
        { gecko_id: string; tvl: number }[]
      >('https://api.llama.fi/v2/chains');
      const tvl = results.find((v) => v.gecko_id === 'aptos')?.tvl;
      return JSON.stringify({ tvl: `$${tvl}` });
    } catch (error) {
      console.log(error);
      return JSON.stringify({
        error: `Error querying TVL: ${(error as Error).message}`,
      });
    }
  },
  {
    name: 'chainTVL',
    description: 'Get current TVL of Aptos chain. (Source: DefiLlama)',
  },
);

type DefiLlamaProtocol = {
  category: string;
  chains: string[];
  mcap?: number;
  name: string;
  symbol: string;
  logo: string;
  url: string;
  referralUrl?: string;
  tvl?: number;
  tvlPrevDay?: number;
  tvlPrevWeek?: number;
  tvlPrevMonth?: number;
  // chainTvls: ChainTvls;
  chainTvls: Record<
    'Aptos',
    {
      tvl: number;
      tvlPrevDay: number;
      tvlPrevWeek: number;
      tvlPrevMonth: number;
    }
  >;
  defillamaId: string;
  governanceID?: string[];
  geckoId?: string;
  oracles?: string[];
  forkedFrom?: string[];
  listedAt?: number;
  parentProtocol?: string;
  // oraclesByChain?: OraclesByChain;
};
type DefiLlamaProtocolQueryResponse = {
  protocols: DefiLlamaProtocol[];
  // chains: string[]
  // protocolCategories: string[]
  // parentProtocols: ParentProtocol[]
};

const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const ret: any = {};
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
};

export const listChainProtocolsTool = tool(
  async () => {
    try {
      const { data: protocols } = await axios.get<DefiLlamaProtocol[]>(
        'https://api.llama.fi/protocols',
      );
      const aptosProtocols = protocols.flatMap((v) => {
        if (!v.chains.includes('Aptos') || v.category.includes('CEX')) {
          return [];
        }

        return {
          ...pick(v, [
            'category',
            'chains',
            'forkedFrom',
            'listedAt',
            'mcap',
            'name',
            'symbol',
            'logo',
            'url',
            'tvl',
          ]),
          aptosTVL: v.chainTvls.Aptos,
        };
      });
      return JSON.stringify(aptosProtocols);
    } catch (error) {
      console.log(error);
      return JSON.stringify({
        error: `Error querying protocols: ${(error as Error).message}`,
      });
    }
  },
  {
    name: 'listChainProtocols',
    description:
      'Get a list of protocols and their TVL on Aptos chain. (Source: DefiLlama)',
  },
);

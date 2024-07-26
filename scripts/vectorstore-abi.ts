import {
  Aptos,
  AptosConfig,
  MoveFunctionVisibility,
  Network,
} from '@aptos-labs/ts-sdk';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const ThalaSwap =
  '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af';

(async () => {
  const config = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(config);
  const modules = await aptos.getAccountModules({ accountAddress: ThalaSwap });

  const abis = modules.flatMap((module) => {
    if (!module.abi) {
      return [];
    }
    const { address: _address, ...abi } = module.abi;
    return abi.exposed_functions.flatMap((func) => {
      if (func.visibility === MoveFunctionVisibility.PUBLIC) {
        return { module: module.abi!.name, ...func };
      }
      return [];
    });
  });
  console.log(abis);

  const vectorStore = await MemoryVectorStore.fromTexts(
    abis.map((v) => JSON.stringify(v)),
    abis.map((v) => `${v.module}::${v.name}`),
    new OpenAIEmbeddings({ apiKey: process.env.API_KEY }),
  );
  const [resultOne] = await vectorStore.similaritySearch(
    'Swap with exact amount in normal amm',
    1,
  );
  console.log(resultOne.pageContent);

  const [resultTwo] = await vectorStore.similaritySearch(
    'Get pool status of a weighted pool',
    1,
  );
  console.log(resultTwo.pageContent);
})();

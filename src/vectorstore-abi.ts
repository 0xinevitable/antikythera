import {
  Aptos,
  AptosConfig,
  MoveFunctionGenericTypeParam,
  MoveFunctionVisibility,
  Network,
} from '@aptos-labs/ts-sdk';
import { OpenAIEmbeddings } from '@langchain/openai';
import fs from 'fs/promises';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import path from 'path';

export const ThalaSwapPackageId =
  '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af';

type ABI = {
  is_view: boolean;
  name: string;
  visibility: MoveFunctionVisibility;
  is_entry: boolean;
  generic_type_params: MoveFunctionGenericTypeParam[];
  params: string[];
  return: string[];
  module: string;
};

interface StoredVectorData {
  memoryVectors: any[];
  texts: string[];
  metadatas: object[];
}

export async function createVectorStore(
  abis: ABI[],
): Promise<MemoryVectorStore> {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.API_KEY });
  const texts = abis.map((v) => JSON.stringify(v));
  const metadatas = abis.map((v) => ({ id: `${v.module}::${v.name}` }));
  return await MemoryVectorStore.fromTexts(texts, metadatas, embeddings);
}

export async function saveVectorStore(
  vectorStore: MemoryVectorStore,
  texts: string[],
  metadatas: object[],
  filename: string,
): Promise<void> {
  const data: StoredVectorData = {
    memoryVectors: vectorStore.memoryVectors,
    texts,
    metadatas,
  };
  await fs.writeFile(filename, JSON.stringify(data), 'utf8');
}

export async function loadVectorStore(
  filename: string,
): Promise<MemoryVectorStore | null> {
  try {
    const data = await fs.readFile(filename, 'utf8');
    const storedData: StoredVectorData = JSON.parse(data);
    const embeddings = new OpenAIEmbeddings({ apiKey: process.env.API_KEY });
    const vectorStore = await MemoryVectorStore.fromTexts(
      storedData.texts,
      storedData.metadatas,
      embeddings,
    );
    vectorStore.memoryVectors = storedData.memoryVectors;
    return vectorStore;
  } catch (error) {
    console.log(`Error loading vector store from ${filename}: ${error}`);
    return null;
  }
}

export async function loadOrCreateVectorStore(
  packageId: string,
  isView: boolean,
  abis: ABI[],
): Promise<MemoryVectorStore> {
  const filename = `vectorstores/abis/${packageId}_${isView ? 'view' : 'nonview'}.json`;

  const loadedStore = await loadVectorStore(filename);
  if (loadedStore) {
    console.log(`Loaded vector store from ${filename}`);
    return loadedStore;
  }

  console.log(`Creating new vector store for ${filename}`);
  const vectorStore = await createVectorStore(abis);
  const texts = abis.map((v) => JSON.stringify(v));
  const metadatas = abis.map((v) => ({ id: `${v.module}::${v.name}` }));
  await saveVectorStore(vectorStore, texts, metadatas, filename);
  return vectorStore;
}

async function main() {
  const config = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(config);
  const modules = await aptos.getAccountModules({
    accountAddress: ThalaSwapPackageId,
  });

  const packageId = path.basename(ThalaSwapPackageId);

  const allAbis = modules.flatMap((module) => {
    if (!module.abi) {
      return [];
    }
    const { address: _address, ...abi } = module.abi;
    return abi.exposed_functions.flatMap((func) => {
      if (func.visibility === MoveFunctionVisibility.PUBLIC) {
        return { module: module.abi!.name, ...func, is_view: func.is_view };
      }
      return [];
    });
  });

  const viewAbis = allAbis.filter((abi) => abi.is_view);
  const nonViewAbis = allAbis.filter((abi) => !abi.is_view);

  const viewVectorStore = await loadOrCreateVectorStore(
    packageId,
    true,
    viewAbis,
  );
  const nonViewVectorStore = await loadOrCreateVectorStore(
    packageId,
    false,
    nonViewAbis,
  );

  console.log('View functions:');
  const viewResults = await viewVectorStore.similaritySearch(
    'Get pool status of a weighted pool',
    1,
  );
  console.log(viewResults[0].pageContent);

  console.log('\nNon-view functions:');
  const nonViewResults = await nonViewVectorStore.similaritySearch(
    'Swap with exact amount in normal amm',
    1,
  );
  console.log(nonViewResults[0].pageContent);

  const anotherNonViewResults = await nonViewVectorStore.similaritySearch(
    "Get pool lp coin address when amm pool's coins are given",
    1,
  );
  console.log(anotherNonViewResults[0].pageContent);
}

// main().catch(console.error);

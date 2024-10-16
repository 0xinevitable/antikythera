import axios from 'axios';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';

interface TokenType {
  type: string;
  account_address: string;
  module_name: string;
  struct_name: string;
}

interface AptosCoin {
  name: string;
  symbol: string;
  official_symbol: string;
  coingecko_id: string;
  decimals: number;
  logo_url: string;
  project_url: string;
  token_type: TokenType;
  extensions: {
    data: [string, string][];
  };
  unique_index: number;
  source: string;
  permissioned_listing: boolean;
  hippo_symbol: string;
  pancake_symbol: string;
}

interface FungibleAssetMetadata {
  asset_type: string;
  name: string;
  creator_address: string;
  decimals: number;
  symbol: string;
  last_transaction_timestamp: string;
  last_transaction_version: number;
}

interface NoditResponse {
  data: {
    fungible_asset_metadata: FungibleAssetMetadata[];
  };
}

async function fetchFungibleAssetMetadata(
  assetTypes: string[],
): Promise<FungibleAssetMetadata[]> {
  const url =
    'https://aptos-mainnet.nodit.io/4_c~5EHF2Z6hvc8K-MH2H_CW5Wtoe7BI/v1/graphql';

  const query = `
    query FetchFungibleAssetMetadata($asset_types: [String!]) {
      fungible_asset_metadata(
        where: {
          asset_type: {
            _in: $asset_types
          }
        }
      ) {
        asset_type
        name
        creator_address
        decimals
        symbol
        last_transaction_timestamp
        last_transaction_version
      }
    }
  `;

  try {
    const response = await axios.post<NoditResponse>(url, {
      query,
      variables: {
        asset_types: assetTypes,
      },
    });

    return response.data.data.fungible_asset_metadata;
  } catch (error) {
    console.error('Error fetching fungible asset metadata:', error);
    throw error;
  }
}

async function compareCoinData() {
  const assetTypes = APTOS_MAINNET_COINS.map((coin) => coin.token_type.type);
  const noditData = await fetchFungibleAssetMetadata(assetTypes);

  APTOS_MAINNET_COINS.forEach((localCoin) => {
    const noditCoin = noditData.find(
      (coin) => coin.asset_type === localCoin.token_type.type,
    );

    if (noditCoin) {
      if (
        localCoin.name.trim() !== noditCoin.name.trim() &&
        !localCoin.name.includes(noditCoin.name.trim())
      ) {
        console.log(`Name mismatch for ${localCoin.name}`, {
          Hippo: localCoin.name,
          Nodit: noditCoin.name,
        });
      }
    } else {
      console.log(
        `No Nodit data found for ${localCoin.name} (${localCoin.token_type.type})`,
      );
      console.log('---');
    }
  });
}

compareCoinData().catch(console.error);

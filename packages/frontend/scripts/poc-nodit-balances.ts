import axios from 'axios';

interface CoinBalance {
  owner_address: string;
  amount: number;
  storage_id: string;
  last_transaction_version: number;
  last_transaction_timestamp: string;
  is_frozen: boolean;
  metadata: {
    asset_type: string;
    creator_address: string;
    decimals: number;
    icon_uri: string | null;
    name: string;
    project_uri: string | null;
    symbol: string;
    token_standard: string;
    maximum_v2: number | null;
    supply_v2: number | null;
  };
}

interface FetchCoinBalancesResponse {
  data: {
    current_fungible_asset_balances: CoinBalance[];
  };
}

async function fetchCoinBalances(
  accountAddress: string,
  limit: number = 10,
): Promise<CoinBalance[]> {
  const url =
    'https://aptos-mainnet.nodit.io/4_c~5EHF2Z6hvc8K-MH2H_CW5Wtoe7BI/v1/graphql';

  const query = `
    query FetchCoinBalances($owner_address: String!, $limit: Int!) {
      current_fungible_asset_balances(
        limit: $limit
        where: {
          owner_address: {
            _eq: $owner_address
          }
        }
      ) {
        amount
        metadata {
          asset_type
        }
      }
    }
  `;

  try {
    const response = await axios.post<FetchCoinBalancesResponse>(url, {
      query,
      variables: {
        owner_address: accountAddress,
        limit,
      },
    });

    return response.data.data.current_fungible_asset_balances;
  } catch (error) {
    console.error('Error fetching coin balances:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const accountAddress =
    '0x274c398a921b8e2ba345feac3039e1c8b196a7eb1395cdd3584af3a85eb9ec50';
  try {
    const balances = await fetchCoinBalances(accountAddress);
    console.log('Coin balances:', balances);
  } catch (error) {
    console.error('Failed to fetch coin balances:', error);
  }
}

main();

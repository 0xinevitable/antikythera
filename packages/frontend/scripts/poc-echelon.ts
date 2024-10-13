import { EchelonClient } from '@antikythera/echelon-sdk';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';

const config = new AptosConfig({
  network: Network.MAINNET,
});
const client = new EchelonClient(
  new Aptos(config),
  '0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba',
);

type EchelonMarketInfo = {
  coinType: string;
  name: string | undefined;
  symbol: string | undefined;
  borrowAPR: number;
  supplyAPR: number;
  coinPriceInUSD: number;
};

const main = async () => {
  const markets = await client.getAllMarkets();
  console.log('Total markets:', markets.length);

  const chunkSize = 3;
  const marketInfo: EchelonMarketInfo[] = [];
  for (let i = 0; i < markets.length; i += chunkSize) {
    const chunks = markets.slice(i, i + chunkSize);
    console.log(`Processing chunk ${i / chunkSize + 1}`);

    const results = await Promise.all(
      chunks.map(async (market) => {
        const [coinType, borrowAPR, supplyAPR, coinPriceInUSD] =
          await Promise.all([
            client.getMarketCoin(market),
            client.getBorrowApr(market),
            client.getSupplyApr(market),
            client.getCoinPrice(market),
          ]);

        const coin = APTOS_MAINNET_COINS.find(
          (v) => v.token_type.type.toLowerCase() === coinType.toLowerCase(),
        );

        return {
          coinType,
          name: coin?.name,
          symbol: coin?.symbol,
          logoURL: coin?.logo_url,
          borrowAPR: borrowAPR * 100,
          supplyAPR: supplyAPR * 100,
          coinPriceInUSD,
        };
      }),
    );

    marketInfo.push(...results);
  }

  console.log(marketInfo);
};

main().catch(console.error);

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

const main = async () => {
  const markets = await client.getAllMarkets();
  console.log(markets);

  for (const market of markets) {
    const [coinType, borrowAPR, supplyAPR, coinPriceInUSD] = await Promise.all([
      await client.getMarketCoin(market),
      await client.getBorrowApr(market),
      await client.getSupplyApr(market),
      await client.getCoinPrice(market),
    ]);

    console.log(coinType);
    const coin = APTOS_MAINNET_COINS.find(
      (v) => v.token_type.type.toLowerCase() === coinType.toLowerCase(),
    );
    console.log(coin?.name, coin?.symbol);
    console.log(borrowAPR * 100 + '%');
    console.log(supplyAPR * 100 + '%');
    console.log(coinPriceInUSD);
  }
};

main();

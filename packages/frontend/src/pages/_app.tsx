import { Network } from '@aptos-labs/ts-sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { Analytics } from '@vercel/analytics/react';
import 'hint.css/hint.css';
import { AppProps } from 'next/app';
import React from 'react';

import { SatoshiFont } from '@/styles/fonts';
import '@/styles/global.css';

const wallets = [
  // new BitgetWallet(),
  // new FewchaWallet(),
  new MartianWallet(),
  // new MSafeWalletAdapter(),
  // new PontemWallet(),
  // new TrustWallet(),
  // new OKXWallet(),
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        dappConfig={{
          network: Network.MAINNET,
          mizuwallet: {
            manifestURL:
              'https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json',
          },
        }}
        onError={(error) => {
          console.log('error', error);
        }}
      >
        <Component {...pageProps} />
      </AptosWalletAdapterProvider>

      <Analytics />
      <div id="portal" />

      <style jsx global>{`
        *:not(code) {
          font-family: ${SatoshiFont.style.fontFamily};
        }
      `}</style>
    </React.Fragment>
  );
}

export default MyApp;

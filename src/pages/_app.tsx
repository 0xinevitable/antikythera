import { Network } from '@aptos-labs/ts-sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { AppProps } from 'next/app';
import React from 'react';

import { SatoshiFont } from '@/styles/fonts';
import '@/styles/global.css';

// const wallets = [
//   new BitgetWallet(),
//   new FewchaWallet(),
//   new MartianWallet(),
//   new MSafeWalletAdapter(),
//   new PontemWallet(),
//   new TrustWallet(),
//   new OKXWallet(),
// ];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <AptosWalletAdapterProvider
        // plugins={wallets}
        autoConnect={true}
        dappConfig={{ network: Network.MAINNET }}
        onError={(error) => {
          console.log('error', error);
        }}
      >
        <Component {...pageProps} />
      </AptosWalletAdapterProvider>

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

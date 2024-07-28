import { AppProps } from 'next/app';
import React from 'react';

import { SatoshiFont } from '@/styles/fonts';
import '@/styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Component {...pageProps} />

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

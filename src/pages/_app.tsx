import { AppProps } from 'next/app';
import React from 'react';

import '@/styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Component {...pageProps} />

      <div id="portal" />
    </React.Fragment>
  );
}

export default MyApp;

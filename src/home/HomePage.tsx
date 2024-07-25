import styled from '@emotion/styled';
import React from 'react';

import { Block } from './Block';

const Colors = {
  Thala: '#c2afff',
  Aptos: '#0EF7F7',
};
const ThalaFaucet = {
  name: 'Thala Faucet',
  color: Colors.Thala,
  src: '/assets/logo-thala.png',
};
const ThalaSwap = {
  name: 'Thala Swap',
  color: Colors.Thala,
  src: '/assets/logo-thala.png',
};
const AptosNames = {
  name: 'Aptos Names',
  color: Colors.Aptos,
  src: '/assets/logo-aptos-neon.png',
};

const HomePage = () => {
  return (
    <Container>
      <BlockList>
        <Block title="Mint Tokens" brand={ThalaFaucet} />
        <Block title="Swap Estimation" brand={ThalaSwap} />

        <Block title="Register Name" brand={AptosNames} />
        <Block title="Set Name Address" brand={AptosNames} />
      </BlockList>
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BlockList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

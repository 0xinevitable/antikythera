import styled from '@emotion/styled';
import { NextPage } from 'next';

import { Header } from './sections/Header';

const LandingPage: NextPage = () => {
  return (
    <Container>
      <Header />
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 12px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
`;

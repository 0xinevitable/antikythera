import styled from '@emotion/styled';
import { NextPage } from 'next';

import { Reveal } from '@/components/Reveal';
import { Tape } from '@/components/Tape';

import { AptosAssistantSection } from './sections/AptosAssistantSection';
import { CallToActionSection } from './sections/CallToActionSection';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { PoweredBySection } from './sections/PoweredBySection';

const LandingPage: NextPage = () => {
  return (
    <Wrapper>
      <Container>
        <div className="flex flex-col items-center w-screen overflow-hidden">
          <Tape variant="dark" />

          <Reveal>
            <Header />
          </Reveal>
        </div>
      </Container>

      <Reveal delay={200}>
        <PoweredBySection />
      </Reveal>

      <AptosAssistantSection />

      <CallToActionSection />
      <Footer />
    </Wrapper>
  );
};

export default LandingPage;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 12px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
`;

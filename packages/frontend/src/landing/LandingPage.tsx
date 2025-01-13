import styled from '@emotion/styled';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Reveal } from '@/components/Reveal';
import { Tape } from '@/components/Tape';
import { NavigationBar } from '@/home/components/NavigationBar';

import { AptosAssistantSection } from './sections/AptosAssistantSection';
import { CallToActionSection } from './sections/CallToActionSection';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { PoweredBySection } from './sections/PoweredBySection';

const LandingPage: NextPage = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <NavigationBar
        showWalletSelector={false}
        onClickLogo={() => router.push('/')}
      />

      <Container>
        <div className="flex flex-col items-center w-screen overflow-hidden">
          <StyledTape variant="dark" />

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
const StyledTape = styled(Tape)`
  margin-top: 60px;
  margin-bottom: -40px;
`;

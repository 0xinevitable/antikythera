import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';

import aakDiagramImage from '@/assets/aak-diagram.jpg';
import aakCoverImage from '@/assets/aak.jpg';
import { Tape } from '@/components/Tape';
import { Button } from '@/components/ui/button';
import { NavigationBar } from '@/home/components/NavigationBar';
import { Footer } from '@/landing/sections/Footer';

import { AAKLogo as _AAKLogo } from './components/AAKLogo';
import { BuiltAndPoweredBySection } from './components/BuiltAndPoweredBySection';

const AAKPage: NextPage = () => {
  return (
    <Wrapper>
      <NavigationBar mode="light" showWalletSelector={false} />

      <div className="flex flex-col items-center w-screen overflow-hidden">
        <StyledTape mode="light" />
        <AAKCoverImage src={aakCoverImage} alt="" />

        <HeaderContent>
          <AAKLogoContainer>
            <AAKLogo />
            <Button className="w-fit text-base font-bold">Coming Soon</Button>
          </AAKLogoContainer>

          <BuiltAndPoweredBySection />
        </HeaderContent>

        <DiagramWrapper>
          <DiagramImage src={aakDiagramImage} alt="" />
        </DiagramWrapper>
      </div>

      <style jsx global>{`
        html,
        body {
          background: #fff;
          color: #000;
        }
      `}</style>

      <Footer mode="light" containerMaxWidth={1040} />
    </Wrapper>
  );
};

export default AAKPage;

const Wrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledTape = styled(Tape)`
  margin-top: 60px;
`;

const AAKCoverImage = styled(Image)`
  width: 772px;
  height: 434px;
  object-fit: cover;
  object-position: center bottom;
`;

const AAKLogo = styled(_AAKLogo)`
  width: 100%;
  max-width: 400px;
  height: auto;
`;
const AAKLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const HeaderContent = styled.div`
  margin-top: -20px;
  padding: 0 20px;

  width: 100%;
  max-width: 1040px;

  display: flex;
  justify-content: space-between;
  gap: 28px;

  @media screen and (max-width: 990px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;

    & > ${AAKLogoContainer} {
      align-items: center;
    }
  }
`;

const DiagramWrapper = styled.div`
  width: 100%;
  margin: 56px 0 120px;
  padding: 0 20px;

  display: flex;
  justify-content: center;
`;
const DiagramImage = styled(Image)`
  width: 100%;
  max-width: 1040px;
  height: auto;
  object-fit: contain;
`;

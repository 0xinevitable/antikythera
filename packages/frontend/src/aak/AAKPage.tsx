import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import aakImage from '@/assets/aak.jpg';
import { Tape } from '@/components/Tape';
import { Button } from '@/components/ui/button';
import { PoweredBySection } from '@/landing/sections/PoweredBySection';

import { AAKLogo } from './components/AAKLogo';
import { BuiltAndPoweredBySection } from './components/BuiltAndPoweredBySection';

const AAKPage: NextPage = () => {
  const router = useRouter();

  return (
    <Wrapper>
      {/* navbar bg should be white */}
      {/* <NavigationBar onClickLogo={() => router.push('/')} /> */}

      <div className="flex flex-col items-center w-screen overflow-hidden">
        <StyledTape variant="light" />
        <AAKImage src={aakImage} alt="" />

        <HeaderContent>
          <div className="flex flex-col gap-6">
            <AAKLogo />
            <Button className="w-fit text-base font-bold">Coming Soon</Button>
          </div>

          <BuiltAndPoweredBySection />
        </HeaderContent>
      </div>

      <style jsx global>{`
        html,
        body {
          background: #fff;
          color: #000;
        }
      `}</style>
    </Wrapper>
  );
};

export default AAKPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledTape = styled(Tape)`
  margin-top: 40px;
`;

const AAKImage = styled(Image)`
  width: 772px;
  height: 434px;
  object-fit: cover;
  object-position: center bottom;
`;

const HeaderContent = styled.div`
  margin-top: -20px;
  width: 100%;
  max-width: 1040px;
  display: flex;
  justify-content: space-between;
`;

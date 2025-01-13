import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import aakImage from '@/assets/aak.jpg';
import { Button } from '@/components/ui/button';

import { AAKLogo } from './components/AAKLogo';

const AAKPage: NextPage = () => {
  const router = useRouter();

  return (
    <Wrapper>
      {/* navbar bg should be white */}
      {/* <NavigationBar onClickLogo={() => router.push('/')} /> */}

      <AAKImage src={aakImage} alt="" />
      <div className="flex flex-col gap-6">
        <AAKLogo />
        <Button className="w-fit text-base font-bold">Coming Soon</Button>
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
const Sidebar = styled.nav`
  width: 280px;
  background-color: black;
  border-right: 1px solid rgba(132, 117, 117, 0.2);
`;

const AAKImage = styled(Image)`
  width: 772px;
  height: 434px;
  object-fit: contain;
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 60px 12px 64px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MessageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

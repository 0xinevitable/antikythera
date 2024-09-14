import styled from '@emotion/styled';
import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';
import { WalletSelector } from '@/components/WalletSelector';

type NavigationBarProps = {
  onClickLogo: () => void;
};

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onClickLogo,
}) => {
  return (
    <Container>
      <div className="flex items-center mr-auto">
        <div
          className="flex items-center gap-[10px] cursor-pointer"
          onClick={onClickLogo}
        >
          <BrandLogo className="text-white" />
          <BrandName>Antikythera</BrandName>
        </div>

        {/* FIXME: */}
        <nav className="mt-1 ml-5 text-sm text-white">
          <Link href="/">About</Link>
        </nav>
      </div>

      <WalletSelector />
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;

  width: 100%;
  height: 64px;
  padding: 0px 20px;

  display: flex;
  align-items: center;

  background: linear-gradient(180deg, #0b0b0b 20%, rgba(11, 11, 11, 0) 100%);
`;
const BrandName = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';
import { WalletSelector } from '@/components/WalletSelector';
import { VariantProps } from '@/constants/types';
import { cn } from '@/utils/cn';

type NavigationBarProps = VariantProps & {
  showWalletSelector?: boolean;
  onClickHome?: () => void;
};

export const NavigationBar: React.FC<NavigationBarProps> = ({
  variant = 'dark',
  showWalletSelector = true,
  onClickHome,
}) => {
  return (
    <Container variant={variant}>
      <div className="flex items-center mr-auto">
        <Link href="/">
          <div
            className={cn(
              'flex items-center gap-[10px] cursor-pointer',
              variant === 'light' ? 'text-black' : 'text-white',
            )}
          >
            <BrandLogo />
            <BrandName>Antikythera</BrandName>
          </div>
        </Link>

        {/* FIXME: */}
        <nav
          className={cn(
            'mt-1 ml-5 text-sm font-medium tracking-tight gap-5 flex items-center opacity-65',
            variant === 'light' ? 'text-black' : 'text-white',
          )}
        >
          {!onClickHome ? (
            <Link href="/home">Home</Link>
          ) : (
            <button onClick={onClickHome}>Home</button>
          )}
          <Link href="/aak">Aptos Agent Kit</Link>
        </nav>
      </div>

      {showWalletSelector && <WalletSelector />}
    </Container>
  );
};

const Container = styled.div<VariantProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;

  width: 100%;
  height: 60px;
  padding: 0px 20px;

  display: flex;
  align-items: center;

  ${({ variant }) =>
    variant === 'dark' &&
    css`
      background: linear-gradient(
        180deg,
        #0b0b0b 20%,
        rgba(11, 11, 11, 0) 100%
      );
    `};
`;
const BrandName = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;

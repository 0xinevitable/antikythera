import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { BrandLogo } from '@/components/BrandLogo';
import { ColorModeProps } from '@/constants/types';

type FooterProps = ColorModeProps & {
  containerMaxWidth?: number;
};

export const Footer: React.FC<FooterProps> = ({
  mode = 'dark',
  containerMaxWidth: maxWidth = 800,
}) => (
  <Container mode={mode}>
    <div className="flex flex-col w-full mx-auto" style={{ maxWidth }}>
      <div className="flex items-center gap-[10px]">
        <BrandLogo className="text-[#737373]" />
        <BrandName>Antikythera</BrandName>
      </div>

      <Copyright>© 2024 Antikythera. All rights reserved.</Copyright>
    </div>
  </Container>
);

const BrandName = styled.span`
  color: #737373;
  font-size: 20px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;
const Copyright = styled.p`
  margin-top: 10px;

  color: #737373;
  font-size: 14px;
  font-weight: 500;
  line-height: 100%; /* 12px */
`;

const Container = styled.footer<ColorModeProps>`
  margin-top: auto;
  padding: 24px 20px 64px;
  width: 100%;

  ${({ mode }) =>
    mode === 'dark' &&
    css`
      background: #131313;
    `};

  ${({ mode }) =>
    mode === 'light' &&
    css`
      background: #f9f9f9;
    `};
`;

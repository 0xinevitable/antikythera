import styled from '@emotion/styled';

import { BrandLogo } from '@/components/BrandLogo';

export const Footer: React.FC = () => (
  <Container>
    <div className="flex flex-col w-full max-w-[800px] mx-auto">
      <div className="flex items-center gap-[10px]">
        <BrandLogo className="text-[#737373]" />
        <BrandName>Antikythera</BrandName>
      </div>

      <Copyright>© 2024 Antikythera. All rights reserved.</Copyright>
    </div>
  </Container>
);

const Container = styled.footer`
  margin-top: auto;
  padding: 24px 20px 64px;
  background: #131313;
`;
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
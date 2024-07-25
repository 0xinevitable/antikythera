import styled from '@emotion/styled';
import Image from 'next/image';

export type BlockProps = {
  className?: string;

  title: string;
  brand: {
    name: string;
    src: string;
    color: string;
  };
};

export const Block: React.FC<BlockProps> = ({ className, title, brand }) => {
  return (
    <Container className={className}>
      <NetworkContainer>
        <NetworkCircle />
        <NetworkName>Testnet</NetworkName>
      </NetworkContainer>
      <Title>{title}</Title>
      <BrandContainer
        style={{ boxShadow: `0px 12px 32px 0px ${brand.color}20` }}
      >
        <BrandLogo width={256} height={256} alt={brand.name} src={brand.src} />
        <BrandName style={{ color: brand.color }}>{brand.name}</BrandName>
      </BrandContainer>
    </Container>
  );
};

const Container = styled.li`
  padding: 12px;
  padding-right: 36px;
  min-width: 180px;
  width: fit-content;
  overflow: hidden;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  background: linear-gradient(
    180deg,
    rgba(34, 34, 34, 1) 0%,
    rgba(21, 28, 26, 1) 100%
  );
  border: 1px solid #5c5c5c;
  box-shadow: 0px 4px 12px 0px rgba(202, 255, 243, 0.12);
`;

const NetworkContainer = styled.div`
  border: 1px solid #50e3c2;
  width: fit-content;
  padding: 2px 4px 2px 6px;
  display: flex;
  align-items: center;
  gap: 7px;
`;
const NetworkCircle = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid #50e3c2;
  box-shadow: 0px 1px 5px 1px rgba(80, 227, 194, 0.66);
`;
const NetworkName = styled.span`
  color: #50e3c2;
  font-family: 'ProFontForPowerline-Regular', sans-serif;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
`;

const Title = styled.div`
  color: #ffffff;
  text-align: left;
  font-family: 'Satoshi-Regular', sans-serif;
  font-size: 24px;
  letter-spacing: -0.015em;
  font-weight: 400;
  position: relative;
  align-self: stretch;
`;

const BrandContainer = styled.div`
  padding: 4px 6px;
  padding-right: 8px;
  width: fit-content;
  border-radius: 32px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  border: 0.5px solid black;
  background: linear-gradient(
    180deg,
    rgba(27, 27, 27, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
`;
const BrandLogo = styled(Image)`
  border-radius: 50%;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  object-fit: cover;
`;
const BrandName = styled.span`
  text-align: left;
  font-family: 'Satoshi-Regular', sans-serif;
  font-size: 18px;
  line-height: 100%;
  font-weight: 400;
  position: relative;
`;

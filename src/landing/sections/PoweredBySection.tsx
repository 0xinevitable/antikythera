import styled from '@emotion/styled';

const LOGOS = [
  { src: '/assets/powered-by-aptos.svg', height: 22 },
  { src: '/assets/powered-by-aave.svg', height: 18 },
  { src: '/assets/powered-by-econia.svg', height: 16 },
  { src: '/assets/powered-by-nodit.svg', height: 25 },
  { src: '/assets/powered-by-thala.svg', height: 20 },
  { src: '/assets/powered-by-kana.svg', height: 24 },
  { src: '/assets/powered-by-echelon.svg', height: 41 },
];

export const PoweredBySection: React.FC = () => {
  return (
    <Section>
      <Title>Powered by</Title>
      <LogoList>
        {LOGOS.map((logo) => (
          <img key={logo.src} src={logo.src} height={logo.height} />
        ))}
      </LogoList>
    </Section>
  );
};

const Section = styled.section`
  padding-top: 40px;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &::before {
    content: '';
    width: 120px;
    height: 120px;

    border-radius: 120px;
    background: rgba(80, 227, 194, 0.55);
    filter: blur(60px);

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const Title = styled.span`
  color: #50e3c2;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 94%; /* 15.04px */
`;

const LogoList = styled.div`
  width: 100%;
  max-width: 556px;
  gap: 14px 28px;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

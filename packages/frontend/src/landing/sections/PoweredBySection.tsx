import styled from '@emotion/styled';

import {
  PoweredByAave,
  PoweredByAptos,
  PoweredByEchelon,
  PoweredByEconia,
  PoweredByKana,
  PoweredByNodit,
  PoweredByThala,
} from '@/components/ProtocolLogos';

const LOGOS = [
  { logo: <PoweredByAptos height={22} />, name: 'aptos' },
  {
    logo: <PoweredByAave height={18} />,
    name: 'aave',
    tooltip: 'Coming Soon!',
  },
  { logo: <PoweredByEconia height={16} />, name: 'econia' },
  { logo: <PoweredByNodit height={25} />, name: 'nodit' },
  { logo: <PoweredByThala height={20} />, name: 'thala' },
  { logo: <PoweredByKana height={24} />, name: 'kana' },
  { logo: <PoweredByEchelon height={41} />, name: 'echelon' },
];

export const PoweredBySection: React.FC = () => {
  return (
    <Section>
      <Title>Powered by</Title>
      <LogoList>
        {LOGOS.map((protocol) => (
          <div
            key={protocol.name}
            {...(!protocol.tooltip
              ? undefined
              : {
                  className: 'hint--bottom overflow-visible',
                  'aria-label': protocol.tooltip,
                })}
          >
            {protocol.logo}
          </div>
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

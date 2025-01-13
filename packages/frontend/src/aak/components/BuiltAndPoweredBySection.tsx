import styled from '@emotion/styled';

import { AntikytheraLogo as _AntikytheraLogo } from '@/components/AntikytheraLogo';
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

export const BuiltAndPoweredBySection: React.FC = () => {
  return (
    <Container>
      <Section>
        <Title className="!text-black">Proudly built by</Title>
        <AntikytheraLogo />
      </Section>
      <Divider />
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #000;
  margin: 22px 0;
`;

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::before {
    content: '';
    width: 120px;
    height: 120px;

    border-radius: 120px;
    background: rgba(171, 245, 255, 0.65);
    filter: blur(60px);

    position: absolute;
    top: 0;
    right: 100px;
  }
`;
const Title = styled.span`
  color: #7f7f7f;
  font-size: 16px;
  font-weight: 600;
  line-height: 94%; /* 15.04px */
`;

const AntikytheraLogo = styled(_AntikytheraLogo)`
  // have 16px gap on top
  margin-top: -4px;

  width: 244px;
  height: 52px;
  color: #000;
`;

const LogoList = styled.div`
  width: 100%;
  max-width: 556px;
  gap: 14px 28px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;

  color: #7f7f7f;
`;

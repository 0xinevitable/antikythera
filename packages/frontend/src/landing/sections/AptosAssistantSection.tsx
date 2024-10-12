import styled from '@emotion/styled';
import Image from 'next/image';

import aptosAssistantIllust from '@/assets/aptos-assistant.png';
import { Reveal } from '@/components/Reveal';

export const AptosAssistantSection: React.FC = () => {
  return (
    <Container>
      <Reveal cascade>
        <Title>
          THE ALL NEW <br />
          APTOS ASSISTANT
        </Title>
        <IllustWrapper>
          <AptosAssistantIllust alt="" src={aptosAssistantIllust} />
        </IllustWrapper>
      </Reveal>
    </Container>
  );
};

const Container = styled.section`
  padding: 180px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 36px;
  font-weight: 400;
  line-height: 103%; /* 37.08px */
  text-transform: uppercase;

  background: linear-gradient(180deg, #626262 0%, #50e3c2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const IllustWrapper = styled.div`
  margin-top: -42px;
  width: 308px;
  height: 308px;

  position: relative;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 83px;

    width: 120px;
    height: 120px;
    flex-shrink: 0;
    border-radius: 120px;
    background: rgba(80, 227, 194, 0.65);
    filter: blur(62px);
    z-index: -1;
  }
`;
const AptosAssistantIllust = styled(Image)`
  width: 100%;
  height: 100%;
  z-index: 1;
`;

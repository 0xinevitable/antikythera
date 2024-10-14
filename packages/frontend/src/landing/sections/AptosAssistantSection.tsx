import styled from '@emotion/styled';
import { User } from 'lucide-react';
import Image from 'next/image';

import aptosAssistantIllust from '@/assets/aptos-assistant.png';
import example1 from '@/assets/example-1.png';
import example2 from '@/assets/example-2.png';
import example3 from '@/assets/example-3.png';
import example4 from '@/assets/example-4.png';
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

        <UserMessage>What are the top ecosystem projects on Aptos?</UserMessage>
        <AssistantMessageImage1 alt="" src={example1} />
      </Reveal>

      <div style={{ height: 104, width: '100%', display: 'flex' }} />

      <Reveal cascade duration={100}>
        <Title2>
          The Ultimate Frontend <br />
          Aggregator™️
        </Title2>
        <UserMessage>
          What's the swap route to convert 1,400 APT into USDT (provided by
          LayerZero) with the best price?
        </UserMessage>
      </Reveal>

      <Group>
        <Reveal delay={200}>
          <AssistantMessageImage2 alt="" src={example2} />
        </Reveal>
        <Reveal3 delay={300}>
          <AssistantMessageImage3 alt="" src={example3} />
        </Reveal3>
        <Reveal4 delay={400}>
          <AssistantMessageImage4 alt="" src={example4} />
        </Reveal4>
      </Group>
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

const UserMessage = styled.span`
  width: fit-content;
  max-width: 420px;
  display: inline-flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px 0px 8px 8px;
  background: #50e3c2;
  box-shadow: 0px 10px 18px 0px rgba(0, 0, 0, 0.4);
`;
const AssistantMessageImage1 = styled(Image)`
  width: 438px;
  height: 163px;
`;

const Title2 = styled.h2`
  margin-bottom: 42px;

  text-align: center;
  font-size: 31px;
  font-weight: 400;
  line-height: 103%; /* 31.93px */
  text-transform: uppercase;
  background: linear-gradient(180deg, #73918a 0%, #50e3c2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Group = styled.div`
  margin-top: 10px;
  width: 679px;
  height: 509px;
  position: relative;
`;
const AssistantMessageImage2 = styled(Image)`
  width: 339.251px;
  height: 227.429px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #5c5c5c;
`;

const Reveal3 = styled(Reveal)`
  position: absolute;
  top: 114px;
  left: 75px;
`;
const AssistantMessageImage3 = styled(Image)`
  width: 339.251px;
  height: 193.617px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #5c5c5c;
  box-shadow: -4px -8px 32px 0px rgba(0, 0, 0, 0.25);
`;
const Reveal4 = styled(Reveal)`
  position: absolute;
  top: 280px;
  left: 197px;
`;
const AssistantMessageImage4 = styled(Image)`
  width: 482px;
  height: 229px;
  box-shadow: -4px -8px 32px 0px rgba(0, 0, 0, 0.25);
`;

import styled from '@emotion/styled';
import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <Container>
      {/* FIXME: placeholder blur loading */}
      <IllustContainer>
        <Illust
          src="/assets/3d-aptos.png"
          alt=""
          width={309 * 2}
          height={294 * 2}
        />
        <Gradient />
        <AntikytheraLogoContainer>
          <AntikytheraLogo
            src="/assets/typo-antikythera.svg"
            alt="Antikythera"
            width={438}
            height={94}
          />
          <h1 className="sr-only">Antikythera</h1>

          <div className="absolute min-w-[438px]">
            <div className="flex flex-col gap-1 absolute top-[-36px] right-[-88px]">
              <div className="flex ml-[28px]">
                <SVGImage
                  alt="Execute Transactions"
                  src="/assets/arrow-execute.svg"
                  width={207}
                  height={18}
                />
              </div>
              <SVGImage
                alt="Query Contracts"
                src="/assets/arrow-query.svg"
                width={169}
                height={18}
              />
            </div>
          </div>

          <SVGImage
            alt="ANTIKYTHERA v0.1"
            src="/assets/label-version.svg"
            width={107}
            height={16}
          />
        </AntikytheraLogoContainer>
      </IllustContainer>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 64px;
  margin-bottom: -28px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IllustContainer = styled.div`
  width: 309px;
  height: 294px;
  position: relative;
  z-index: 0;
`;
const Illust = styled(Image)`
  display: flex;
  width: 309px;
  height: 294px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

const Gradient = styled.div`
  width: 309px;
  height: 154px;
  background: linear-gradient(
    0deg,
    #0b0b0b 0%,
    rgba(11, 11, 11, 0.89) 32%,
    rgba(11, 11, 11, 0) 100%
  );
  z-index: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
const AntikytheraLogoContainer = styled.div`
  height: 94px;

  width: 438px;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;

  position: absolute;
  bottom: 48px;
  left: 50%;
  right: 0;
`;
const AntikytheraLogo = styled(Image)`
  width: 438px;
  height: 94px;
  display: flex;
`;

const SVGImage = styled(Image)``;
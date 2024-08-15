import styled from '@emotion/styled';
import { TrophyIcon } from 'lucide-react';
import Image from 'next/image';

type FeaturedSectionProps = {
  onSelect: (selectedPrompt: string) => void;
};

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onSelect,
}) => {
  return (
    <Section>
      <div className="flex gap-[10px] items-center">
        <TrophyIcon color="#9b9cad" size={18} />
        <Title>Featured</Title>
      </div>

      <Description>
        Try the best community-verified prompts and examples
      </Description>

      <FeaturedList>
        <FeaturedCard
          className="usdc"
          onClick={() => {
            onSelect('List all the bridged versions of USDC Coin.');
          }}
        >
          <InfoBadge className="absolute top-[11px] right-0" />
          <Image
            className="w-[64px] h-[64px] saturate-[105%]"
            src="/assets/3d-usdc.png"
            alt="USDC"
            width={512}
            height={512}
            style={{
              filter: 'drop-shadow(-6px 8px 12px rgba(1, 1, 2, 0.51))',
            }}
          />
          <FeaturedCardTitle>
            <span className="underline text-[#49B9FF]">List</span> all the
            bridged versions of{' '}
            <CoinBadge className="usdc">
              <Image
                className="w-[16px] h-[16px] saturate-[105%]"
                src="/assets/logo-usdc.png"
                alt=""
                width={48}
                height={48}
              />
              USDC
            </CoinBadge>
          </FeaturedCardTitle>
        </FeaturedCard>

        <FeaturedCard
          className="thala"
          onClick={() => {
            onSelect(
              'Estimate the swap for exchanging 100 APT into Move Dollar in ThalaSwap. Display the state of each pool in the route.',
            );
          }}
        >
          <QueryBadge className="absolute top-[11px] right-0" />
          <Image
            className="w-[64px] h-[64px] saturate-[105%]"
            src="/assets/3d-thala.png"
            alt="Thala"
            width={512}
            height={512}
            style={{
              filter: 'drop-shadow(-6px 8px 12px rgba(1, 1, 2, 0.51))',
            }}
          />
          <FeaturedCardTitle>
            <span className="underline text-[#A98EFF]">Estimate</span> the swap
            for exchanging 100{' '}
            <CoinBadge className="apt">
              <Image
                className="w-[16px] h-[16px] saturate-[105%]"
                src="/assets/logo-aptos.png"
                alt=""
                width={48}
                height={48}
              />
              APT
            </CoinBadge>{' '}
            into{' '}
            <CoinBadge className="mod">
              <Image
                className="w-[16px] h-[16px] saturate-[105%]"
                src="/assets/logo-mod.png"
                alt=""
                width={48}
                height={48}
              />
              Move Dollar
            </CoinBadge>{' '}
            in <span className="text-[#A98EFF]">ThalaSwap</span>
          </FeaturedCardTitle>
        </FeaturedCard>

        <FeaturedCard
          className="echelon"
          onClick={() => {
            onSelect(
              'Borrow USDT with 20% LTV from Echelon by supplying 100 APT.',
            );
          }}
        >
          <ExecutionBadge className="absolute top-[11px] right-0" />
          <Image
            className="w-[64px] h-[64px] saturate-[105%]"
            src="/assets/3d-echelon.png"
            alt="Echelon"
            width={512}
            height={512}
            style={{
              filter: 'drop-shadow(-6px 8px 12px rgba(1, 1, 2, 0.51))',
            }}
          />
          <FeaturedCardTitle>
            Borrow{' '}
            <CoinBadge className="usdt">
              <Image
                className="w-[16px] h-[16px] saturate-[105%]"
                src="/assets/logo-usdt.png"
                alt=""
                width={48}
                height={48}
              />
              USDT
            </CoinBadge>{' '}
            with <span className="underline text-[#50E3C2]">20% LTV</span> from{' '}
            <span className="text-[#50E3C2]">Echelon</span> by supplying 100{' '}
            <CoinBadge className="apt">
              <Image
                className="w-[16px] h-[16px] saturate-[105%]"
                src="/assets/logo-aptos.png"
                alt=""
                width={48}
                height={48}
              />
              APT
            </CoinBadge>
          </FeaturedCardTitle>
        </FeaturedCard>
      </FeaturedList>
    </Section>
  );
};

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;

  position: relative;
  padding: 18px 18px 0;

  border-radius: 12px;
  border: 1px solid #3f3f3f;
  border-bottom: 0;
  background: #1b1b1b;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    right: -1px;
    bottom: -1px;
    z-index: 1;

    width: calc(100% + 2px);
    height: 120px;

    background: linear-gradient(180deg, rgba(11, 11, 11, 0) 0%, #0b0b0b 100%);
  }
`;

const Title = styled.h2`
  color: #9b9cad;
  font-size: 18px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;
const Description = styled.p`
  margin-top: 12px;

  color: #9b9cad;
  font-size: 14px;
  font-weight: 500;
  line-height: 100%; /* 14px */
`;

const FeaturedList = styled.ul`
  margin-top: 24px;
  width: 100%;

  display: flex;
  justify-content: center;
  gap: 10px;
`;

const FeaturedCard = styled.li`
  padding: 8px 16px 16px;
  gap: 8px;
  height: fit-content;
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  flex: 1;

  border-radius: 8px;

  /* box-shadow: 0px 4px 12px 0px rgba(202, 255, 243, 0.12); */

  cursor: pointer;
  user-select: none;
  transition:
    opacity 0.2s ease,
    transform 0.16s ease;

  &:active {
    opacity: 0.45;
  }

  &:hover {
    transform: scale(0.98);
  }

  &.usdc {
    background:
      linear-gradient(180deg, #222 0%, #101010 100%) padding-box,
      linear-gradient(180deg, #009dff 27%, #292929 100%) border-box;
    border: 1px solid transparent;
  }

  &.thala {
    background:
      linear-gradient(180deg, #222 0%, #101010 100%) padding-box,
      linear-gradient(180deg, #996dff 27%, #292929 100%) border-box;
    border: 1px solid transparent;
  }

  &.echelon {
    background:
      linear-gradient(180deg, #222 0%, #101010 100%) padding-box,
      linear-gradient(180deg, #50e3c2 27%, #292929 100%) border-box;
    border: 1px solid transparent;
  }
`;
const FeaturedCardTitle = styled.h3`
  color: #ddd;
  font-size: 16px;
  font-weight: 700;
  line-height: 160%;
`;

type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;
const InfoBadge: SVGComponent = (props) => (
  <svg
    width="73"
    height="17"
    viewBox="0 0 73 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="73" height="17" fill="#009DFF" />
    <path
      d="M10.5002 5.79167C10.5002 5.21703 10.2719 4.66593 9.86556 4.2596C9.45923 3.85327 8.90813 3.625 8.3335 3.625H5.0835V11.75H8.87516C9.30614 11.75 9.71946 11.9212 10.0242 12.226C10.329 12.5307 10.5002 12.944 10.5002 13.375M10.5002 5.79167V13.375M10.5002 5.79167C10.5002 5.21703 10.7284 4.66593 11.1348 4.2596C11.5411 3.85327 12.0922 3.625 12.6668 3.625H15.9168V11.75H12.1252C11.6942 11.75 11.2809 11.9212 10.9761 12.226C10.6714 12.5307 10.5002 12.944 10.5002 13.375"
      stroke="black"
      stroke-width="1.08333"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.652 4.236H24.248V12H22.652V4.236ZM34.1866 10.416L33.6826 10.62V4.236H35.2786V12H33.6826L27.4066 5.868L27.9106 5.664V12H26.3146V4.236H27.9106L34.1866 10.416ZM44.703 4.236V5.568H38.727V7.656H43.623V8.904H38.727V12H37.131V4.236H44.703ZM50.2471 12.156C49.2151 12.156 48.3311 11.996 47.5951 11.676C46.8671 11.348 46.3071 10.884 45.9151 10.284C45.5311 9.684 45.3391 8.964 45.3391 8.124C45.3391 7.276 45.5311 6.552 45.9151 5.952C46.3071 5.352 46.8671 4.892 47.5951 4.572C48.3311 4.244 49.2151 4.08 50.2471 4.08C51.2871 4.08 52.1711 4.244 52.8991 4.572C53.6271 4.892 54.1831 5.352 54.5671 5.952C54.9591 6.552 55.1551 7.276 55.1551 8.124C55.1551 8.964 54.9591 9.684 54.5671 10.284C54.1831 10.884 53.6271 11.348 52.8991 11.676C52.1711 11.996 51.2871 12.156 50.2471 12.156ZM50.2471 10.776C50.8871 10.776 51.4471 10.68 51.9271 10.488C52.4151 10.296 52.7951 10.004 53.0671 9.612C53.3471 9.22 53.4871 8.724 53.4871 8.124C53.4871 7.524 53.3471 7.028 53.0671 6.636C52.7951 6.244 52.4151 5.952 51.9271 5.76C51.4471 5.56 50.8871 5.46 50.2471 5.46C49.6151 5.46 49.0511 5.56 48.5551 5.76C48.0591 5.952 47.6711 6.244 47.3911 6.636C47.1111 7.028 46.9711 7.524 46.9711 8.124C46.9711 8.724 47.1111 9.22 47.3911 9.612C47.6711 10.004 48.0591 10.296 48.5551 10.488C49.0511 10.68 49.6151 10.776 50.2471 10.776Z"
      fill="black"
    />
  </svg>
);
const QueryBadge: SVGComponent = (props) => (
  <svg
    width="90"
    height="17"
    viewBox="0 0 90 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="90" height="17" fill="#996DFF" />
    <path
      d="M10.4997 5.79167C10.4997 5.21703 10.2714 4.66593 9.86507 4.2596C9.45874 3.85327 8.90764 3.625 8.33301 3.625H5.08301V11.75H8.87467C9.30565 11.75 9.71898 11.9212 10.0237 12.226C10.3285 12.5307 10.4997 12.944 10.4997 13.375M10.4997 5.79167V13.375M10.4997 5.79167C10.4997 5.21703 10.7279 4.66593 11.1343 4.2596C11.5406 3.85327 12.0917 3.625 12.6663 3.625H15.9163V11.75H12.1247C11.6937 11.75 11.2804 11.9212 10.9756 12.226C10.6709 12.5307 10.4997 12.944 10.4997 13.375M7.24967 6.33333H8.33301M7.24967 8.5H8.33301M12.6663 6.33333H13.7497M12.6663 8.5H13.7497"
      stroke="black"
      stroke-width="1.08333"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M26.264 11.484H27.824V14.4H26.264V11.484ZM27.044 12.156C26.012 12.156 25.128 11.996 24.392 11.676C23.664 11.348 23.104 10.884 22.712 10.284C22.328 9.684 22.136 8.964 22.136 8.124C22.136 7.276 22.328 6.552 22.712 5.952C23.104 5.352 23.664 4.892 24.392 4.572C25.128 4.244 26.012 4.08 27.044 4.08C28.084 4.08 28.968 4.244 29.696 4.572C30.424 4.892 30.98 5.352 31.364 5.952C31.756 6.552 31.952 7.276 31.952 8.124C31.952 8.964 31.756 9.684 31.364 10.284C30.98 10.884 30.424 11.348 29.696 11.676C28.968 11.996 28.084 12.156 27.044 12.156ZM27.044 10.776C27.684 10.776 28.244 10.68 28.724 10.488C29.212 10.296 29.592 10.004 29.864 9.612C30.144 9.22 30.284 8.724 30.284 8.124C30.284 7.524 30.144 7.028 29.864 6.636C29.592 6.244 29.212 5.952 28.724 5.76C28.244 5.56 27.684 5.46 27.044 5.46C26.412 5.46 25.848 5.56 25.352 5.76C24.856 5.952 24.468 6.244 24.188 6.636C23.908 7.028 23.768 7.524 23.768 8.124C23.768 8.724 23.908 9.22 24.188 9.612C24.468 10.004 24.856 10.296 25.352 10.488C25.848 10.68 26.412 10.776 27.044 10.776ZM40.6379 8.568V4.236H42.2339V8.736C42.2339 9.248 42.1579 9.696 42.0059 10.08C41.8619 10.464 41.6539 10.788 41.3819 11.052C41.1099 11.316 40.7899 11.532 40.4219 11.7C40.0619 11.86 39.6659 11.976 39.2339 12.048C38.8099 12.12 38.3619 12.156 37.8899 12.156C37.4019 12.156 36.9379 12.12 36.4979 12.048C36.0579 11.976 35.6539 11.86 35.2859 11.7C34.9259 11.532 34.6139 11.316 34.3499 11.052C34.0859 10.788 33.8779 10.464 33.7259 10.08C33.5819 9.696 33.5099 9.248 33.5099 8.736V4.236H35.1059V8.568C35.1059 9.176 35.2259 9.64 35.4659 9.96C35.7059 10.272 36.0339 10.488 36.4499 10.608C36.8739 10.72 37.3539 10.776 37.8899 10.776C38.4099 10.776 38.8739 10.72 39.2819 10.608C39.6979 10.488 40.0259 10.272 40.2659 9.96C40.5139 9.64 40.6379 9.176 40.6379 8.568ZM45.6763 8.76V10.668H51.6643V12H44.0803V4.236H51.6523V5.568H45.6763V7.5H50.5723V8.76H45.6763ZM53.3029 12V4.236H58.5709C59.1709 4.236 59.6909 4.32 60.1309 4.488C60.5789 4.648 60.9269 4.904 61.1749 5.256C61.4229 5.6 61.5469 6.044 61.5469 6.588C61.5469 6.956 61.4829 7.268 61.3549 7.524C61.2269 7.78 61.0469 7.988 60.8149 8.148C60.5909 8.308 60.3309 8.432 60.0349 8.52C59.7389 8.6 59.4229 8.652 59.0869 8.676L58.9189 8.58C59.4789 8.588 59.9389 8.636 60.2989 8.724C60.6589 8.804 60.9269 8.956 61.1029 9.18C61.2869 9.396 61.3789 9.72 61.3789 10.152V12H59.7829V10.26C59.7829 9.964 59.7309 9.736 59.6269 9.576C59.5229 9.408 59.3349 9.292 59.0629 9.228C58.7989 9.164 58.4149 9.132 57.9109 9.132H54.8989V12H53.3029ZM54.8989 7.884H58.5709C59.0189 7.884 59.3589 7.776 59.5909 7.56C59.8309 7.344 59.9509 7.052 59.9509 6.684C59.9509 6.332 59.8309 6.064 59.5909 5.88C59.3589 5.696 59.0189 5.604 58.5709 5.604H54.8989V7.884ZM70.7926 4.236L67.3846 9.552V12H65.7766V9.552L62.3686 4.236H64.2166L67.0846 8.88H66.1246L68.9446 4.236H70.7926Z"
      fill="black"
    />
  </svg>
);
const ExecutionBadge: SVGComponent = (props) => (
  <svg
    width="121"
    height="17"
    viewBox="0 0 121 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="121" height="17" fill="#50E3C2" />
    <g clip-path="url(#clip0_43_411)">
      <path
        d="M10.4998 10.1251L8.87484 8.50005M10.4998 10.1251C11.2565 9.83729 11.9823 9.47436 12.6665 9.04172M10.4998 10.1251V12.8334C10.4998 12.8334 12.1411 12.5355 12.6665 11.7501C13.2515 10.8726 12.6665 9.04172 12.6665 9.04172M8.87484 8.50005C9.16308 7.75224 9.52603 7.03542 9.95817 6.36047C10.5893 5.35134 11.4681 4.52045 12.511 3.94685C13.554 3.37325 14.7263 3.076 15.9165 3.08339C15.9165 4.55672 15.494 7.14589 12.6665 9.04172M8.87484 8.50005H6.1665C6.1665 8.50005 6.46442 6.8588 7.24984 6.33339C8.12734 5.74839 9.95817 6.33339 9.95817 6.33339M6.43734 10.9376C5.62484 11.6201 5.354 13.6459 5.354 13.6459C5.354 13.6459 7.37984 13.3751 8.06234 12.5626C8.44692 12.1076 8.4415 11.4088 8.01359 10.9863C7.80304 10.7853 7.5257 10.6692 7.23479 10.6602C6.94388 10.6512 6.6599 10.75 6.43734 10.9376Z"
        stroke="black"
        stroke-width="1.08333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <path
      d="M24.02 8.76V10.668H30.008V12H22.424V4.236H29.996V5.568H24.02V7.5H28.916V8.76H24.02ZM37.6347 4.236H39.5787L35.9067 8.52L35.8587 8.568L33.1347 12H31.1907L34.9707 7.5L35.0067 7.464L37.6347 4.236ZM33.2547 4.236L35.8467 7.488L35.8707 7.524L39.6147 12H37.5867L34.8987 8.52L34.8627 8.496L31.3107 4.236H33.2547ZM42.6059 8.76V10.668H48.5939V12H41.0099V4.236H48.5819V5.568H42.6059V7.5H47.5019V8.76H42.6059ZM59.2223 9.204C59.1503 9.828 58.9303 10.36 58.5623 10.8C58.1943 11.24 57.6943 11.576 57.0623 11.808C56.4303 12.04 55.6783 12.156 54.8063 12.156C54.0783 12.156 53.4103 12.072 52.8023 11.904C52.2023 11.736 51.6823 11.484 51.2423 11.148C50.8103 10.812 50.4743 10.396 50.2343 9.9C49.9943 9.396 49.8743 8.808 49.8743 8.136C49.8743 7.464 49.9943 6.876 50.2343 6.372C50.4743 5.868 50.8103 5.448 51.2423 5.112C51.6823 4.768 52.2023 4.512 52.8023 4.344C53.4103 4.168 54.0783 4.08 54.8063 4.08C55.6783 4.08 56.4303 4.2 57.0623 4.44C57.7023 4.68 58.2063 5.024 58.5743 5.472C58.9423 5.912 59.1583 6.448 59.2223 7.08H57.6383C57.5343 6.744 57.3583 6.456 57.1103 6.216C56.8703 5.968 56.5583 5.78 56.1743 5.652C55.7903 5.524 55.3343 5.46 54.8063 5.46C54.1503 5.46 53.5743 5.564 53.0783 5.772C52.5823 5.972 52.1983 6.272 51.9263 6.672C51.6543 7.064 51.5183 7.552 51.5183 8.136C51.5183 8.712 51.6543 9.196 51.9263 9.588C52.1983 9.98 52.5823 10.28 53.0783 10.488C53.5743 10.688 54.1503 10.788 54.8063 10.788C55.3343 10.788 55.7863 10.724 56.1623 10.596C56.5463 10.468 56.8583 10.284 57.0983 10.044C57.3463 9.804 57.5263 9.524 57.6383 9.204H59.2223ZM67.9075 8.568V4.236H69.5035V8.736C69.5035 9.248 69.4275 9.696 69.2755 10.08C69.1315 10.464 68.9235 10.788 68.6515 11.052C68.3795 11.316 68.0595 11.532 67.6915 11.7C67.3315 11.86 66.9355 11.976 66.5035 12.048C66.0795 12.12 65.6315 12.156 65.1595 12.156C64.6715 12.156 64.2075 12.12 63.7675 12.048C63.3275 11.976 62.9235 11.86 62.5555 11.7C62.1955 11.532 61.8835 11.316 61.6195 11.052C61.3555 10.788 61.1475 10.464 60.9955 10.08C60.8515 9.696 60.7795 9.248 60.7795 8.736V4.236H62.3755V8.568C62.3755 9.176 62.4955 9.64 62.7355 9.96C62.9755 10.272 63.3035 10.488 63.7195 10.608C64.1435 10.72 64.6235 10.776 65.1595 10.776C65.6795 10.776 66.1435 10.72 66.5515 10.608C66.9675 10.488 67.2955 10.272 67.5355 9.96C67.7835 9.64 67.9075 9.176 67.9075 8.568ZM70.6658 4.236H78.8498V5.568H70.6658V4.236ZM73.9658 5.4H75.5618V12H73.9658V5.4ZM80.2379 4.236H81.8339V12H80.2379V4.236ZM88.5206 12.156C87.4886 12.156 86.6046 11.996 85.8686 11.676C85.1406 11.348 84.5806 10.884 84.1886 10.284C83.8046 9.684 83.6126 8.964 83.6126 8.124C83.6126 7.276 83.8046 6.552 84.1886 5.952C84.5806 5.352 85.1406 4.892 85.8686 4.572C86.6046 4.244 87.4886 4.08 88.5206 4.08C89.5606 4.08 90.4446 4.244 91.1726 4.572C91.9006 4.892 92.4566 5.352 92.8406 5.952C93.2326 6.552 93.4286 7.276 93.4286 8.124C93.4286 8.964 93.2326 9.684 92.8406 10.284C92.4566 10.884 91.9006 11.348 91.1726 11.676C90.4446 11.996 89.5606 12.156 88.5206 12.156ZM88.5206 10.776C89.1606 10.776 89.7206 10.68 90.2006 10.488C90.6886 10.296 91.0686 10.004 91.3406 9.612C91.6206 9.22 91.7606 8.724 91.7606 8.124C91.7606 7.524 91.6206 7.028 91.3406 6.636C91.0686 6.244 90.6886 5.952 90.2006 5.76C89.7206 5.56 89.1606 5.46 88.5206 5.46C87.8886 5.46 87.3246 5.56 86.8286 5.76C86.3326 5.952 85.9446 6.244 85.6646 6.636C85.3846 7.028 85.2446 7.524 85.2446 8.124C85.2446 8.724 85.3846 9.22 85.6646 9.612C85.9446 10.004 86.3326 10.296 86.8286 10.488C87.3246 10.68 87.8886 10.776 88.5206 10.776ZM102.859 10.416L102.355 10.62V4.236H103.951V12H102.355L96.0785 5.868L96.5825 5.664V12H94.9865V4.236H96.5825L102.859 10.416Z"
      fill="black"
    />
    <defs>
      <clipPath id="clip0_43_411">
        <rect width="13" height="13" fill="white" transform="translate(4 2)" />
      </clipPath>
    </defs>
  </svg>
);

const CoinBadge = styled.span`
  padding: 4px;
  padding-right: 7px;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  vertical-align: bottom;

  border-radius: 13px;
  font-size: 12px;
  font-weight: 700;
  line-height: 100%;

  &.usdc {
    border: 1px solid #009dff;
    background: #0b1229;
    box-shadow: 0px 4px 12px 0px rgba(0, 157, 255, 0.32);
    color: #009dff;
  }

  &.usdt {
    border: 1px solid #21aaaa;
    background: #083232;
    box-shadow: 0px 4px 12px 0px rgba(0, 147, 147, 0.32);
    color: #21aaaa;
  }

  &.mod {
    border: 1px solid #996dff;
    background: #20124f;
    box-shadow: 0px 4px 12px 0px rgba(77, 0, 255, 0.32);
    color: #996dff;
  }

  &.apt {
    border: 1px solid #494949;
    background: #181e1d;
    box-shadow: 0px 4px 12px 0px rgba(164, 164, 164, 0.32);
    color: white;
  }

  img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
`;

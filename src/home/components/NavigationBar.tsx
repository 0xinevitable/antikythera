import styled from '@emotion/styled';
import Link from 'next/link';

type NavigationBarProps = {
  onClickLogo: () => void;
};

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onClickLogo,
}) => {
  return (
    <Container>
      <div
        className="flex items-center gap-[10px] cursor-pointer"
        onClick={onClickLogo}
      >
        <BrandLogo />
        <BrandName>Antikythera</BrandName>
      </div>

      {/* FIXME: */}
      <nav className="mt-1 ml-5 text-sm text-white">
        <Link href="/">About</Link>
      </nav>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  width: 100%;
  height: 64px;
  padding: 0px 20px;

  display: flex;
  align-items: center;

  background: linear-gradient(180deg, #0b0b0b 0%, rgba(11, 11, 11, 0) 100%);
`;
const BrandLogo: React.FC = () => (
  <svg
    width="26"
    height="14"
    viewBox="0 0 26 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26 4.71828H19.4631C18.7015 4.71828 17.9769 4.39144 17.4727 3.82254L14.821 0.826971C14.4263 0.379871 13.8574 0.125488 13.2623 0.125488C12.6672 0.125488 12.0983 0.381413 11.7036 0.826971L9.42955 3.39703C8.6849 4.23727 7.61648 4.71983 6.4941 4.71983H0L5.22678e-05 13.8746H2.54267C3.13623 13.8746 3.70513 13.6325 4.11523 13.2039L7.26034 9.9216C7.65348 9.51151 8.19617 9.28025 8.76352 9.28025H8.89302C9.48967 9.28025 10.057 9.53617 10.4517 9.98327L13.1019 12.9788C13.6061 13.5493 14.3307 13.8746 15.0923 13.8746H25.9985C26 4.71828 25.9985 13.8746 25.9985 4.71983L26 4.71828Z"
      fill="white"
    />
  </svg>
);
const BrandName = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;

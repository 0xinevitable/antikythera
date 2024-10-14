import styled from '@emotion/styled';
import { MotionProps, motion } from 'framer-motion';

import { Brands } from '@/constants/brands';

type BrandBadgeProps = MotionProps & {
  brand: keyof typeof Brands;
  style?: React.CSSProperties;
};
export const BrandBadge: React.FC<BrandBadgeProps> = ({ brand, ...props }) => {
  const info = Brands[brand];

  return (
    <BrandBadgeContainer
      transition={{ ease: 'linear', ...props.transition }}
      {...props}
    >
      <BrandBadgeImage src={info.src} />
      <BrandBadgeText style={{ color: info.color }}>{info.name}</BrandBadgeText>
    </BrandBadgeContainer>
  );
};
const BrandBadgeContainer = styled(motion.div)`
  display: inline-flex;
  padding: 6px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 64px;
  border: 1px solid #000;
  background: linear-gradient(180deg, #1b1b1b 0%, rgba(0, 0, 0, 0.2) 100%);
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
`;
const BrandBadgeImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;
const BrandBadgeText = styled.span`
  color: #4592ff;
  font-size: 24px;
  font-weight: 400;
  line-height: 100%; /* 24px */
`;

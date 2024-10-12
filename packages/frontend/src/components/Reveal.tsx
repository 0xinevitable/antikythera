import { keyframes } from '@emotion/react';
import { Reveal as BaseReveal, RevealProps } from 'react-awesome-reveal';

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 32px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const Reveal: React.FC<RevealProps> = (props) => (
  <BaseReveal
    cascade
    damping={0.2}
    duration={600}
    keyframes={customAnimation}
    {...props}
  />
);

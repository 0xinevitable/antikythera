import styled from '@emotion/styled';
import { NextPage } from 'next';

import { Reveal } from '@/components/Reveal';

import { CallToActionSection } from './sections/CallToActionSection';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { PoweredBySection } from './sections/PoweredBySection';

const LandingPage: NextPage = () => {
  return (
    <Wrapper>
      <Container>
        <div className="flex flex-col items-center w-screen overflow-hidden">
          <Tape className="w-fit">
            <Typography />
            <AptosSymbol />
            <Typography />
            <AptosSymbol />
            <Typography />
            <AptosSymbol />
            <Typography />
            <AptosSymbol />
          </Tape>

          <Reveal>
            <Header />
          </Reveal>
        </div>
      </Container>

      <Reveal delay={200}>
        <PoweredBySection />
      </Reveal>

      <CallToActionSection />
      <Footer />
    </Wrapper>
  );
};

export default LandingPage;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 12px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
`;

const Tape = styled.div`
  margin-top: 40px;
  margin-bottom: -40px;

  display: flex;
  align-items: center;
  gap: 40px;

  border-top: 1px solid #626262;
  border-bottom: 1px solid #626262;
  background: #000;
`;

const Typography: React.FC = () => (
  <svg
    width="451"
    height="30"
    viewBox="0 0 451 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mt-0.5"
  >
    <path
      d="M4.92313 2.296V19.448H18.6831V23H0.667125V2.296H4.92313ZM27.6109 23.352C26.0322 23.352 24.5922 23.0107 23.2909 22.328C22.0109 21.624 20.9869 20.6533 20.2189 19.416C19.4722 18.1573 19.0989 16.7067 19.0989 15.064C19.0989 13.3787 19.4829 11.9173 20.2509 10.68C21.0189 9.44267 22.0535 8.48267 23.3549 7.8C24.6775 7.096 26.1709 6.744 27.8349 6.744C29.6695 6.744 31.1415 7.11733 32.2509 7.864C33.3815 8.58933 34.2029 9.58133 34.7149 10.84C35.2269 12.0987 35.4829 13.5067 35.4829 15.064C35.4829 16.0027 35.3335 16.9627 35.0349 17.944C34.7362 18.904 34.2775 19.8 33.6589 20.632C33.0402 21.4427 32.2295 22.104 31.2269 22.616C30.2242 23.1067 29.0189 23.352 27.6109 23.352ZM28.9549 20.152C30.2135 20.152 31.3015 19.9387 32.2189 19.512C33.1362 19.0853 33.8402 18.488 34.3309 17.72C34.8215 16.952 35.0669 16.0667 35.0669 15.064C35.0669 13.976 34.8109 13.0587 34.2989 12.312C33.8082 11.544 33.1042 10.968 32.1869 10.584C31.2909 10.1787 30.2135 9.976 28.9549 9.976C27.1842 9.976 25.8082 10.4453 24.8269 11.384C23.8455 12.3013 23.3549 13.528 23.3549 15.064C23.3549 16.088 23.5895 16.984 24.0589 17.752C24.5282 18.4987 25.1789 19.0853 26.0109 19.512C26.8642 19.9387 27.8455 20.152 28.9549 20.152ZM35.0669 7.096H39.2269V23H35.3549C35.3549 23 35.3229 22.7973 35.2589 22.392C35.2162 21.9653 35.1735 21.432 35.1309 20.792C35.0882 20.152 35.0669 19.5227 35.0669 18.904V7.096ZM59.7919 23H55.6319V7.096H59.7919V23ZM55.8559 15.352L55.8879 16.44C55.8452 16.7387 55.7385 17.176 55.5679 17.752C55.3972 18.3067 55.1305 18.904 54.7679 19.544C54.4265 20.184 53.9785 20.8027 53.4239 21.4C52.8692 21.976 52.1865 22.456 51.3759 22.84C50.5652 23.2027 49.6052 23.384 48.4959 23.384C47.6212 23.384 46.7572 23.2773 45.9039 23.064C45.0719 22.8507 44.3145 22.4987 43.6319 22.008C42.9492 21.496 42.4052 20.8133 41.9999 19.96C41.5945 19.1067 41.3919 18.0293 41.3919 16.728V7.096H45.5519V16.024C45.5519 17.048 45.7119 17.8587 46.0319 18.456C46.3732 19.032 46.8639 19.4373 47.5039 19.672C48.1439 19.9067 48.9012 20.024 49.7759 20.024C50.9279 20.024 51.9199 19.7787 52.7519 19.288C53.5839 18.776 54.2559 18.1573 54.7679 17.432C55.3012 16.7067 55.6639 16.0133 55.8559 15.352ZM61.9794 7.096H66.1394V23H61.9794V7.096ZM73.5314 6.744C74.5127 6.744 75.4194 6.872 76.2514 7.128C77.0834 7.384 77.8087 7.77867 78.4274 8.312C79.046 8.84533 79.526 9.528 79.8674 10.36C80.2087 11.1707 80.3794 12.1413 80.3794 13.272V23H76.2194V14.008C76.2194 12.664 75.8887 11.6827 75.2274 11.064C74.5874 10.424 73.5314 10.104 72.0594 10.104C70.95 10.104 69.9474 10.3173 69.0514 10.744C68.1554 11.1707 67.43 11.7147 66.8754 12.376C66.3207 13.016 66.0007 13.688 65.9154 14.392L65.8834 12.76C65.99 12.0133 66.2354 11.288 66.6194 10.584C67.0034 9.88 67.5154 9.24 68.1554 8.664C68.8167 8.06667 69.5954 7.59733 70.4914 7.256C71.3874 6.91467 72.4007 6.744 73.5314 6.744ZM101.447 16.728C101.34 18.1147 100.892 19.3093 100.103 20.312C99.3349 21.3147 98.2682 22.0827 96.9029 22.616C95.5375 23.128 93.9162 23.384 92.0389 23.384C90.0762 23.384 88.3162 23.0747 86.7589 22.456C85.2229 21.816 84.0069 20.888 83.1109 19.672C82.2362 18.4347 81.7989 16.9093 81.7989 15.096C81.7989 13.2827 82.2362 11.7573 83.1109 10.52C84.0069 9.28267 85.2229 8.344 86.7589 7.704C88.3162 7.064 90.0762 6.744 92.0389 6.744C93.9162 6.744 95.5269 7.01067 96.8709 7.544C98.2149 8.056 99.2709 8.80267 100.039 9.784C100.828 10.7653 101.287 11.9493 101.415 13.336H97.6069C97.2442 12.2693 96.5722 11.4373 95.5909 10.84C94.6095 10.2427 93.4255 9.944 92.0389 9.944C90.9295 9.944 89.9162 10.136 88.9989 10.52C88.1029 10.904 87.3775 11.48 86.8229 12.248C86.2895 12.9947 86.0229 13.944 86.0229 15.096C86.0229 16.2267 86.2895 17.176 86.8229 17.944C87.3562 18.6907 88.0815 19.256 88.9989 19.64C89.9162 20.0027 90.9295 20.184 92.0389 20.184C93.5322 20.184 94.7482 19.8853 95.6869 19.288C96.6469 18.6907 97.2975 17.8373 97.6389 16.728H101.447ZM117.432 23V14.264C117.432 13.3893 117.283 12.664 116.984 12.088C116.686 11.512 116.206 11.0747 115.544 10.776C114.904 10.4773 114.04 10.328 112.952 10.328C111.907 10.328 110.958 10.5307 110.104 10.936C109.251 11.32 108.558 11.832 108.024 12.472C107.491 13.0907 107.192 13.752 107.128 14.456L107.096 12.696C107.203 11.992 107.448 11.288 107.832 10.584C108.216 9.88 108.728 9.24 109.368 8.664C110.008 8.088 110.776 7.62933 111.672 7.288C112.59 6.92533 113.614 6.744 114.744 6.744C115.726 6.744 116.632 6.872 117.464 7.128C118.296 7.36267 119.022 7.736 119.64 8.248C120.259 8.76 120.739 9.4 121.08 10.168C121.422 10.9147 121.592 11.8 121.592 12.824V23H117.432ZM103.192 23V0.695999H107.352V23H103.192ZM151.044 2.296L141.956 16.472V23H137.668V16.472L128.58 2.296H133.508L141.156 14.68H138.596L146.116 2.296H151.044ZM158.199 23.384C156.194 23.384 154.423 23.064 152.887 22.424C151.372 21.784 150.188 20.856 149.335 19.64C148.482 18.4027 148.055 16.888 148.055 15.096C148.055 13.304 148.482 11.7893 149.335 10.552C150.188 9.29333 151.372 8.344 152.887 7.704C154.423 7.064 156.194 6.744 158.199 6.744C160.204 6.744 161.954 7.064 163.447 7.704C164.962 8.344 166.146 9.29333 166.999 10.552C167.852 11.7893 168.279 13.304 168.279 15.096C168.279 16.888 167.852 18.4027 166.999 19.64C166.146 20.856 164.962 21.784 163.447 22.424C161.954 23.064 160.204 23.384 158.199 23.384ZM158.199 20.184C159.308 20.184 160.3 19.992 161.175 19.608C162.071 19.2027 162.775 18.6267 163.287 17.88C163.799 17.112 164.055 16.184 164.055 15.096C164.055 14.008 163.799 13.08 163.287 12.312C162.775 11.5227 162.082 10.9253 161.207 10.52C160.332 10.1147 159.33 9.912 158.199 9.912C157.09 9.912 156.087 10.1147 155.191 10.52C154.295 10.9253 153.58 11.512 153.047 12.28C152.535 13.048 152.279 13.9867 152.279 15.096C152.279 16.184 152.535 17.112 153.047 17.88C153.559 18.6267 154.263 19.2027 155.159 19.608C156.055 19.992 157.068 20.184 158.199 20.184ZM188.154 23H183.994V7.096H188.154V23ZM184.218 15.352L184.25 16.44C184.208 16.7387 184.101 17.176 183.93 17.752C183.76 18.3067 183.493 18.904 183.13 19.544C182.789 20.184 182.341 20.8027 181.786 21.4C181.232 21.976 180.549 22.456 179.738 22.84C178.928 23.2027 177.968 23.384 176.858 23.384C175.984 23.384 175.12 23.2773 174.266 23.064C173.434 22.8507 172.677 22.4987 171.994 22.008C171.312 21.496 170.768 20.8133 170.362 19.96C169.957 19.1067 169.754 18.0293 169.754 16.728V7.096H173.914V16.024C173.914 17.048 174.074 17.8587 174.394 18.456C174.736 19.032 175.226 19.4373 175.866 19.672C176.506 19.9067 177.264 20.024 178.138 20.024C179.29 20.024 180.282 19.7787 181.114 19.288C181.946 18.776 182.618 18.1573 183.13 17.432C183.664 16.7067 184.026 16.0133 184.218 15.352ZM190.342 7.096H194.502V23H190.342V7.096ZM200.614 10.52C199.419 10.52 198.385 10.7547 197.51 11.224C196.635 11.672 195.931 12.2267 195.398 12.888C194.865 13.5493 194.491 14.1893 194.278 14.808L194.246 13.048C194.267 12.792 194.353 12.4187 194.502 11.928C194.651 11.416 194.875 10.872 195.174 10.296C195.473 9.69867 195.867 9.13333 196.358 8.6C196.849 8.04533 197.446 7.59733 198.15 7.256C198.854 6.91467 199.675 6.744 200.614 6.744V10.52ZM211.48 18.488V14.936H225.176V18.488H211.48ZM206.328 23L216.056 2.296H220.664L230.488 23H225.848L217.336 4.344H219.384L210.936 23H206.328ZM239.103 20.568C237.375 20.568 235.85 20.312 234.527 19.8C233.226 19.2667 232.212 18.488 231.487 17.464C230.762 16.44 230.399 15.2027 230.399 13.752C230.399 12.3227 230.751 11.0853 231.455 10.04C232.159 8.99467 233.162 8.184 234.463 7.608C235.786 7.032 237.332 6.744 239.103 6.744C239.594 6.744 240.063 6.776 240.511 6.84C240.98 6.904 241.439 6.98933 241.887 7.096L249.919 7.128V10.264C248.831 10.2853 247.722 10.1573 246.591 9.88C245.482 9.58133 244.5 9.26133 243.647 8.92L243.551 8.696C244.276 9.03733 244.959 9.464 245.599 9.976C246.239 10.4667 246.751 11.0427 247.135 11.704C247.54 12.344 247.743 13.0907 247.743 13.944C247.743 15.3307 247.391 16.5253 246.687 17.528C245.983 18.5093 244.98 19.2667 243.679 19.8C242.399 20.312 240.874 20.568 239.103 20.568ZM244.447 29.56V28.792C244.447 27.8107 244.127 27.128 243.487 26.744C242.868 26.36 242.015 26.168 240.927 26.168H235.967C235.007 26.168 234.196 26.0933 233.535 25.944C232.895 25.7947 232.383 25.5813 231.999 25.304C231.615 25.0267 231.338 24.696 231.167 24.312C230.996 23.9493 230.911 23.5547 230.911 23.128C230.911 22.2747 231.188 21.6347 231.743 21.208C232.298 20.76 233.044 20.4613 233.983 20.312C234.922 20.1627 235.956 20.1307 237.087 20.216L239.103 20.568C237.759 20.6107 236.756 20.728 236.095 20.92C235.455 21.0907 235.135 21.4427 235.135 21.976C235.135 22.296 235.263 22.552 235.519 22.744C235.775 22.9147 236.138 23 236.607 23H241.823C243.252 23 244.468 23.1493 245.471 23.448C246.495 23.768 247.274 24.2907 247.807 25.016C248.34 25.7627 248.607 26.776 248.607 28.056V29.56H244.447ZM239.103 17.56C240.02 17.56 240.82 17.4107 241.503 17.112C242.207 16.8133 242.751 16.3867 243.135 15.832C243.519 15.256 243.711 14.5733 243.711 13.784C243.711 12.9733 243.519 12.28 243.135 11.704C242.751 11.128 242.218 10.6907 241.535 10.392C240.852 10.072 240.042 9.912 239.103 9.912C238.186 9.912 237.375 10.072 236.671 10.392C235.967 10.6907 235.423 11.128 235.039 11.704C234.655 12.28 234.463 12.9733 234.463 13.784C234.463 14.5733 234.655 15.256 235.039 15.832C235.423 16.3867 235.956 16.8133 236.639 17.112C237.343 17.4107 238.164 17.56 239.103 17.56ZM265.25 17.72H269.282C269.112 18.808 268.653 19.7787 267.906 20.632C267.181 21.4853 266.189 22.1573 264.93 22.648C263.672 23.1387 262.136 23.384 260.322 23.384C258.296 23.384 256.504 23.064 254.946 22.424C253.389 21.7627 252.173 20.8133 251.298 19.576C250.424 18.3387 249.986 16.8453 249.986 15.096C249.986 13.3467 250.413 11.8533 251.266 10.616C252.12 9.35733 253.304 8.39733 254.818 7.736C256.354 7.07467 258.146 6.744 260.194 6.744C262.285 6.744 264.024 7.07467 265.41 7.736C266.797 8.39733 267.821 9.4 268.482 10.744C269.165 12.0667 269.453 13.7627 269.346 15.832H254.178C254.285 16.6427 254.584 17.3787 255.074 18.04C255.586 18.7013 256.269 19.224 257.122 19.608C257.997 19.992 259.032 20.184 260.226 20.184C261.549 20.184 262.648 19.96 263.522 19.512C264.418 19.0427 264.994 18.4453 265.25 17.72ZM260.002 9.912C258.466 9.912 257.218 10.2533 256.258 10.936C255.298 11.5973 254.68 12.4187 254.402 13.4H265.218C265.112 12.3333 264.6 11.4907 263.682 10.872C262.786 10.232 261.56 9.912 260.002 9.912ZM270.842 7.096H275.002V23H270.842V7.096ZM282.394 6.744C283.375 6.744 284.282 6.872 285.114 7.128C285.946 7.384 286.671 7.77867 287.29 8.312C287.909 8.84533 288.389 9.528 288.73 10.36C289.071 11.1707 289.242 12.1413 289.242 13.272V23H285.082V14.008C285.082 12.664 284.751 11.6827 284.09 11.064C283.45 10.424 282.394 10.104 280.922 10.104C279.813 10.104 278.81 10.3173 277.914 10.744C277.018 11.1707 276.293 11.7147 275.738 12.376C275.183 13.016 274.863 13.688 274.778 14.392L274.746 12.76C274.853 12.0133 275.098 11.288 275.482 10.584C275.866 9.88 276.378 9.24 277.018 8.664C277.679 8.06667 278.458 7.59733 279.354 7.256C280.25 6.91467 281.263 6.744 282.394 6.744ZM290.309 7.096H302.661V10.328H290.309V7.096ZM294.405 2.744H298.565V23H294.405V2.744ZM319.199 23.384C317.194 23.384 315.423 23.064 313.887 22.424C312.372 21.784 311.188 20.856 310.335 19.64C309.482 18.4027 309.055 16.888 309.055 15.096C309.055 13.304 309.482 11.7893 310.335 10.552C311.188 9.29333 312.372 8.344 313.887 7.704C315.423 7.064 317.194 6.744 319.199 6.744C321.204 6.744 322.954 7.064 324.447 7.704C325.962 8.344 327.146 9.29333 327.999 10.552C328.852 11.7893 329.279 13.304 329.279 15.096C329.279 16.888 328.852 18.4027 327.999 19.64C327.146 20.856 325.962 21.784 324.447 22.424C322.954 23.064 321.204 23.384 319.199 23.384ZM319.199 20.184C320.308 20.184 321.3 19.992 322.175 19.608C323.071 19.2027 323.775 18.6267 324.287 17.88C324.799 17.112 325.055 16.184 325.055 15.096C325.055 14.008 324.799 13.08 324.287 12.312C323.775 11.5227 323.082 10.9253 322.207 10.52C321.332 10.1147 320.33 9.912 319.199 9.912C318.09 9.912 317.087 10.1147 316.191 10.52C315.295 10.9253 314.58 11.512 314.047 12.28C313.535 13.048 313.279 13.9867 313.279 15.096C313.279 16.184 313.535 17.112 314.047 17.88C314.559 18.6267 315.263 19.2027 316.159 19.608C317.055 19.992 318.068 20.184 319.199 20.184ZM330.754 7.096H334.914V23H330.754V7.096ZM342.306 6.744C343.288 6.744 344.194 6.872 345.026 7.128C345.858 7.384 346.584 7.77867 347.202 8.312C347.821 8.84533 348.301 9.528 348.642 10.36C348.984 11.1707 349.154 12.1413 349.154 13.272V23H344.994V14.008C344.994 12.664 344.664 11.6827 344.002 11.064C343.362 10.424 342.306 10.104 340.834 10.104C339.725 10.104 338.722 10.3173 337.826 10.744C336.93 11.1707 336.205 11.7147 335.65 12.376C335.096 13.016 334.776 13.688 334.69 14.392L334.658 12.76C334.765 12.0133 335.01 11.288 335.394 10.584C335.778 9.88 336.29 9.24 336.93 8.664C337.592 8.06667 338.37 7.59733 339.266 7.256C340.162 6.91467 341.176 6.744 342.306 6.744ZM361.237 18.488V14.936H374.933V18.488H361.237ZM356.085 23L365.813 2.296H370.421L380.245 23H375.605L367.093 4.344H369.141L360.693 23H356.085ZM392.695 23.384C391.287 23.384 390.081 23.1387 389.079 22.648C388.097 22.136 387.297 21.4747 386.679 20.664C386.06 19.832 385.601 18.9253 385.303 17.944C385.004 16.9627 384.855 16.0027 384.855 15.064C384.855 13.8907 384.993 12.8027 385.271 11.8C385.569 10.7973 386.028 9.92267 386.647 9.176C387.265 8.408 388.065 7.81067 389.047 7.384C390.049 6.95733 391.265 6.744 392.695 6.744C394.295 6.744 395.735 7.096 397.015 7.8C398.295 8.504 399.308 9.48533 400.055 10.744C400.823 11.9813 401.207 13.4213 401.207 15.064C401.207 16.7493 400.823 18.2213 400.055 19.48C399.287 20.7173 398.263 21.6773 396.983 22.36C395.703 23.0427 394.273 23.384 392.695 23.384ZM391.351 20.152C392.481 20.152 393.463 19.9387 394.295 19.512C395.148 19.0853 395.799 18.4987 396.247 17.752C396.716 16.984 396.951 16.088 396.951 15.064C396.951 13.528 396.46 12.2907 395.479 11.352C394.519 10.4133 393.143 9.944 391.351 9.944C390.22 9.944 389.185 10.1467 388.247 10.552C387.329 10.9573 386.604 11.544 386.071 12.312C385.537 13.0587 385.271 13.976 385.271 15.064C385.271 16.088 385.516 16.984 386.007 17.752C386.497 18.4987 387.201 19.0853 388.119 19.512C389.036 19.9387 390.113 20.152 391.351 20.152ZM381.111 7.096H385.079L385.271 11.32V29.4H381.111V7.096ZM401.547 7.096H413.899V10.328H401.547V7.096ZM405.643 2.744H409.803V23H405.643V2.744ZM424.099 23.384C422.094 23.384 420.323 23.064 418.787 22.424C417.272 21.784 416.088 20.856 415.235 19.64C414.382 18.4027 413.955 16.888 413.955 15.096C413.955 13.304 414.382 11.7893 415.235 10.552C416.088 9.29333 417.272 8.344 418.787 7.704C420.323 7.064 422.094 6.744 424.099 6.744C426.104 6.744 427.854 7.064 429.347 7.704C430.862 8.344 432.046 9.29333 432.899 10.552C433.752 11.7893 434.179 13.304 434.179 15.096C434.179 16.888 433.752 18.4027 432.899 19.64C432.046 20.856 430.862 21.784 429.347 22.424C427.854 23.064 426.104 23.384 424.099 23.384ZM424.099 20.184C425.208 20.184 426.2 19.992 427.075 19.608C427.971 19.2027 428.675 18.6267 429.187 17.88C429.699 17.112 429.955 16.184 429.955 15.096C429.955 14.008 429.699 13.08 429.187 12.312C428.675 11.5227 427.982 10.9253 427.107 10.52C426.232 10.1147 425.23 9.912 424.099 9.912C422.99 9.912 421.987 10.1147 421.091 10.52C420.195 10.9253 419.48 11.512 418.947 12.28C418.435 13.048 418.179 13.9867 418.179 15.096C418.179 16.184 418.435 17.112 418.947 17.88C419.459 18.6267 420.163 19.2027 421.059 19.608C421.955 19.992 422.968 20.184 424.099 20.184ZM435.014 17.72H438.854C439.089 18.4453 439.569 19.0427 440.294 19.512C441.041 19.96 442.012 20.184 443.206 20.184C444.017 20.184 444.646 20.1093 445.094 19.96C445.542 19.8107 445.852 19.5973 446.022 19.32C446.193 19.0213 446.278 18.6907 446.278 18.328C446.278 17.88 446.14 17.5387 445.862 17.304C445.585 17.048 445.158 16.8453 444.582 16.696C444.006 16.5467 443.27 16.408 442.374 16.28C441.478 16.1307 440.614 15.9493 439.782 15.736C438.95 15.5227 438.214 15.2453 437.574 14.904C436.934 14.5413 436.422 14.0933 436.038 13.56C435.676 13.0053 435.494 12.3333 435.494 11.544C435.494 10.776 435.676 10.0933 436.038 9.496C436.422 8.89867 436.945 8.39733 437.606 7.992C438.289 7.58667 439.078 7.27733 439.974 7.064C440.892 6.85067 441.873 6.744 442.918 6.744C444.497 6.744 445.809 6.97867 446.854 7.448C447.9 7.896 448.678 8.536 449.19 9.368C449.724 10.1787 449.99 11.1173 449.99 12.184H446.31C446.14 11.3947 445.798 10.8293 445.286 10.488C444.774 10.1253 443.985 9.944 442.918 9.944C441.873 9.944 441.084 10.104 440.55 10.424C440.017 10.744 439.75 11.1813 439.75 11.736C439.75 12.184 439.91 12.536 440.23 12.792C440.572 13.0267 441.062 13.2187 441.702 13.368C442.364 13.5173 443.185 13.6773 444.166 13.848C444.998 14.0187 445.788 14.2107 446.534 14.424C447.302 14.6373 447.985 14.9147 448.582 15.256C449.18 15.576 449.649 16.0133 449.99 16.568C450.353 17.1013 450.534 17.784 450.534 18.616C450.534 19.64 450.236 20.504 449.638 21.208C449.062 21.912 448.23 22.456 447.142 22.84C446.054 23.2027 444.753 23.384 443.238 23.384C441.894 23.384 440.732 23.2453 439.75 22.968C438.79 22.6693 437.99 22.296 437.35 21.848C436.71 21.3787 436.209 20.888 435.846 20.376C435.505 19.8427 435.27 19.3413 435.142 18.872C435.014 18.4027 434.972 18.0187 435.014 17.72Z"
      fill="#626262"
    />
  </svg>
);
const AptosSymbol: React.FC = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="40" height="40" fill="black" />
    <path
      d="M27.1675 15.5874H24.8318C24.5596 15.5874 24.3007 15.4706 24.1206 15.2673L23.173 14.1969C23.032 14.0372 22.8287 13.9463 22.6161 13.9463C22.4034 13.9463 22.2002 14.0377 22.0591 14.1969L21.2466 15.1153C20.9805 15.4155 20.5987 15.5879 20.1977 15.5879H7.41214C7.04801 16.6258 6.81057 17.7221 6.71582 18.8591H18.7858C18.9979 18.8591 19.2011 18.7726 19.3477 18.6195L20.4715 17.4466C20.612 17.3001 20.8059 17.2175 21.0086 17.2175H21.0549C21.2681 17.2175 21.4708 17.3089 21.6118 17.4687L22.5588 18.539C22.7389 18.7429 22.9979 18.8591 23.27 18.8591H33.1221C33.0273 17.7215 32.7899 16.6253 32.4257 15.5879H27.167L27.1675 15.5874Z"
      fill="#626262"
    />
    <path
      d="M14.0228 25.7374C14.2349 25.7374 14.4382 25.6509 14.5847 25.4977L15.7085 24.3249C15.849 24.1784 16.0429 24.0957 16.2456 24.0957H16.2919C16.5051 24.0957 16.7078 24.1872 16.8489 24.3464L17.7958 25.4168C17.976 25.6206 18.2349 25.7368 18.507 25.7368H31.8583C32.3586 24.7034 32.7249 23.5944 32.943 22.4326H20.1277C19.8556 22.4326 19.5967 22.3158 19.4166 22.1125L18.4696 21.0422C18.3286 20.8824 18.1253 20.7915 17.9126 20.7915C17.7 20.7915 17.4967 20.883 17.3557 21.0422L16.5431 21.9605C16.277 22.2607 15.8953 22.4331 15.4937 22.4331H6.90039C7.11854 23.595 7.48543 24.7039 7.98509 25.7374H14.0223H14.0228Z"
      fill="#626262"
    />
    <path
      d="M23.495 12.0122C23.7071 12.0122 23.9104 11.9257 24.0569 11.7725L25.1807 10.5997C25.3212 10.4532 25.5151 10.3705 25.7178 10.3705H25.7641C25.9773 10.3705 26.18 10.462 26.3211 10.6217L27.268 11.6921C27.4482 11.8959 27.7071 12.0122 27.9792 12.0122H30.5183C28.1004 8.79829 24.2547 6.71924 19.9225 6.71924C15.5903 6.71924 11.7446 8.79829 9.32617 12.0122H23.495Z"
      fill="#626262"
    />
    <path
      d="M18.3917 29.0124H14.9195C14.6474 29.0124 14.3884 28.8956 14.2083 28.6924L13.2613 27.622C13.1203 27.4622 12.917 27.3713 12.7044 27.3713C12.4917 27.3713 12.2885 27.4628 12.1474 27.622L11.3349 28.5403C11.0688 28.8406 10.687 29.013 10.2854 29.013H10.2314C12.6504 31.6049 16.0951 33.2273 19.9199 33.2273C23.7447 33.2273 27.1889 31.6049 29.6084 29.013H18.3917V29.0124Z"
      fill="#626262"
    />
  </svg>
);

import styled from '@emotion/styled';
import { BadgeInfoIcon, Wand2Icon } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button as BaseButton } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type InputSectionProps = {
  isLoading: boolean;
  onClickSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onStop: () => void;

  value: string;
  onChangeValue: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const InputSection = forwardRef<HTMLTextAreaElement, InputSectionProps>(
  (
    {
      isLoading,
      onClickSubmit,
      onStop,

      value,
      onChangeValue,
    },
    ref,
  ) => {
    const [isFocused, setFocused] = useState<boolean>(false);

    return (
      <>
        <Form
          // ref={bottomBarRef}
          onSubmit={onClickSubmit}
        >
          <div className="flex gap-[10px] items-center">
            <Wand2Icon color="#9b9cad" size={18} />
            <Title>Ask Anything</Title>
          </div>

          <TextareaCard className={cn(isFocused && 'focused')}>
            <Textarea
              // TODO: auto-grow height of textarea
              ref={ref}
              value={value}
              onChange={onChangeValue}
              placeholder="Enter your query here..."
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {!isLoading ? (
              <Button type="submit">Start</Button>
            ) : (
              <Button type="button" onClick={onStop}>
                Stop
              </Button>
            )}
          </TextareaCard>

          <ModelBadge>
            <BadgeInfoIcon size={12} />
            {/* <span>Claude 3.5 Sonnet</span> */}
            <span>GPT-4o</span>
          </ModelBadge>
        </Form>
        <BottomHeight />
      </>
    );
  },
);

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;

  position: relative;
  padding: 18px 18px 16px;

  border-radius: 12px;
  border: 1px solid #3f3f3f;
  background: #1b1b1b;
  z-index: 0;
  overflow: hidden;

  &::after {
    content: '';
    width: 160px; // 100 + 60
    height: 80px; // 50 + 30

    position: absolute;
    top: 0px;
    left: 80px;

    background-image: url('/assets/section-blur.png');
    background-size: cover;
    z-index: -1;
    filter: blur(2px);
  }

  @media screen and (max-width: 660px) {
    padding: 16px;

    position: fixed;
    bottom: 0;
    width: calc(100% - 24px);
    left: 12px;
    right: 12px;

    box-shadow: 0px -8px 16px 0px rgba(0, 0, 0, 0.45);

    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`;
const BottomHeight = styled.div`
  height: 0;
  width: 100%;

  @media screen and (max-width: 660px) {
    height: 100px;
  }
`;

const Title = styled.h2`
  color: #9b9cad;
  font-size: 18px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;

const TextareaCard = styled.div`
  margin-top: 12px;
  padding: 0;
  width: 100%;
  overflow: hidden;
  display: flex;

  border-radius: 8px 8px 0px 0px;
  background: linear-gradient(180deg, #282c2c 0%, #203530 100%);

  border-bottom: 1px solid #3f3f3f;
  transition: border-bottom-color 0.12s ease;

  &.focused {
    outline: 0;
    border-bottom-color: #50e3c2;
  }
`;
const Textarea = styled.textarea`
  padding: 12px;
  border: 0;
  resize: none;

  display: flex;
  flex: 1;

  background-color: transparent;
  color: #50e3c2;
  font-size: 14px;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: #9b9cad;
  }
`;

const ModelBadge = styled.div`
  margin-top: 8px;
  border-radius: 4px;
  background: rgba(155, 156, 173, 0.45);

  width: fit-content;
  display: flex;
  padding: 4px 6px 4px 5px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    color: #0e1917;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 95%; /* 11.4px */
  }
`;

const Button = styled(BaseButton)`
  min-width: 90px;
  margin-top: 12px;
  margin-right: 12px;

  border-radius: 8px;
  background-color: #50e3c2;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.38);

  color: #000;
  font-size: 16px;
  font-weight: 900;
  line-height: 95%; /* 15.2px */

  transition: background-color 0.12s ease;

  &:hover {
    background-color: #3db49a;
  }
`;

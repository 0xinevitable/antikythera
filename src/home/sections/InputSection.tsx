import styled from '@emotion/styled';
import { BadgeInfoIcon, Wand2Icon } from 'lucide-react';
import { forwardRef } from 'react';

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
    return (
      <Form
        // ref={bottomBarRef}
        onSubmit={onClickSubmit}
      >
        <div className="flex gap-[10px] items-center">
          <Wand2Icon color="#fff" size={18} />
          <Title>Ask Anything</Title>
        </div>

        <Textarea
          // TODO: auto-grow height of textarea
          ref={ref}
          value={value}
          onChange={onChangeValue}
          placeholder="Enter your query here..."
          className="w-full p-2 text-white bg-gray-700 border rounded"
        />

        <ModelBadge>
          <BadgeInfoIcon size={12} />
          <span>Claude 3.5 Sonnet</span>
        </ModelBadge>
      </Form>
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
`;

const Title = styled.h2`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 100%; /* 20px */
`;

const Textarea = styled.textarea`
  margin-top: 12px;
  padding: 12px;

  border-radius: 8px 8px 0px 0px;
  border: 0;
  background: linear-gradient(180deg, #282c2c 0%, #203530 100%);

  color: #50e3c2;
  font-size: 14px;

  border-bottom: 1px solid #3f3f3f;
  transition: border-bottom-color 0.12s ease;

  resize: none;

  &:focus {
    outline: 0;
    border-bottom-color: #50e3c2;
  }

  &::placeholder {
    color: #9b9cad;
  }
`;

const ModelBadge = styled.div`
  margin-top: 8px;
  border-radius: 4px;
  background: #9b9cad;

  width: fit-content;
  display: flex;
  padding: 4px 6px 4px 5px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  span {
    color: #0e1917;
    font-family: Satoshi;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 95%; /* 11.4px */
  }
`;

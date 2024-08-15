import styled from '@emotion/styled';
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
      <form
        // ref={bottomBarRef}
        onSubmit={onClickSubmit}
        className="w-full mb-4"
      >
        <Textarea
          // TODO: auto-grow height of textarea
          ref={ref}
          value={value}
          onChange={onChangeValue}
          placeholder="Enter your query here..."
          className="w-full p-2 text-white bg-gray-700 border rounded"
        />
        <button
          type="submit"
          className="p-2 mt-2 mr-2 text-white bg-blue-500 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
        {isLoading && (
          <button
            type="button"
            onClick={onStop}
            className="p-2 mt-2 text-white bg-red-500 rounded"
          >
            Stop
          </button>
        )}
      </form>
    );
  },
);

const Textarea = styled.textarea`
  padding: 16px;

  border-radius: 8px 8px 0px 0px;
  border: 0;
  border-bottom: 1px solid #50e3c2;
  background: linear-gradient(180deg, #282c2c 0%, #203530 100%);

  color: #50e3c2;
`;

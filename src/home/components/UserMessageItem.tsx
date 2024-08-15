import { BasicMessageProps } from '../types';

export const UserMessageItem: React.FC<BasicMessageProps> = ({ message }) => {
  return (
    <div className="ml-auto flex flex-col bg-[#55FFD9] text-black w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tr-none">
      <span className="grid-col-1 grid gap-2.5 [&_>_*]:min-w-0 text-sm leading-snug">
        {message.content}
      </span>
    </div>
  );
};

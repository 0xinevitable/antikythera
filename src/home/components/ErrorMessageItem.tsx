import { capitalizeFirstLetter } from '@/utils/format';

import { BasicMessageProps } from '../types';

export const ErrorMessageItem: React.FC<BasicMessageProps> = ({ message }) => {
  return (
    <div
      className="mr-auto flex flex-col bg-[#55FFD9] text-black w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tl-none"
      style={{
        padding: `12px 16px`,
        color: '#c2c3d0',
        background: `linear-gradient(180deg, #342C2C 0%, #27272A 100%)`,
      }}
    >
      <strong>{capitalizeFirstLetter(message.role)}</strong>
      <span className="grid-col-1 grid gap-2.5 [&_>_*]:min-w-0 text-sm leading-snug">
        {message.content}
      </span>
    </div>
  );
};

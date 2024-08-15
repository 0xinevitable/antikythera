import { Children } from 'react';
import Markdown from 'react-markdown';

import { Colors } from '@/constants/colors';
import { cn } from '@/utils/cn';

import { BasicMessageProps } from '../types';

export const AssistantMessageItem: React.FC<BasicMessageProps> = ({
  message,
}) => {
  return (
    <div className="flex flex-col bg-zinc-800 text-white w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tl-none">
      <div className="grid-col-1 grid gap-2.5 [&_>_*]:min-w-0 text-sm leading-snug">
        <Markdown
          components={{
            ol: ({ className, ...props }) => (
              <ol
                className={cn('mt-1 list-decimal space-y-2 pl-8', className)}
                {...props}
              />
            ),
            ul: ({ className, ...props }) => (
              <ul
                className={cn('mt-1 list-disc space-y-2 pl-8', className)}
                {...props}
              />
            ),
            li: ({ className, ...props }) => (
              <li
                className={cn('whitespace-normal break-words', className)}
                {...props}
              />
            ),
            code: (props) => <CustomCode {...props} />,
            img: (props) => <CustomImg {...props} />,
          }}
        >
          {message.content}
        </Markdown>
      </div>
    </div>
  );
};

const CustomCode: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
}) => {
  const content = Children.toArray(children).join('');

  // Match Aptos addresses or ㅊ patterns
  // Allows hex addresses of 1 to 64 characters (e.g., 0x1, 0x1::module::type, or full 64-char addresses)
  const addressMatch = content.match(/^(0x[a-fA-F0-9]{1,64})(?:::.*)?$/);

  console.log({ content, addressMatch });

  if (addressMatch) {
    // const address = addressMatch[1];
    // const shortenedContent = content.replace(address, shortenAddress(address));

    return (
      <a
        // href={`https://explorer.aptoslabs.com/account/${address}?network=mainnet`}
        href={`https://tracemove.io/search/${content}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium hover:underline"
        style={{ color: Colors.AptosNeon }}
      >
        {children}
      </a>
    );
  }

  return <code>{children}</code>;
};

const CustomImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  className,
  ...props
}) => {
  const isCoinLogo = src?.includes('aptos-coin-list');
  return (
    <img
      className={cn(isCoinLogo && 'w-full max-w-[32px]', className)}
      src={src}
      {...props}
    />
  );
};
import { Children } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ className, ...props }) => (
              <pre className="border-zinc-600 overflow-x-scroll whitespace-nowrap rounded border-[0.5px] shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                <table
                  className={cn(
                    'bg-zinc-900/50 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888]',
                    className,
                  )}
                  {...props}
                />
              </pre>
            ),
            thead: ({ className, ...props }) => (
              <thead
                className={cn(
                  'bg-zinc-900 border-b-zinc-600 border-b-[0.5px] text-left',
                  className,
                )}
                {...props}
              />
            ),
            th: ({ className, ...props }) => (
              <th
                className={cn(
                  'border-zinc-500 text-zinc-000 font-400 px-2 [&:not(:first-child)]:border-l-[0.5px]',
                  className,
                )}
                {...props}
              />
            ),
            td: ({ className, ...props }) => (
              <td
                className={cn(
                  'border-zinc-500 border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]',
                  className,
                )}
                {...props}
              />
            ),
            //  font-400 px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Name</th><th class="text-text-000 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] font-400 px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Category</th><th class="text-text-000 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] font-400 px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">TVL (Aptos)</th><th class="text-text-000 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] font-400 px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">URL</th></tr></thead><tbody><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Aries Markets</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Lending</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$217,916,002.53</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://ariesmarkets.xyz">ariesmarkets.xyz</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Amnis Finance</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Liquid Staking</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$187,196,431.48</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://amnis.finance">amnis.finance</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">PancakeSwap AMM</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Dexes</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$25,271,891.53</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://pancakeswap.finance">pancakeswap.finance</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Ondo Finance</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">RWA</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$15,572,408.52</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://ondo.finance">ondo.finance</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">TruStake</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Liquid Staking</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$81,189,859.04</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://app.trufin.io/vaults/trustake">app.trufin.io/vaults/trustake</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Thala LSD</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Liquid Staking</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$74,648,376.28</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://app.thala.fi/lsd">app.thala.fi/lsd</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Cellana Finance</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Dexes</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$64,255,962.59</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://cellana.finance">cellana.finance</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Thala CDP</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">CDP</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$58,221,091.44</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://www.thala.fi/">thala.fi</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">ThalaSwap</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Dexes</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$54,513,895.71</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://www.thala.fi/">thala.fi</a></td></tr><tr class="[tbody>&amp;]:odd:bg-bg-500/10"><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Meso Finance</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">Lending</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]">$46,754,022.54</td><td class="border-t-border-100 [&amp;:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&amp;:not(:first-child)]:border-l-[0.5px]"><a href="https://app.meso.finance/dashboard">app.meso.finance/dashboard</a></td></tr></tbody></table>
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
            a: ({ className, ...props }) => (
              <a
                className={cn('font-medium hover:underline', className)}
                style={{ color: Colors.AptosNeon }}
                target="_blank"
                {...props}
              />
            ),
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
  const isCoinLogo =
    src?.includes('aptos-coin-list') || src?.includes('llama.fi');
  return (
    <img
      className={cn(isCoinLogo && 'w-full max-w-[32px]', className)}
      src={src}
      {...props}
    />
  );
};

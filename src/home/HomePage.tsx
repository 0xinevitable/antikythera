import {
  APTOS_COIN,
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

import { WalletSelector } from '@/components/WalletSelector';
import { Brands } from '@/constants/brands';
import { Colors } from '@/constants/colors';
import { cn } from '@/utils/cn';

import { Block, BlockType, ParameterType } from './Block';
import { CoinSearchList } from './CoinSearchList';
import { Header } from './components/Header';
import { fetchStreamingResponse } from './stream';
import { Message } from './types';

const Coins = {
  APT: {
    name: 'APT',
    symbol: 'APT',
    decimals: 8,
    type: APTOS_COIN,
  },
};

type Address = `0x${string}`;

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const defaultAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(
    '0x8770b1199261ee6ba4ce12cb11cf3dcf3b9fbf0a9bf9062ae00242fb9d686e3a',
  ),
});

const executeTx = async (
  signer: Account,
  transaction: AnyRawTransaction,
  update: (params: Record<string, ParameterType>) => void,
) => {
  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: signer,
    transaction,
  });
  console.log({ pendingTxn });

  update({
    transaction: {
      type: 'hash',
      value: pendingTxn.hash,
    },
    status: { type: 'string', value: 'Pending' },
  });

  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  console.log(response);

  update({
    status: {
      type: 'string',
      value: response.success ? 'Success' : 'Failed',
    },
    gas: {
      type: 'coin',
      coin: Coins.APT,
      value: BigInt(response.gas_used) * BigInt(pendingTxn.gas_unit_price),
    },
    gasUnitPrice: {
      type: 'coin',
      coin: Coins.APT,
      value: BigInt(pendingTxn.gas_unit_price),
    },
    block: {
      type: 'string',
      value: 'Loading...',
    },
  });

  const blockInfo = await aptos.getBlockByVersion({
    ledgerVersion: Number(response.version),
  });
  console.log(blockInfo);

  update({
    block: {
      type: 'block',
      value: blockInfo.block_height,
    },
  });
};

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const CustomCode: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
}) => {
  const content = React.Children.toArray(children).join('');

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

const HomePage = () => {
  const { account, connected, wallet, changeNetwork } = useWallet();

  const [text, setText] = useState<string>('');

  const [accounts, setAccounts] = useState<Record<Address, Account>>({
    [defaultAccount.accountAddress.toString()]: defaultAccount,
  });

  const [input, setInput] = useState<string>(
    'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) return;
      setInput('');

      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, newMessage]);

      abortControllerRef.current = new AbortController();

      try {
        await fetchStreamingResponse(
          [...messages, newMessage],
          setMessages,
          abortControllerRef.current.signal,
          account?.address || '0x0',
        );
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: 'An error occurred while processing your request.',
          },
        ]);
      } finally {
        setIsLoading(false);
        setInput('');
        abortControllerRef.current = null;
      }
    },
    [input, messages, isLoading, account?.address],
  );

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const bottomBarRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (!containerRef.current) {
        return;
      }
      window.scrollTo({
        top: containerRef.current.offsetHeight || 0,
        behavior: 'smooth',
      });
    });
  }, [messages]);

  return (
    <Container>
      <Header />
      <WalletSelector />
      {messages.length > 0 && (
        <BlockList ref={containerRef}>
          {messages.map((message, index) => {
            if (message.role === 'user') {
              return (
                <div
                  key={index}
                  className="ml-auto flex flex-col bg-[#55FFD9] text-black w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tr-none"
                >
                  <div className="grid-col-1 grid gap-2.5 [&_>_*]:min-w-0 text-sm leading-snug">
                    {message.content}
                  </div>
                </div>
              );
            }
            if (message.role === 'assistant') {
              return (
                <div
                  key={index}
                  className="flex flex-col bg-zinc-800 text-white w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tl-none"
                >
                  <div className="grid-col-1 grid gap-2.5 [&_>_*]:min-w-0 text-sm leading-snug">
                    <Markdown
                      components={{
                        ol: ({ className, ...props }) => (
                          <ol
                            className={cn(
                              'mt-1 list-decimal space-y-2 pl-8',
                              className,
                            )}
                            {...props}
                          />
                        ),
                        ul: ({ className, ...props }) => (
                          <ul
                            className={cn(
                              'mt-1 list-disc space-y-2 pl-8',
                              className,
                            )}
                            {...props}
                          />
                        ),
                        li: ({ className, ...props }) => (
                          <li
                            className={cn(
                              'whitespace-normal break-words',
                              className,
                            )}
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
            }
            if (message.role === 'tool') {
              const brand =
                message.kwargs.name === 'findSwapRoute'
                  ? Brands.ThalaSwap
                  : message.kwargs.name === 'searchCoin'
                    ? Brands.Nodit
                    : Brands.Aptos;

              const title = capitalizeFirstLetter(message.kwargs.name);

              return (
                <Block
                  id={index.toString()}
                  title={title}
                  brand={brand}
                  params={(() => {
                    if (message.kwargs.name === 'searchCoin') {
                      return (
                        <>
                          <span className="text-sm text-white">
                            {JSON.stringify(
                              message.kwargs.additional_kwargs.tool_call
                                .function.arguments,
                            )}
                          </span>
                          <CoinSearchList coins={message.kwargs.content} />
                        </>
                      );
                    }
                    if (message.kwargs.name === 'findSwapRoute') {
                      return (
                        <span className="text-sm text-white">
                          {JSON.stringify(message.kwargs.content)}
                        </span>
                      );
                    }
                    return null;
                  })()}
                />
              );
            }
            return (
              <div
                key={index}
                // TODO: Error
                className="p-2 mb-4 bg-red-100 rounded"
              >
                <strong>{message.role}</strong>
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  {message.content}
                </pre>
              </div>
            );
          })}
        </BlockList>
      )}
      <form
        // ref={bottomBarRef}
        onSubmit={handleSubmit}
        className="w-full mb-4"
      >
        <Textarea
          // type="text"
          // TODO: auto-grow height of textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
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
            onClick={handleStop}
            className="p-2 mt-2 text-white bg-red-500 rounded"
          >
            Stop
          </button>
        )}
      </form>
      {messages.length === 0 && (
        <div className="flex gap-4">
          <SuggestionCard
            onClick={() => {
              setInput('List all the bridged versions of USDC Coin.');

              // TODO: inputRef -> focus
              textareaRef.current?.focus();
            }}
          >
            <h3>List all the bridged versions of USDC.</h3>
          </SuggestionCard>
          <SuggestionCard
            onClick={() => {
              setInput(
                'Estimate the swap for exchanging 100 APT into Wormhole USDC. Display the state of each pool in the route.',
              );

              textareaRef.current?.focus();
            }}
          >
            <h3>
              Estimate the swap for exchanging 100 APT into Wormhole USDC.
              Display the state of each pool in the route.
            </h3>
          </SuggestionCard>
        </div>
      )}
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 32px;
`;
const BlockList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Textarea = styled.textarea`
  padding: 16px;

  border-radius: 8px 8px 0px 0px;
  border: 0;
  border-bottom: 1px solid #50e3c2;
  background: linear-gradient(180deg, #282c2c 0%, #203530 100%);

  color: #50e3c2;
`;

const SuggestionCard = styled.div`
  padding: 12px;
  gap: 8px 4px;

  display: flex;
  flex: 1 0 0;
  flex-wrap: wrap;

  /* TODO: Remove this to children styles */
  color: white;

  border: 1px solid #5c5c5c;
  background: linear-gradient(180deg, #222 0%, #151c1a 100%);
  box-shadow: 0px 4px 12px 0px rgba(202, 255, 243, 0.12);
`;

import {
  APTOS_COIN,
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  InputGenerateTransactionPayloadData,
  Network,
} from '@aptos-labs/ts-sdk';
import styled from '@emotion/styled';
import React, { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Brands } from '@/constants/brands';

import { Block, BlockType, ParameterType } from './Block';
import { CoinSearchList } from './CoinSearchList';
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

type FeedItem =
  | (BlockType & { type: 'block' })
  | { id: string; type: 'message'; value: string };

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const HomePage = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, newMessage]);

      abortControllerRef.current = new AbortController();

      try {
        await fetchStreamingResponse(
          [...messages, newMessage],
          setMessages,
          abortControllerRef.current.signal,
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
    [input, messages, isLoading],
  );

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BlockList>
        {messages.map((message, index) => {
          if (message.role === 'assistant') {
            return (
              <div
                key={index}
                className="flex flex-col bg-zinc-700 text-white w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tl-none"
              >
                <p className="text-sm leading-snug">{message.content}</p>
              </div>
            );
          }
          if (message.role === 'tool') {
            const brand =
              message.kwargs.name === 'findSwapRoute'
                ? Brands.ThalaSwap
                : Brands.Aptos;

            const title = capitalizeFirstLetter(message.kwargs.name);

            return (
              <Block
                id={index.toString()}
                title={title}
                brand={brand}
                params={(() => {
                  if (message.kwargs.name === 'searchCoin') {
                    return <CoinSearchList coins={message.kwargs.content} />;
                  }
                  if (message.kwargs.name === 'findSwapRoute') {
                    return <>{JSON.stringify(message.kwargs.content)}</>;
                  }
                  return null;
                })()}
              />
            );
          }
          return (
            <div
              key={index}
              className={`mb-4 p-2 rounded ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-red-100'
              }`}
            >
              <strong>
                {message.role}:{' '}
                {/* {message.role === 'tool' ? message.kwargs.name : null} */}
              </strong>
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {message.content}
                {/* {message.role === 'tool' &&
                  (() => {
                    if (message.kwargs.name === 'searchCoin') {
                      return <CoinSearchList coins={message.kwargs.content} />;
                    }
                    if (message.kwargs.name === 'findSwapRoute') {
                      return JSON.stringify(message.kwargs.content);
                    }
                    return null;
                  })()} */}
              </pre>
            </div>
          );
        })}

        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
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
      </BlockList>
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;
const BlockList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

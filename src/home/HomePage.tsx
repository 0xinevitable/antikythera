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
import { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { WalletSelector } from '@/components/WalletSelector';

import { AssistantMessageItem } from './components/AssistantMessageItem';
import { ParameterType } from './components/Block';
import { ErrorMessageItem } from './components/ErrorMessageItem';
import { ToolMessageItem } from './components/ToolMessageItem';
import { UserMessageItem } from './components/UserMessageItem';
import { FeaturedSection } from './sections/FeaturedSection';
import { InputSection } from './sections/InputSection';
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

const HomePage: NextPage = () => {
  const { account, connected, wallet, changeNetwork } = useWallet();

  const [accounts, setAccounts] = useState<Record<Address, Account>>({
    [defaultAccount.accountAddress.toString()]: defaultAccount,
  });

  const [draft, setDraft] = useState<string>(
    'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) return;
      setDraft('');

      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: draft };
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
        setDraft('');
        abortControllerRef.current = null;
      }
    },
    [draft, messages, isLoading, account?.address],
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
    <Wrapper>
      <Sidebar />
      <Container>
        {/* Header */}
        <Image
          className="w-[100px] h-[100px]"
          src="/assets/3d-aptos-compact.png"
          alt=""
          width={512}
          height={512}
        />

        {/* <WalletSelector /> */}

        <Main>
          {messages.length > 0 && (
            <MessageList ref={containerRef}>
              {messages.map((message, index) => {
                if (message.role === 'user') {
                  return <UserMessageItem key={index} message={message} />;
                }
                if (message.role === 'assistant') {
                  return <AssistantMessageItem key={index} message={message} />;
                }
                if (message.role === 'tool') {
                  return (
                    <ToolMessageItem
                      key={index}
                      id={index.toString()}
                      message={message}
                    />
                  );
                }
                return <ErrorMessageItem key={index} message={message} />;
              })}
            </MessageList>
          )}

          {messages.length === 0 && (
            <FeaturedSection
              onSelect={(text) => {
                setDraft(text);
                textareaRef.current?.focus();
              }}
            />
          )}

          <InputSection
            isLoading={isLoading}
            onClickSubmit={handleSubmit}
            onStop={handleStop}
            value={draft}
            onChangeValue={handleInputChange}
          />
        </Main>
      </Container>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.div`
  display: flex;
`;
const Sidebar = styled.nav`
  width: 280px;
  background-color: black;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 12px 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 48px;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MessageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

import {
  APTOS_COIN,
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  InputGenerateTransactionPayloadData,
  Network,
} from '@aptos-labs/ts-sdk';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Brands } from '@/constants/brands';

import { Block, BlockType, ParameterType } from './Block';

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
  data: InputGenerateTransactionPayloadData,
  update: (params: Record<string, ParameterType>) => void,
) => {
  const transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data,
  });
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
    ...Object.entries(data).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          type: 'string',
          value: JSON.stringify(value),
        },
      }),
      {},
    ),
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

const HomePage = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [text, setText] = useState<string>('');

  const [accounts, setAccounts] = useState<Record<Address, Account>>({
    [defaultAccount.accountAddress.toString()]: defaultAccount,
  });

  return (
    <Container>
      <BlockList>
        {feedItems.map((item) => {
          if (item.type === 'block') {
            return (
              <Block
                key={item.id}
                id={item.id}
                title={item.title}
                brand={item.brand}
                params={item.params}
              />
            );
          } else if (item.type === 'message') {
            return (
              <div
                key={item.id}
                className="flex flex-col bg-zinc-700 text-white w-fit max-w-[80%] py-3 px-4 rounded-xl rounded-tl-none"
              >
                <p className="text-sm leading-snug">{item.value}</p>
              </div>
            );
          }
        })}

        <input
          className="bg-white"
          placeholder="Text"
          value={text}
          onKeyDown={async (e) => {
            if (e.key === 'a') {
              setFeedItems((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  type: 'message',
                  value: 'I should create a new account to receive APT.',
                },
              ]);
              const account = Account.generate();
              console.log(account);
              setAccounts((prev) => ({
                ...prev,
                [account.accountAddress.toString()]: account,
              }));
              setFeedItems((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  type: 'block',
                  title: 'Create Account',
                  brand: Brands.Aptos,
                  params: {
                    address: {
                      type: 'string',
                      value: account.accountAddress.toString(),
                    },
                  },
                },
              ]);
            } /* else if (e.key === 'r') {
              setBlocks((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  title: 'Fund Account',
                  brand: Brands.Aptos,
                },
              ]);
              const firstAccount = Object.values(accounts)[0];
              if (!firstAccount) {
                return;
              }
              aptos
                .fundAccount({
                  accountAddress: firstAccount.accountAddress,
                  amount: 100_000_000,
                })
                .then((res) => {
                  console.log(res);

                  // TODO: Update block
                })
                .catch(console.error);
            } */ else if (e.key === 'b') {
              const blockId = uuidv4();
              setFeedItems((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  type: 'message',
                  value: 'I should query the APT balance of my first account.',
                },
              ]);
              setFeedItems((prev) => [
                ...prev,
                {
                  id: blockId,
                  type: 'block',
                  title: 'Query Account Balance',
                  brand: Brands.Aptos,
                },
              ]);
              const firstAccount = Object.values(accounts)[0];
              if (!firstAccount) {
                return;
              }
              try {
                const res = await aptos.getAccountAPTAmount({
                  accountAddress: firstAccount.accountAddress,
                });
                console.log(res);

                setFeedItems((prev) =>
                  prev.map((item) =>
                    item.id === blockId && item.type === 'block'
                      ? {
                          ...item,
                          params: {
                            ...item.params,
                            balance: {
                              type: 'coin',
                              coin: Coins.APT,
                              value: BigInt(res.toString()),
                            },
                          },
                        }
                      : item,
                  ),
                );
              } catch (e) {
                console.error(e);
              }
            } else if (e.key === 's') {
              const blockId = uuidv4();
              setFeedItems((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  type: 'message',
                  value:
                    'I should transfer 0.00000001 APT to my second account.',
                },
              ]);
              setFeedItems((prev) => [
                ...prev,
                {
                  id: blockId,
                  type: 'block',
                  title: 'Transfer APT',
                  brand: Brands.Aptos,
                },
              ]);
              const firstAccount = Object.values(accounts)[0];
              const secondAccount = Object.values(accounts)[1];
              if (!firstAccount || !secondAccount) {
                return;
              }
              const data: InputGenerateTransactionPayloadData = {
                function: '0x1::aptos_account::transfer',
                functionArguments: [secondAccount.accountAddress.toString(), 1],
              };
              await executeTx(firstAccount, data, (params) => {
                setFeedItems((prev) =>
                  prev.map((item) =>
                    item.id === blockId && item.type === 'block'
                      ? { ...item, params }
                      : item,
                  ),
                );
              });
            }
            setText('');
          }}
        />
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

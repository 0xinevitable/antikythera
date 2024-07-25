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

import { Block, BlockType } from './Block';

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

const HomePage = () => {
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [text, setText] = useState<string>('');

  const [accounts, setAccounts] = useState<Record<Address, Account>>({
    [defaultAccount.accountAddress.toString()]: defaultAccount,
  });

  return (
    <Container>
      <BlockList>
        {blocks.map((block) => (
          <Block
            key={block.id}
            id={block.id}
            title={block.title}
            brand={block.brand}
            params={block.params}
          />
        ))}

        <input
          className="bg-white"
          placeholder="Text"
          value={text}
          onKeyDown={async (e) => {
            if (e.key === 'a') {
              const account = Account.generate();
              console.log(account);
              setAccounts((prev) => ({
                ...prev,
                [account.accountAddress.toString()]: account,
              }));
              setBlocks((prev) => [
                ...prev,
                {
                  id: uuidv4(),
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
              setBlocks((prev) => [
                ...prev,
                {
                  id: blockId,
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

                setBlocks((prev) =>
                  prev.map((block) =>
                    block.id === blockId
                      ? {
                          ...block,
                          params: {
                            ...block.params,
                            balance: {
                              type: 'coin',
                              coin: Coins.APT,
                              value: BigInt(res.toString()),
                            },
                          },
                        }
                      : block,
                  ),
                );
              } catch (e) {
                console.error(e);
              }
            } else if (e.key === 's') {
              const blockId = uuidv4();
              setBlocks((prev) => [
                ...prev,
                {
                  id: blockId,
                  title: 'Transfer APT',
                  brand: Brands.Aptos,
                },
              ]);
              const firstAccount = Object.values(accounts)[0];
              if (!firstAccount) {
                return;
              }
              const secondAccount = Object.values(accounts)[1];
              if (!secondAccount) {
                return;
              }
              const data: InputGenerateTransactionPayloadData = {
                function: '0x1::aptos_account::transfer',
                functionArguments: [secondAccount.accountAddress.toString(), 1],
              };
              const transaction = await aptos.transaction.build.simple({
                sender: firstAccount.accountAddress,
                data,
              });
              const pendingTxn = await aptos.signAndSubmitTransaction({
                signer: firstAccount,
                transaction,
              });
              console.log({ pendingTxn });

              setBlocks((prev) =>
                prev.map((block) =>
                  block.id === blockId
                    ? {
                        ...block,
                        params: {
                          ...block.params,
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
                        },
                      }
                    : block,
                ),
              );

              const response = await aptos.waitForTransaction({
                transactionHash: pendingTxn.hash,
              });
              console.log(response);

              setBlocks((prev) =>
                prev.map((block) =>
                  block.id === blockId
                    ? {
                        ...block,
                        params: {
                          ...block.params,
                          status: {
                            type: 'string',
                            value: response.success ? 'Success' : 'Failed',
                          },
                          gas: {
                            type: 'coin',
                            coin: Coins.APT,
                            value:
                              BigInt(response.gas_used) *
                              BigInt(pendingTxn.gas_unit_price),
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
                        },
                      }
                    : block,
                ),
              );

              const blockInfo = await aptos.getBlockByVersion({
                ledgerVersion: Number(response.version),
              });
              console.log(blockInfo);

              setBlocks((prev) =>
                prev.map((block) =>
                  block.id === blockId
                    ? {
                        ...block,
                        params: {
                          ...block.params,
                          block: {
                            type: 'block',
                            value: blockInfo.block_height,
                          },
                        },
                      }
                    : block,
                ),
              );
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

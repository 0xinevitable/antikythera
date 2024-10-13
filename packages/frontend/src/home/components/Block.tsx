import styled from '@emotion/styled';
import { CheckCheck, FunctionSquareIcon, LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import { isValidElement as isValidReactElement } from 'react';

import { Colors } from '@/constants/colors';
import { shortenAddress } from '@/utils/format';
import { formatUnits } from '@/utils/units';

export type Coin = {
  symbol: string;
  name: string;
  decimals: number;
};

export type ParameterType =
  | { type: 'block'; value: string }
  | { type: 'hash'; value: string }
  | { type: 'string'; value: string }
  | { type: 'coin'; coin: Coin; value: bigint };

export type BlockType = {
  id: string;
  title: string;
  brand: {
    name: string;
    src: string;
    color: string;
  };
  params?: Record<string, ParameterType> | React.ReactNode;
};

export type BlockProps = BlockType & {
  className?: string;
  status?: 'pending' | 'resolved';
  children?: React.ReactNode;
};

export const Block: React.FC<BlockProps> = ({
  className,
  title,
  brand,
  params,
  status,
  children,
}) => {
  return (
    <Container className={className}>
      {/* <NetworkContainer>
        <NetworkCircle />
        <NetworkName>Testnet</NetworkName>
      </NetworkContainer> */}

      <div className="flex items-center gap-2 pr-[32px]">
        <BrandContainer
          style={{ boxShadow: `0px 12px 32px 0px ${brand.color}20` }}
        >
          <BrandLogo
            width={256}
            height={256}
            alt={brand.name}
            src={brand.src}
          />
          <BrandName style={{ color: brand.color }}>{brand.name}</BrandName>
        </BrandContainer>
        <Title>{title}</Title>
      </div>

      {status === 'resolved' && (
        <span className="w-fit flex items-center justify-center gap-2 pl-1.5 pr-2 text-white rounded-lg bg-zinc-700">
          <CheckCheck size={14} />
          <span className="font-medium text-[14px]">Resolved</span>
        </span>
      )}
      {status === 'pending' && (
        <span className="w-fit flex items-center justify-center gap-2 pl-1.5 pr-2 text-white rounded-lg bg-zinc-700">
          <LoaderIcon size={14} className="animate-spin" />
          <span className="font-medium text-[14px]">Pending</span>
        </span>
      )}

      {/* render simple table with tailwind */}
      {!params || Object.values(params).every((v) => !v)
        ? null
        : isValidReactElement(params)
          ? params
          : typeof params === 'object' && (
              <table className="w-full text-white rounded-sm">
                <tbody>
                  {Object.entries(params).map(([key, param]) => {
                    const addressMatch =
                      typeof param === 'string' &&
                      param.match(/^(0x[a-fA-F0-9]{1,64})(?:::.*)?$/);
                    const address = !!addressMatch && addressMatch[1];
                    const shortenedContent =
                      !!address &&
                      param.replace(address, shortenAddress(address));

                    return (
                      <tr key={key}>
                        <td className="px-1.5 py-1 text-xs border border-white/30">
                          {key}
                        </td>
                        {typeof param === 'object' ? (
                          <td className="px-1.5 py-1 text-xs border border-white/30">
                            {param.type === 'block' && (
                              <a
                                style={{ color: Colors.AptosNeon }}
                                target="_blank"
                                href={`https://explorer.aptoslabs.com/block/${param.value}?network=testnet`}
                              >
                                {param.value}
                              </a>
                            )}
                            {param.type === 'hash' && (
                              <a
                                style={{ color: Colors.AptosNeon }}
                                target="_blank"
                                href={`https://explorer.aptoslabs.com/txn/${param.value}?network=testnet`}
                              >
                                {param.value}
                              </a>
                            )}
                            {param.type === 'string' && param.value}
                            {param.type === 'coin' && (
                              <span>
                                {formatUnits(param.value, param.coin.decimals)}{' '}
                                {param.coin.symbol}
                              </span>
                            )}
                          </td>
                        ) : (
                          <td className="px-1.5 py-1 text-xs border border-white/30">
                            {addressMatch ? (
                              <a
                                // href={`https://explorer.aptoslabs.com/account/${address}?network=mainnet`}
                                href={`https://tracemove.io/search/${param}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                                style={{ color: Colors.AptosNeon }}
                              >
                                {shortenedContent}
                              </a>
                            ) : (
                              param
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

      {children}
    </Container>
  );
};

const Container = styled.li`
  padding: 12px;
  width: fit-content;
  overflow: hidden;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  background: linear-gradient(180deg, #222222 0%, #1e1e1e 100%);
  border: 1px solid #5c5c5c;
  box-shadow: 0px 4px 12px 0px rgba(202, 255, 243, 0.12);
`;

const NetworkContainer = styled.div`
  border: 1px solid #50e3c2;
  width: fit-content;
  padding: 2px 4px 2px 6px;
  display: flex;
  align-items: center;
  gap: 7px;
`;
const NetworkCircle = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid #50e3c2;
  box-shadow: 0px 1px 5px 1px rgba(80, 227, 194, 0.66);
`;
const NetworkName = styled.span`
  color: #50e3c2;
  font-family: 'ProFontForPowerline-Regular', sans-serif;
  font-size: 12px;
  line-height: 1;
  font-weight: 400;
`;

const Title = styled.div`
  color: #ffffff;
  text-align: left;
  font-size: 20px;
  letter-spacing: -0.015em;
  font-weight: 400;
  position: relative;
  align-self: stretch;
`;

const BrandContainer = styled.div`
  padding: 4px 6px;
  padding-right: 8px;
  width: fit-content;
  border-radius: 32px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  border: 0.5px solid black;
  background: linear-gradient(to bottom, #222222 0%, #151c1a 100%);
`;
const BrandLogo = styled(Image)`
  border-radius: 50%;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  object-fit: cover;
`;
const BrandName = styled.span`
  text-align: left;
  font-size: 14px;
  line-height: 100%;
  font-weight: 400;
  position: relative;
`;

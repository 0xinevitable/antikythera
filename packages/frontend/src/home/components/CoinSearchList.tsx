import { useState } from 'react';

import { CoinData } from '@/constants/aptos-coins';
import { Colors } from '@/constants/colors';
import { cn } from '@/utils/cn';

export const CoinSearchList: React.FC<{ coins: CoinData[] }> = ({ coins }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  if (coins.length === 0) {
    return <p>No results found.</p>;
  }

  const renderedCoins = collapsed ? coins.slice(0, 5) : coins;

  return (
    <div className="w-full">
      <span className="text-sm font-medium text-zinc-400">
        <span style={{ color: Colors.Nodit }}>{coins.length}</span> Results
      </span>

      <ul
        className="mt-1 w-full overflow-hidden rounded-lg bg-[#282C2C] border border-[#374141]"
        style={{
          boxShadow: `0px 4px 8px 0px rgba(0, 0, 0, 0.14)`,
        }}
      >
        {renderedCoins.map((coin, index) => (
          <li key={coin.token_type.type} className="flex w-full">
            <a
              target="_blank"
              href={`https://tracemove.io/coin/${coin.token_type.type}`}
              className={cn(
                'w-full flex items-center gap-2 px-[8px] py-[8px] hover:bg-[#1D2222] cursor-pointer',
                index === 0 && 'pt-[10px]',
                index === renderedCoins.length - 1 && 'pb-[10px]',
              )}
            >
              <img
                src={coin.logo_url}
                alt={coin.name}
                className="w-[30px] h-[30px] bg-white rounded-full"
              />

              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-medium text-white leading-none">
                  {coin.symbol}
                </p>
                <h3 className="text-[12px] text-zinc-400 leading-none">
                  {coin.name}
                </h3>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {coins.length > 5 && (
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="mt-1 text-sm text-blue-500"
          style={{ color: Colors.Nodit }}
        >
          {collapsed ? 'Show more' : 'Show less'}
        </button>
      )}
    </div>
  );
};

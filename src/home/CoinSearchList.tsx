import { useState } from 'react';

import { CoinData } from '@/constants/aptos-coins';

export const CoinSearchList: React.FC<{ coins: CoinData[] }> = ({ coins }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  if (coins.length === 0) {
    return <p>No results found.</p>;
  }

  const renderedCoins = collapsed ? coins.slice(0, 5) : coins;

  return (
    <ul>
      <span>{`${coins.length} Results`}</span>
      {renderedCoins.map((coin) => (
        <div key={coin.token_type.type} className="flex">
          <img
            src={coin.logo_url}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[12px] font-bold">{coin.symbol}</p>
            <h3 className="text-[10px]">{coin.name}</h3>
          </div>
        </div>
      ))}
      {coins.length > 5 && (
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-blue-500"
        >
          {collapsed ? 'Show more' : 'Show less'}
        </button>
      )}
    </ul>
  );
};

import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';
import {
  KanaSwapMarket,
  KanaSwapRoute,
  KanaSwapRouteOption,
} from '@/tools/kanaswap';

const formatAmount = (amount: string, decimals = 6) => {
  return parseFloat((parseFloat(amount) / 10 ** decimals).toFixed(6));
};

const TokenIcon = ({ symbol }: any) => (
  <div className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-gray-200 rounded-full">
    {symbol.slice(0, 2)}
  </div>
);

type RouteStepProps = {
  step: KanaSwapMarket;
  index: number;
  totalSteps: number;
};
export const RouteStep: React.FC<RouteStepProps> = ({
  step,
  index,
  totalSteps,
}) => {
  const coinX = APTOS_MAINNET_COINS.find(
    (v) => v.token_type.type.toLowerCase() === step.coinX.toLowerCase(),
  );
  const coinY = APTOS_MAINNET_COINS.find(
    (v) => v.token_type.type.toLowerCase() === step.coinY.toLowerCase(),
  );

  return (
    <div className="flex items-center">
      <img src={coinX?.logo_url} className="w-6 h-6" />
      <div className="mx-2">
        <div className="text-xs font-medium">
          {formatAmount(step.amountIn, coinX?.decimals)}
        </div>
        <div className="text-xs text-zinc-400">{coinX?.name}</div>
      </div>
      <div className="flex-1">
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="mx-2 text-right">
        <div className="text-xs font-medium">
          {formatAmount(step.amountOut, coinY?.decimals)}
        </div>
        <div className="text-xs text-zinc-400">{coinY?.name}</div>
      </div>
      <img src={coinY?.logo_url} className="w-6 h-6" />
    </div>
  );
};

type KanaSwapRouteItemProps = {
  route: Omit<KanaSwapRouteOption, 'chainId'>;
};
export const KanaSwapRouteItem: React.FC<KanaSwapRouteItemProps> = ({
  route,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const sourceToken = APTOS_MAINNET_COINS.find(
    (v) => v.token_type.type.toLowerCase() === route.sourceToken.toLowerCase(),
  );
  const targetToken = APTOS_MAINNET_COINS.find(
    (v) => v.token_type.type.toLowerCase() === route.targetToken.toLowerCase(),
  );

  return (
    <div className="p-4 mb-4 border rounded-lg bg-zinc-900 border-zinc-700 text-zinc-50 w-[400px]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold">{route.protocols.join(' x ')}</div>
        <div className="text-xs text-zinc-400">Steps: {route.steps}</div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-md">
            <img src={sourceToken?.logo_url} className="w-5 h-5" />
            {formatAmount(route.amountIn, sourceToken?.decimals)}{' '}
            {sourceToken?.symbol}
          </div>
          <div className="text-xs text-zinc-400">${route.sourceTokenInUSD}</div>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400" />
        <div className="text-right">
          <div className="flex items-center gap-1.5 font-bold text-md">
            <img src={targetToken?.logo_url} className="w-5 h-5" />
            {formatAmount(route.amountOut, targetToken?.decimals)}{' '}
            {targetToken?.symbol}
          </div>
          <div className="text-xs text-zinc-400">${route.targetTokenInUSD}</div>
        </div>
      </div>
      <div className="flex justify-between mb-2 text-sm text-zinc-400">
        <div>Price Impact: {route.priceImpact.toLocaleString()}%</div>
        <div>Slippage: {route.slippage / 10000}%</div>
      </div>
      <button
        className="flex items-center justify-center w-full text-blue-500 hover:text-blue-700"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            Hide Details <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            Show Details <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
      {expanded && (
        <div className="mt-4 space-y-2">
          {route.route.markets.map((step, index) => (
            <RouteStep
              key={index}
              step={step}
              index={index}
              totalSteps={route.route.markets.length}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { APTOS_MAINNET_COINS } from '@/constants/aptos-coins';
import { KanaSwapMarket, KanaSwapRouteOption } from '@/tools/kanaswap';

const formatAmount = (amount: string, decimals = 6) => {
  return parseFloat((parseFloat(amount) / 10 ** decimals).toFixed(6));
};

type RouteStepProps = {
  step: KanaSwapMarket;
};
export const RouteStep: React.FC<RouteStepProps> = ({ step }) => {
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

const protocolToLogoURL = (protocol: string) => {
  protocol = protocol.toLowerCase();
  if (protocol.includes('pontem')) {
    return '/assets/logo-pontem.jpg';
  }
  if (protocol.includes('sushi')) {
    return '/assets/logo-sushi.png';
  }
  if (protocol.includes('thala')) {
    return '/assets/logo-thala.png';
  }
  if (protocol.includes('pancake')) {
    return '/assets/logo-pancake.jpg';
  }
  return null;
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
    <div className="p-4 border rounded-lg bg-zinc-900 border-zinc-700 text-zinc-50 w-[400px]">
      {/* Route Info */}
      <div className="flex gap-2 py-1 pl-1 pr-2 mb-2 rounded-lg bg-zinc-800 w-fit">
        <div className="flex items-center">
          {route.protocols.map((v, idx) => {
            const logo = protocolToLogoURL(v);
            if (!logo) {
              return null;
            }
            return (
              <img
                key={v}
                src={logo}
                className="w-6 h-6 -mr-2 border rounded-md last-of-type:mr-0 border-zinc-500"
                style={{ zIndex: route.protocols.length - idx }}
              />
            );
          })}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-300">
            {route.protocols.join(' > ')}
          </span>
          <span className="text-xs text-zinc-400">Steps: {route.steps}</span>
        </div>
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
            <RouteStep key={index} step={step} />
          ))}
        </div>
      )}
    </div>
  );
};

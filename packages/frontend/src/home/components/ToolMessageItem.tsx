import { Brands } from '@/constants/brands';
import { capitalizeFirstLetter } from '@/utils/format';

import { ToolMessage } from '../types';
import { Block } from './Block';
import { CoinSearchList } from './CoinSearchList';
import { KanaSwapRouteItem } from './KanaSwapRouteItem';

type ToolMessageProps = {
  id: string;
  message: ToolMessage;
};

const brandByToolName = (name: string) => {
  switch (name) {
    case 'listEchelonMarkets':
      return Brands.Echelon;
    case 'kanaSwapQuote':
      return Brands.KanaSwap;
    case 'chainTVL':
      return Brands.DefiLlama;
    case 'listChainProtocols':
      return Brands.DefiLlama;
    case 'findSwapRoute':
      return Brands.ThalaSwap;
    case 'searchCoin':
    case 'getCoin':
      return Brands.Nodit;
    default:
      return Brands.Aptos;
  }
};

export const ToolMessageItem: React.FC<ToolMessageProps> = ({
  id,
  message,
}) => {
  const brand = brandByToolName(message.kwargs.name);
  const title = capitalizeFirstLetter(message.kwargs.name);

  return (
    <Block
      id={id}
      title={title}
      brand={brand}
      status={message.status}
      params={message.kwargs.additional_kwargs.tool_call.function.arguments}
    >
      <>
        {message.status === 'resolved' &&
          (() => {
            if (
              message.kwargs.name === 'searchCoin' ||
              message.kwargs.name === 'getCoin'
            ) {
              const coins = Array.isArray(message.kwargs.content)
                ? message.kwargs.content
                : [];
              return <CoinSearchList coins={coins} />;
            }
            if (message.kwargs.name === 'kanaSwapQuote') {
              const routeOptions = message.kwargs.content.foundRoutes;
              return (
                <div className="flex flex-col gap-2 mt-2">
                  {routeOptions.map((route, index) => (
                    <KanaSwapRouteItem key={index} route={route} />
                  ))}
                </div>
              );
            }
            if (
              brand.name === Brands.DefiLlama.name ||
              brand.name === Brands.Echelon.name
            ) {
              return null;
            }
            return (
              <span className="text-sm text-white">
                {JSON.stringify(message.kwargs.content)}
              </span>
            );
          })()}
      </>
    </Block>
  );
};

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
    case 'kanaSwapQuote':
      return Brands.KanaSwap;
    case 'chainTVL':
      return Brands.DefiLlama;
    case 'listChainProtocols':
      return Brands.DefiLlama;
    case 'findSwapRoute':
      return Brands.ThalaSwap;
    case 'searchCoin':
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
            if (message.kwargs.name === 'searchCoin') {
              return <CoinSearchList coins={message.kwargs.content} />;
            }
            if (message.kwargs.name === 'kanaSwapQuote') {
              const routeOptions = message.kwargs.content.foundRoutes;
              console.log(routeOptions);
              return (
                <div className="flex flex-col gap-2 mt-2">
                  {routeOptions.map((route, index) => (
                    <KanaSwapRouteItem key={index} route={route} />
                  ))}
                </div>
              );
            }
            if (brand.name === Brands.DefiLlama.name) {
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

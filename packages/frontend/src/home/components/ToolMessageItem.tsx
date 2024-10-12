import { Brands } from '@/constants/brands';
import { capitalizeFirstLetter } from '@/utils/format';

import { AntiKytheraToolMessage } from '../types';
import { Block } from './Block';
import { CoinSearchList } from './CoinSearchList';

type ToolMessageProps = {
  id: string;
  message: AntiKytheraToolMessage;
};

const brandByToolName = (name: string) => {
  switch (name) {
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
      params={(() => {
        if (message.kwargs.name === 'searchCoin') {
          return (
            <>
              <span className="text-sm text-white">
                {JSON.stringify(
                  message.kwargs.additional_kwargs.tool_call.function.arguments,
                )}
              </span>
              <CoinSearchList coins={message.kwargs.content} />
            </>
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
    />
  );
};

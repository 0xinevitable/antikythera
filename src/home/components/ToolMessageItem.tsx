import { Brands } from '@/constants/brands';

import { AntiKytheraToolMessage } from '../types';
import { Block } from './Block';
import { CoinSearchList } from './CoinSearchList';

const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

type ToolMessageProps = {
  id: string;
  message: AntiKytheraToolMessage;
};

export const ToolMessageItem: React.FC<ToolMessageProps> = ({
  id,
  message,
}) => {
  const brand =
    message.kwargs.name === 'findSwapRoute'
      ? Brands.ThalaSwap
      : message.kwargs.name === 'searchCoin'
        ? Brands.Nodit
        : Brands.Aptos;

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
        if (message.kwargs.name === 'findSwapRoute') {
          return (
            <span className="text-sm text-white">
              {JSON.stringify(message.kwargs.content)}
            </span>
          );
        }
        return null;
      })()}
    />
  );
};

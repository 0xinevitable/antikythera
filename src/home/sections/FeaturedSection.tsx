import styled from '@emotion/styled';

type FeaturedSectionProps = {
  onSelect: (selectedPrompt: string) => void;
};

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onSelect,
}) => {
  return (
    <div className="flex gap-4">
      <SuggestionCard
        onClick={() => {
          onSelect('List all the bridged versions of USDC Coin.');
        }}
      >
        <h3>List all the bridged versions of USDC.</h3>
      </SuggestionCard>
      <SuggestionCard
        onClick={() => {
          onSelect(
            'Estimate the swap for exchanging 100 APT into Wormhole USDC. Display the state of each pool in the route.',
          );
        }}
      >
        <h3>
          Estimate the swap for exchanging 100 APT into Wormhole USDC. Display
          the state of each pool in the route.
        </h3>
      </SuggestionCard>
    </div>
  );
};

const SuggestionCard = styled.div`
  padding: 12px;
  gap: 8px 4px;

  display: flex;
  flex: 1 0 0;
  flex-wrap: wrap;

  /* TODO: Remove this to children styles */
  color: white;

  border: 1px solid #5c5c5c;
  background: linear-gradient(180deg, #222 0%, #151c1a 100%);
  box-shadow: 0px 4px 12px 0px rgba(202, 255, 243, 0.12);
`;

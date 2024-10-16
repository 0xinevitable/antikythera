# Antikythera

## TL;DR

![Cover 1](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/cover-1.png)

- Antikythera is a AI Agent which integrates accurate, real-time onchain data from various protocols and applications on the Aptos Blockchain.

![Cover 2](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/cover-2.png)

- Our AI bot will identify the best prices, arbitrage opportunities, yield opportunities, and current swap routes. It can even execute actions on behalf of users.

## On-chain AI Agents

- We're witnessing the emergence of automated AI agents capable of making autonomous decisions. This trend is exemplified by projects like [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT), [AgentGPT](https://github.com/reworkd/AgentGPT), [Claude Engineer](https://github.com/Doriandarko/claude-engineer), .etc. These leverage Large Language Models (LLMs) as their core, but require integration with external data and execution environments to fully realize their potential.

- That's where **Function Calling** comes in, which enables LLMs to reliably use external tools and APIs. This is possible by defining "Tools" as structured interfaces that describe available functions, their parameters, and expected outputs. LLMs can then generate appropriate function calls based on user inputs, allowing seamless integration with external systems. The response from these external tools is then passed back to the LLM, which uses this information to generate a final output.

- Our ultimate goal is to enable LLMs to **establish their own unique identities within the blockchain**, achieving Financial Autonomy as AI agents themselves. (This concept was initially explored in junhoyeo/CryptoGPT, 2023)

- We build those tools as a public good, allowing anyone to create agents on or off our platform. For instance, if a user asks the AI to purchase an Aptos Name of Antikythera's Beta Version (Demo only, since it contains production-not-ready PK signing), the AI reasons what to do and execute transactions one by one — it check the balance, swap to get more APT if needed (to pay for the name), verify the name price, and complete the registry process automatically.

## Querying the blockchain

- Integration with DeFiLlama for chain TVL and protocol/yield oppertunity data on Aptos
- Token information using Hippo Labs & Nodit-corrected data, including bridged tokens and their diversification benefits
- Token portfolio of a address
- ThalaSwap pool information
- EchelonMarkets pool yields
- Kana Labs DEX aggregator integration for optimal pricing and routes

## Future Work

- On-demand Tool addition capabilities
  - In the future, we plan to utilize Move's ability to extract Package ABI through specific RPC methods. This will allow AI to evaluate and utilize new packages on-the-fly by analyzing the Aptos Move Code. We've already implemented this approach with ThalaSwap, inspired by Thala's API SDK.
- We aspire to create a universal client/frontend similar to Instadapp or DeFiLlama by combining AI agents with wallet connections. Our goal is to develop a decentralized frontend aggregator, providing a more user-friendly experience for newcomers to the ecosystem.

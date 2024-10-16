# Antikythera

## TL;DR

![Cover 1](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/cover-1.png)

Antikythera is a AI Agent which integrates accurate, real-time onchain data from various protocols and applications on the Aptos Blockchain.

![Antikythera vs Aptos Assistant](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/vs-aptos-assistant.jpg?v=3)

[Aptos previously released the Aptos Assistant](https://x.com/Aptos/status/1745869626117079340) earlier this year. However, this assistant faced limitations in practical use due to its inability to access real-time on-chain data beyond its pre-trained knowledge. These limitations became apparent even before considering interactions with actual DApps. For instance, the assistant struggled to answer basic informational questions about the ecosystem, such as identifying the protocol with the highest Total Value Locked (TVL) or listing the available applications.

**In contrast, when Antikythera is asked the same question about top ecosystem projects, it provides a detailed markdown table ranking protocols by exact-figured TVL, including categories, logos, and URLs.**

![Cover 2](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/cover-2.png)

Antikythera is capable of handling a wide range of queries and requests related to the Aptos blockchain. It can identify the best prices, arbitrage opportunities, yield opportunities, and current swap routes across various Aptos protocols. It can even execute actions on behalf of users.

## On-chain AI Agents

- We're witnessing the emergence of automated AI agents capable of making autonomous decisions. This trend is exemplified by projects like [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT), [AgentGPT](https://github.com/reworkd/AgentGPT), [Claude Engineer](https://github.com/Doriandarko/claude-engineer), .etc. These leverage Large Language Models (LLMs) as their core, but require integration with external data and execution environments to fully realize their potential.

- That's where **Function Calling** comes in, which enables LLMs to reliably use external tools and APIs. This is possible by defining "Tools" as structured interfaces that describe available functions, their parameters, and expected outputs. LLMs can then generate appropriate function calls based on user inputs, allowing seamless integration with external systems. The response from these external tools is then passed back to the LLM, which uses this information to generate a final output.

- Our ultimate goal is to enable LLMs to **establish their own unique identities within the blockchain**, achieving Financial Autonomy as AI agents themselves. (We initially explored this concept in [junhoyeo/CryptoGPT](https://github.com/junhoyeo/CryptoGPT), 2023)

- We build these tools as a public good, allowing anyone to create agents on or off our platform. For example, in Antikythera's Beta Version (Not deployed to website, as it contains production-not-ready PK signing), **if a user asks the AI to purchase an Aptos Name, the AI reasons through the process and executes transactions sequentially.** It checks the balance, swaps for more APT if necessary (to cover the name cost), verifies the name price, and automatically completes the registry process.

![Beta 1](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/beta-1.jpg?v=2)

## Querying the blockchain

![](https://www.youtube.com/watch?v=v8GP_REJM4w)

> - Kana Labs DEX aggregator integration for optimal pricing and swap routes.
> - Integration with DeFiLlama for chain TVL and protocol/yield oppertunity data on Aptos

![Query USDC Instances](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/usdc-instances.png)

> Token information using Hippo Labs (data corrected/reviewed with Nodit's Indexer API), including bridged tokens and their diversification benefits

![Nodit 1](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/nodit-1.jpg)

> Token balances/portfolio of given address

![Echelon 1](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/echelon-1.jpg?v=2)
![Echelon 2](https://github.com/0xinevitable/antikythera/raw/main/.github/assets/echelon-2.jpg?v=2)

> Markets in Echelon (base asset, borrow/supply APRs, Tracked Price)

## Future Work

- Roll out execution mode with safer key management or/and browser wallet mode
- Aave integation after mainnet

- On-demand tool generation

  - In the future, we plan to leverage Move's capability to extract package ABI through RPC (`getAccountModule`, equivalent to `sui_getNormalizedMoveModulesByPackage` in Sui). This will enable AI to evaluate and utilize new packages in real-time by analyzing Aptos Move Code. We've already tested this approach with ThalaSwap (butlater replaced by KanaLabs's DEX aggregator integration). This method is also inspired by [ThalaLabs/surf](https://github.com/ThalaLabs/surf).

- Universal client
  - We aim to create a comprehensive client/frontend similar to Instadapp or DeFiLlama by combining AI agents with wallet connections. Our objective is to develop a decentralized frontend aggregator, offering a more intuitive experience for newcomers to the ecosystem.

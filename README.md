# Lens Open Action Hello World

This repo demonstrates the process of creating and executing a Lens open action to call a helloWorld() function on an external contract.

## Contracts

### Deployed Contracts

[HelloWorld.sol](https://mumbai.polygonscan.com/address/0xEcfeeE4dcEa32f109da4Ad4D97453cC2d998B60A) 

[HelloWorldOpenAction.sol](https://mumbai.polygonscan.com/address/0xfd2F3677147047F327FA5506D94D54d93080C7D9) 

### To Deploy Your Own

1.) Switch to contracts directory (`cd contracts`) and setup environment variables: copy `.env.example` to `.env`, input deployment values in `.env`, and run `source .env` (or equivalent on your OS) 

2.) Run script to deploy `HelloWorld.sol` and `HelloWorldOpenAction.sol` to Mumbai: `forge script script/HelloWorld.s.sol:HelloWorldScript --rpc-url $MUMBAI_RPC_URL --broadcast --verify -vvvv` 


## Frontend

Run the frontend by switching to frontend directory and running `bun install && bun run dev` 

Contract address are configured in `frontend/src/constants.ts` 

The `Create`, `Act`, and `Events` components contain logic to create post, execute action, and display HelloWorld.sol events respectively. 


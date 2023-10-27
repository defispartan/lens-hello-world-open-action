# Lens Open Action Hello World

This repo demonstrates the process of creating and executing a Lens open action to call a helloWorld() function on an external contract.

Steps:

1.) Switch to contracts directory (`cd contracts`) and setup environment variables: copy `.env.example` to `.env`, input deployment values in `.env`, and run `source .env` (or equivalent on your OS) 

2.) Run script to deploy `HelloWorld.sol` and `HelloWorldOpenAction.sol` to Mumbai: `forge script script/HelloWorld.s.sol:HelloWorldScript --rpc-url $MUMBAI_RPC_URL --broadcast --verify -vvvv` 

3.) Add deployed addresses to `frontend/src/constants.ts` 

4.) Run the frontend by switching to frontend directory and running `bun install && bun run dev` 

5.) Create post with action attached 

6.) Execute action which will call and emit an event on the HelloWorld contract 

# Lens Hello World Smart Post

This repo contains smart contracts and a UI which demonstrates a Lens Smart Post to call a helloWorld() function on an external contract.

The Polygon mainnet version of the site is live [here](https://lens-hello-world-open-action.vercel.app/)

- [Lens Hello World Smart Post](#lens-hello-world-smart-post)
  - [Integration Guide](#integration-guide)
    - [Create Post](#create-post)
    - [Execute](#execute)
  - [Smart Contracts](#smart-contracts)
    - [Polygon Mainnet](#polygon-mainnet)
    - [Mumbai Testnet](#mumbai-testnet)
    - [To Deploy Your Own](#to-deploy-your-own)
  - [Frontend](#frontend)
    - [Run The Frontend Locally](#run-the-frontend-locally)
    - [Use Your Own Contracts](#use-your-own-contracts)

## Integration Guide

The deployed action module addresses are:

- [Polygon Mainnet](https://polygonscan.com/address/0x7c4fAeef5ba47a437DFBaB57C016c1E706F56fcf)

- [Mumbai Testnet](https://mumbai.polygonscan.com/address/0x038D178a5aF79fc5BdbB436daA6B9144c669A93F)

To integrate this open action, support must be added to create and execute the action.

### Create Post

To create a publication with this action module attached there are two relavent fields:

`actionModules` - array of addresses which should contain module addresses above ^

`actionModuleInitDatas` - array of bytes data, for this action there is one parameter, a string containing an initialize message (which is contained in the Hello World event output)

An integration for this action should display an input box for the initialize string and encode it to be passed in the initDatas as follows:

```
// viem
const encodedInitDataVIem = encodeAbiParameters(
    [{ type: "string" }],
    [initializeString]
);

// ethers v5
const encodedInitDataEthers = ethers.utils.defaultAbiCoder.encode(
    ["string"],
    [initializeString]
);
```

For a complete example of creating a post with this open action module with viem, see [here](https://github.com/defispartan/lens-hello-world-open-action/blob/master/frontend/src/layout/Create.tsx)

### Execute

A publication with this open action will contain the module address and initialize data from the "Create Post" step contained in it's `postParams` field. To decode the initialize string:

```
const index = actionModules.indexOf(openActionContractAddress);
const actionModuleInitData = post.args.postParams.actionModulesInitDatas[index];

// viem
const decodedInitializeDataViem = decodeAbiParameters(
  [
    { type: 'string' },
  ],
  actionModuleInitData,
)

// ethers v5
const decodedInitializeDataEthers = ethers.utils.defaultAbiCoder.decode(
    ["string"],
    actionModuleInitData
);
```

To allow users to execute this action, an integration should display the decoded initialize string, an input box for the user to set an action string, and button which trigger the action.

When the button is pressed, `act` should be called on the `LensHub` contract, with relavent fields:

- publicationActedProfileId - Profile ID of action publisher, `args.postParams.profileId`

- publicationActedId - ID of publication with this action attached, `args.pubId`

- actionModuleAddress - module contract address from above

- actionModuleData - bytes data, for this action there is one parameter encoded, a string containing an action message (which is also contained in the Hello World event output)

The actionModuleData can be encoded identically to the initializeData.

For a complete example of executing this open action on a publication with viem, see [here](https://github.com/defispartan/lens-hello-world-open-action/blob/master/frontend/src/layout/Act.tsx)

## Smart Contracts

### Polygon Mainnet

[HelloWorld.sol](https://polygonscan.com/address/0xCAE0AD610762F917E249E26a64ac06bcDE926d9c)

[HelloWorldOpenAction.sol](https://polygonscan.com/address/0x7c4fAeef5ba47a437DFBaB57C016c1E706F56fcf)

### Mumbai Testnet

[HelloWorld.sol](https://mumbai.polygonscan.com/address/0x4ae4400c4f965F818f3E0b66e9b0ef5721146Bc0)

[HelloWorldOpenAction.sol](https://mumbai.polygonscan.com/address/0x038D178a5aF79fc5BdbB436daA6B9144c669A93F)

### To Deploy Your Own

1. **Clone this repo**
2. **Set the environement variables**

```Bash
# at the contract folder root
cd contract

# create the env file
cp .env.example .env

# setup the environment variables (see below)

# then export the environment variables
source .env
```

Environment variables description:

- `POLYGONSCAN_API_KEY` : Used by Foundry to deploy your contracts on Polygon OR Mumbai. You can get yours [here](https://dashboard.alchemy.com/apps).
- `PRIVATE_KEY` : Your own private key (the one that will deploy the contracts).
- `MODULE_OWNER` : The address corresponding to the private key.
- `LENS_HUB_PROXY` : The Lens Hub contract address. You can find this address [here](https://docs.lens.xyz/docs/deployed-contract-addresses).

1. **Deploy `HelloWorld.sol` and `HelloWorldOpenAction.sol` to Mumbai:**

   `forge script script/HelloWorld.s.sol:HelloWorldScript --rpc-url INSERT_RPC_HERE --broadcast --verify -vvvv`.

   `INSERT_RPC_HERE`: The RPC url corresponding to the network on which you want to deploy your contracts. You can find any RPC URL [here](https://chainlist.org/).

   ℹ️ If the contract verification failed, add the option `--etherscan-api-key <YOUR_POLYGONSCAN_API_KEY>` to the command.

## Frontend

Polygon deployment is live @ https://lens-hello-world-open-action.vercel.app/

### Run The Frontend Locally

1. **Clone this repo (if you haven't already)**
2. **Set the environement variables**

```Bash
# at the frontend folder root
cd frontend

# create the env file
cp .env.example .env

# set the environment variables (see below)

# then export the environment variables
source .env
```

Environment variables description:

- `VITE_ALCHEMY_POLYGON_API_KEY` : Used by the RPC to broadcast txs on Polygon. You can get yours [here](https://dashboard.alchemy.com/apps).
- `VITE_ALCHEMY_MUMBAI_API_KEY` : Used by the RPC to broadcast txs on Mumbai. You can get yours [here](https://dashboard.alchemy.com/apps).
- `VITE_WALLETCONNECT_PROJECT_ID` : Mandatory to use wallet connector provider. You can get a WalletConnect ProjectID [here](https://cloud.walletconnect.com).

3. **Make sure you have [bun installed](https://bun.sh/docs/installation) and run `bun install && bun run dev`**

<br/>

ℹ️ The `frontend/src/layout` components `Create`, `Act`, and `Events` contain code to create a post with this action, execute this action on a post, and display HelloWorld.sol events respectively.

ℹ️ If posts take too long to be retreive OR if you get a lot of `429: Too Many request` rate limit error due to your Alchemy free plan, we suggest you to set more recent block number for `openActionContractStartBlock` & `helloWorldContractStartBlock` variables of `frontend/src/utils/constants.tsx` file.

### Use Your Own Contracts

The local frontend works because the contracts have already been deployed on Polygon (cf: [Smart Contracts](#smart-contracts)). However if you have deployed your own contracts (by following [this section](#to-deploy-your-own)), here's how to get your local frontend working:

1. **In `frontend/src/utils/constants.tsx` file, update these different variables:**

   - `network`: the network where your contracts are deployed (Mumbai or Polygon)
   - `helloWorldContractAddress` : the address of the `HelloWorld.sol` contract (ie: the contract your Open Action will execute).
   - `openActionContractAddress` : the address of the `HelloWorldOpenAction.sol` contract (ie: the Open Action contract).
   - `openActionContractStartBlock` & `helloWorldContractStartBlock`: you can set the block number from which contracts have been deployed.

2. **Clean localStorage**

   If you already tried the frontend previously with other contracts or other networks, please make sure to clean all the localStorage before running the frontend again (posts and events are stored on localStorage to avoid refetching them again at each refresh).

3. **Get a Lens Profile**

   If you chose to deploy your contract on Mumbai testnet, make sure to have a Lens Testnet Profile. You can get one [here](https://testnet.hey.xyz/) (click on "Login" then on "Create a testnet account").

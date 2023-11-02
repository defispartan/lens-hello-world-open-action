# Lens Hello World Smart Post

This repo contains smart contracts and a UI which demonstrates a Lens Smart Post to call a helloWorld() function on an external contract.

To get started, you can create a profile on the Mumbai deployment of Lens V2 [here](https://web-git-lens-v2-testnet-heyxyz.vercel.app/).


- [Integration Guide](#integration-guide)

- [Frontend](#frontend)

- [Smart Contracts](#smart-contracts)



## Integration Guide 

The deployed action module addresses are: 

- [Mumbai Testnet](https://mumbai.polygonscan.com/address/0xfd2F3677147047F327FA5506D94D54d93080C7D9) 

- Polygon Mainnet - Coming Soon 


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


### Mumbai Testnet

[HelloWorld.sol](https://mumbai.polygonscan.com/address/0xEcfeeE4dcEa32f109da4Ad4D97453cC2d998B60A) 

[HelloWorldOpenAction.sol](https://mumbai.polygonscan.com/address/0xfd2F3677147047F327FA5506D94D54d93080C7D9) 

### Polygon Mainnet

Coming Soon


### To Deploy Your Own

1.) Switch to contracts directory (`cd contracts`) and setup environment variables: copy `.env.example` to `.env`, input deployment values in `.env`, and run `source .env` (or equivalent on your OS) 

2.) Run script to deploy `HelloWorld.sol` and `HelloWorldOpenAction.sol` to Mumbai: `forge script script/HelloWorld.s.sol:HelloWorldScript --rpc-url $MUMBAI_RPC_URL --broadcast --verify -vvvv` 



## Frontend

Live @ https://hello-world-open-action.vercel.app/

To run locally, clone repo, switch to frontend directory, make sure you have [bun installed](https://bun.sh/docs/installation) and run `bun install && bun run dev` 

Contract address are configured in `frontend/src/constants.ts` 

The `frontend/src/layout` components `Create`, `Act`, and `Events` contain code to create a post with this action, execute this action on a post, and display HelloWorld.sol events respectively. 

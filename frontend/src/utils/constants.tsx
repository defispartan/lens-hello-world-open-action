export const helloWorldContractAddress =
  "0xEcfeeE4dcEa32f109da4Ad4D97453cC2d998B60A";
export const helloWorldContractStartBlock = 41812097;
export const openActionContractAddress =
  "0xfd2F3677147047F327FA5506D94D54d93080C7D9";
export const openActionsContractStartBlock = 41812097;

export const lensHubProxyAddress = "0xC1E77eE73403B8a7478884915aA599932A677870";
export const blockExplorerLink = "https://mumbai.polygonscan.com/tx/";
// WARNING - this will be exposed client-side should only bre used for development
// Alchemy supports unlimite eth_getLogs for requests with < 10k logs
export const rpc = `https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_RPC_KEY}`;
export const network: string = "mumbai"; // options: 'polygon', 'mumbai'

// mode flag sets whether to fetch smart post instances from Lens API or querying directly from contract events
// Mumbai open actions are always indexed on the Lens API, Polygon actions need to be allowlisted on the API (though they are permisionless on-chain)
// To request allowlist for Polygon actions, you can submit a PR to https://github.com/lens-protocol/open-actions-directory
export const mode: string = "events"; // options: 'api', 'events'
export const ipfsGateway = "https://ipfs.io/ipfs/";
export const arweaveGateway = "https://arweave.net/";

interface UiConfig {
  helloWorldContractAddress: `0x${string}`;
  helloWorldContractStartBlock: number;
  openActionContractAddress: `0x${string}`;
  openActionContractStartBlock: number;
  lensHubProxyAddress: `0x${string}`;
  blockExplorerLink: string;
  rpc: string;
}

export const uiConfig: UiConfig =
  network === "polygon"
    ? {
        helloWorldContractAddress: "0x",
        helloWorldContractStartBlock: 0,
        openActionContractAddress: "0x",
        openActionContractStartBlock: 0,
        lensHubProxyAddress: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
        blockExplorerLink: "https://polygonscan.com/tx/",
        rpc: `https://polygon-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY
        }`,
      }
    : {
        helloWorldContractAddress: "0x4ae4400c4f965F818f3E0b66e9b0ef5721146Bc0",
        helloWorldContractStartBlock: 42984295,
        openActionContractAddress: "0x038D178a5aF79fc5BdbB436daA6B9144c669A93F",
        openActionContractStartBlock: 42984295,
        lensHubProxyAddress: "0x4fbffF20302F3326B20052ab9C217C44F6480900",
        blockExplorerLink: "https://mumbai.polygonscan.com/tx/",
        rpc: `https://polygon-mumbai.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_MUMBAI_API_KEY
        }`,
      };

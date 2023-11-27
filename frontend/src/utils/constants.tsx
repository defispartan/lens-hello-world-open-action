export const network: string = "mumbai"; // options: 'polygon', 'mumbai'

// mode flag sets whether to fetch smart post instances from Lens API or querying directly from contract events
// Mumbai open actions are always indexed on the Lens API, Polygon actions need to be allowlisted on the API (though they are permisionless on-chain)
// To request allowlist for Polygon actions, you can submit a PR to https://github.com/lens-protocol/open-actions-directory
export const mode: string = "api"; // options: 'api', 'events'

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
        helloWorldContractAddress: "0x67eF9e991F3A87ACE457ab1f28A4C8804d971fDb",
        helloWorldContractStartBlock: 49457217,
        openActionContractAddress: "0x65a37d58Ed258cf5BDEa05ed67d9A8922A179b3E",
        openActionContractStartBlock: 49457217,
        lensHubProxyAddress: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
        blockExplorerLink: "https://polygonscan.com/tx/",
        rpc: `https://polygon-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY
        }`,
      }
    : {
        helloWorldContractAddress: "0x89D7Fe2f4411487a0691CF8E9461f21Dd29Ba496",
        helloWorldContractStartBlock: 42890416,
        openActionContractAddress: "0x7AAc74F75ac038478922E1dE753260fA20cf3CB8",
        openActionContractStartBlock: 42890416,
        lensHubProxyAddress: "0x4fbffF20302F3326B20052ab9C217C44F6480900",
        blockExplorerLink: "https://mumbai.polygonscan.com/tx/",
        rpc: `https://polygon-mumbai.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_MUMBAI_API_KEY
        }`,
      };

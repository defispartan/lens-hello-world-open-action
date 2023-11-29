import { arweaveGateway, ipfsGateway } from "./constants";

export const serializeLink = (link: string) => {
  link = link.replace("ipfs://", ipfsGateway);
  link = link.replace("ar://", arweaveGateway);
  return link;
};

import { ReactNode } from "react";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig } from "wagmi";
import { polygonMumbai, polygon } from "wagmi/chains";
import { network } from "@/utils/constants";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const metadata = {
  name: "Lens Hello World Open Action",
  description: "Demo of Lens open action calling helloWorld function",
  url: "https://hello-world-open-action.vercel.com",
  icons: [
    "https://ipfs.io/ipfs/QmQGYyua2hhaZa6ByemzyA2xvDhbgcCeMmF6pxhjZ2Y9a1",
  ],
};

const chains = [network === "polygon" ? polygon : polygonMumbai];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

interface Props {
  children?: ReactNode;
}

export function WalletConnectProvider({ children }: Props) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}

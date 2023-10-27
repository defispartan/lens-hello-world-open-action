import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Home } from "./Home.tsx";
import { LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { polygonMumbai } from "wagmi/chains";
import { LensProvider } from "@lens-protocol/react-web";

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: "4fd06e4b38442f90da013ff3f7edd94c",
    appName: "Lens Hello World Open Action",
    chains: [polygonMumbai],
  })
);

export const App = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <LensProvider config={lensConfig}>
          <Home />
        </LensProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;

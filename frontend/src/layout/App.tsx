import { Home } from "./Home.tsx";
import { LensConfig, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { LensProvider } from "@lens-protocol/react-web";
import { LensHelloWorldProvider } from "../context/useLensHelloWorld.tsx";
import { WalletConnectProvider } from './WalletConnectProvider.tsx' 
import { useLensHelloWorld } from "../context/LensHellowWorldContext";
import { Button } from '@/components/ui/button'

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
}

export const App = () => {
  return (
    <WalletConnectProvider>
      <LensProvider config={lensConfig}>
        <LensHelloWorldProvider>
          <Nav />
          <Home />
        </LensHelloWorldProvider>
      </LensProvider>
    </WalletConnectProvider>
  );
};

function Nav() {
  const { handle, clear, disconnect } = useLensHelloWorld()

  return (
    <nav className="flex flex-1 border-b">
      <div className="px-4 py-3 flex-1">
        <p className="text-sm">
          Lens Smart Post Starter
        </p>
      </div>
      {handle && (
        <>
          <Button
            variant='link'
            className="py-1 mr-3"
            onClick={() => {
              clear();
              disconnect();
            }}
          >
              Disconnect
          </Button>
        </>
      )}
    </nav>
  )
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { configureChains } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

export const { publicClient } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://polygon-testnet.public.blastapi.io",
      }),
    }),
  ]
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

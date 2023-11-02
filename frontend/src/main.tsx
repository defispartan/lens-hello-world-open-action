import React from "react";
import ReactDOM from "react-dom/client";
import App from "./layout/App.tsx";
import { configureChains } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { rpc } from "./utils/constants.tsx";
import './index.css'

export const { publicClient } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: rpc,
      }),
    }),
  ]
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

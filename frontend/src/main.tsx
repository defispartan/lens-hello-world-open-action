import React from "react";
import ReactDOM from "react-dom/client";
import App from "./layout/App.tsx";
import { configureChains } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { uiConfig, network } from "./utils/constants.tsx";
import "./index.css";
import { publicProvider } from "wagmi/providers/public";

const networkSlug = network === "polygon" ? polygon : polygonMumbai;

export const { publicClient } = configureChains(
  [networkSlug],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: uiConfig.rpc,
      }),
    }),
    publicProvider(),
  ]
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

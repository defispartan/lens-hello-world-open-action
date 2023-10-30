// LensHelloWorldContext.tsx
import React, { useContext } from "react";
import { GreetEventFormatted, PostCreatedEventFormatted } from "../utils/types";

interface LensHelloWorldContextState {
  profileId?: number;
  handle?: string;
  address?: `0x${string}`;
  posts: PostCreatedEventFormatted[];
  greetings: GreetEventFormatted[];
  refresh: () => void;
  clear: () => void;
  loading: boolean;
  disconnect: () => void;
}

const LensHelloWorldContext = React.createContext<LensHelloWorldContextState>(
  { clear: () => { }, posts: [], greetings: [], refresh: () => { }, loading: false, disconnect: () => { } }
);

export const useLensHelloWorld = (): LensHelloWorldContextState => {
  return useContext(LensHelloWorldContext);
};

export default LensHelloWorldContext;

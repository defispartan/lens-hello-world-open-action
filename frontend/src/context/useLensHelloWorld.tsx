import { ReactNode, FC, useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import LensHelloWorldContext from "./LensHelloWorldContext";
import {
  GreetEvent,
  GreetEventFormatted,
  PostCreatedEvent,
  PostCreatedEventFormatted,
  convertPostEventToSerializable,
  convertGreetEventToSerializable,
  LoginData,
} from "../utils/types";
import { network, uiConfig } from "../utils/constants";
import { publicClient } from "../main";
import { lensHubEventsAbi } from "../utils/lensHubEventsAbi";
import { helloWorldAbi } from "../utils/helloWorldAbi";
import { disconnect } from "wagmi/actions";

interface LensHelloWorldProviderProps {
  children: ReactNode;
}

export const LensHelloWorldProvider: FC<LensHelloWorldProviderProps> = ({
  children,
}) => {
  const [handle, setHandle] = useState<string | undefined>();
  const [profileId, setProfileId] = useState<number | undefined>();
  const { address } = useAccount();
  const [posts, setPosts] = useState<PostCreatedEventFormatted[]>([]);
  const [greetings, setGreetings] = useState<GreetEventFormatted[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>();

  const connect = (loginDataParam: LoginData) => {
    setLoginData(loginDataParam);
  };

  const refresh = useCallback(async () => {
    const chainId = network === "polygon" ? 137 : 80001;

    setLoading(true);

    const savedCurrentBlock = localStorage.getItem("currentBlock");
    const savedPostEvents: PostCreatedEventFormatted[] = JSON.parse(
      localStorage.getItem("postEvents") || "[]"
    );
    const savedHelloWorldEvents: GreetEventFormatted[] = JSON.parse(
      localStorage.getItem("helloWorldEvents") || "[]"
    );

    if (savedPostEvents.length) {
      setPosts(savedPostEvents);
    }

    if (savedHelloWorldEvents) {
      setGreetings(savedHelloWorldEvents);
    }

    const startBlock = savedCurrentBlock
      ? parseInt(savedCurrentBlock)
      : uiConfig.openActionContractStartBlock;

    const currentBlock = await publicClient({
      chainId,
    }).getBlockNumber();

    const postEventsMap = new Map(
      savedPostEvents.map((event) => [event.transactionHash, event])
    );
    const helloWorldEventsMap = new Map(
      savedHelloWorldEvents.map((event) => [event.transactionHash, event])
    );

    for (let i = startBlock; i < currentBlock; i += 2000) {
      const toBlock = i + 1999 > currentBlock ? currentBlock : i + 1999;

      const postEvents = await publicClient({
        chainId: network === "polygon" ? 137 : 80001,
      }).getContractEvents({
        address: uiConfig.lensHubProxyAddress,
        abi: lensHubEventsAbi,
        eventName: "PostCreated",
        fromBlock: BigInt(i),
        toBlock: BigInt(toBlock),
      });

      const helloWorldEvents = await publicClient({
        chainId,
      }).getContractEvents({
        address: uiConfig.helloWorldContractAddress,
        abi: helloWorldAbi,
        eventName: "Greet",
        fromBlock: BigInt(i),
        toBlock: BigInt(toBlock),
      });

      const postEventsParsed = postEvents as unknown as PostCreatedEvent[];
      const helloWorldEventsParsed =
        helloWorldEvents as unknown as GreetEvent[];

      const filteredEvents = postEventsParsed.filter((event) => {
        return event.args.postParams.actionModules.includes(
          uiConfig.openActionContractAddress
        );
      });

      const serializablePostEvents = filteredEvents.map((event) =>
        convertPostEventToSerializable(event)
      );

      const serializableGreetEvents = helloWorldEventsParsed.map((event) =>
        convertGreetEventToSerializable(event)
      );

      serializablePostEvents.forEach((event) =>
        postEventsMap.set(event.transactionHash, event)
      );
      serializableGreetEvents.forEach((event) =>
        helloWorldEventsMap.set(event.transactionHash, event)
      );
    }

    const allPostEvents = Array.from(postEventsMap.values());
    const allHelloWorldEvents = Array.from(helloWorldEventsMap.values());

    localStorage.setItem("currentBlock", currentBlock.toString());
    localStorage.setItem("postEvents", JSON.stringify(allPostEvents));
    localStorage.setItem(
      "helloWorldEvents",
      JSON.stringify(allHelloWorldEvents)
    );

    setPosts(allPostEvents);
    setGreetings(allHelloWorldEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (loginData) {
      setHandle(loginData!.handle!.localName);
      setProfileId(parseInt(loginData!.id, 16));

      localStorage.setItem("handle", loginData!.handle!.localName);
      localStorage.setItem("profileId", loginData!.id);
      localStorage.setItem("address", loginData.ownedBy.address);
    }
  }, [loginData]);

  // Set handle and profile
  useEffect(() => {
    const storedHandle = localStorage.getItem("handle");
    const storedProfileId = localStorage.getItem("profileId");
    const storedAddress = localStorage.getItem("address");

    if (storedHandle && address === storedAddress) {
      setHandle(storedHandle);
    } else {
      setHandle(undefined);
    }

    if (storedProfileId && address === storedAddress) {
      setProfileId(parseInt(storedProfileId, 16));
    } else {
      setProfileId(undefined);
    }
  }, [address]);

  return (
    <LensHelloWorldContext.Provider
      value={{
        profileId,
        handle,
        address,
        posts,
        greetings,
        refresh,
        clear: () => {
          setProfileId(undefined);
          setHandle(undefined);
        },
        disconnect: () => {
          disconnect();
          localStorage.removeItem("handle");
          localStorage.removeItem("profileId");
          localStorage.removeItem("address");
        },
        loading,
        connect,
      }}>
      {children}
    </LensHelloWorldContext.Provider>
  );
};

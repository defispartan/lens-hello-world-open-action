import { useLogin } from "@lens-protocol/react-web";
import { ReactNode, FC, useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import LensHelloWorldContext from "./LensHellowWorldContext";
import {
  GreetEvent,
  GreetEventFormatted,
  PostCreatedEvent,
  PostCreatedEventFormatted,
  convertPostEventToSerializable,
  convertGreetEventToSerializable,
} from "../utils/types";
import {
  helloWorldContractAddress,
  lensHubProxyAddress,
  openActionContractAddress,
  openActionsContractStartBlock,
} from "../utils/constants";
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
  const { data: loginData } = useLogin();
  const [posts, setPosts] = useState<PostCreatedEventFormatted[]>([]);
  const [greetings, setGreetings] = useState<GreetEventFormatted[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
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
      : openActionsContractStartBlock;

    const currentBlock = await publicClient({ chainId: 1 }).getBlockNumber();

    let allPostEvents: PostCreatedEventFormatted[] = [...savedPostEvents];
    let allHelloWorldEvents: GreetEventFormatted[] = [...savedHelloWorldEvents];

    for (let i = startBlock; i < currentBlock; i += 1000) {
      const toBlock = i + 999 > currentBlock ? currentBlock : i + 999;

      const postEvents = await publicClient({ chainId: 1 }).getContractEvents({
        address: lensHubProxyAddress,
        abi: lensHubEventsAbi,
        eventName: "PostCreated",
        fromBlock: BigInt(i),
        toBlock: BigInt(toBlock),
      });

      const helloWorldEvents = await publicClient({
        chainId: 1,
      }).getContractEvents({
        address: helloWorldContractAddress,
        abi: helloWorldAbi,
        eventName: "Greet",
        fromBlock: BigInt(i),
        toBlock: BigInt(toBlock),
      });

      const postEventsParsed = postEvents as unknown as PostCreatedEvent[];
      const helloWorldEventsParsed =
        helloWorldEvents as unknown as GreetEvent[];

      const filteredEvents = postEventsParsed.filter((event) =>
        event.args.postParams.actionModules.includes(openActionContractAddress)
      );

      const serializablePostEvents = filteredEvents.map((event) =>
        convertPostEventToSerializable(event)
      );

      const serializableGreetEvents = helloWorldEventsParsed.map((event) =>
        convertGreetEventToSerializable(event)
      );

      allPostEvents = [...allPostEvents, ...serializablePostEvents];
      allHelloWorldEvents = [
        ...allHelloWorldEvents,
        ...serializableGreetEvents,
      ];
    }

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
      }}
    >
      {children}
    </LensHelloWorldContext.Provider>
  );
};

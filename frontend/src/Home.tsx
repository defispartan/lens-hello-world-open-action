import { ConnectKitButton } from "connectkit";
import "./styles/Action.css";
import { useAccount, useWalletClient } from "wagmi";
import {
  //OpenActionType,
  //useCreatePost,
  useLogin,
  useProfiles,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { disconnect } from "@wagmi/core";
import {
  blockExplorerLink,
  lensHubProxyAddress,
  openActionContractAddress,
} from "./constants";
//import { Data } from "@lens-protocol/shared-kernel";
import { ethers } from "ethers";
import { abi } from "./utils/lensHubAbi";
import { publicClient } from "./main";
import { Actions } from "./Actions";
import { Events } from "./Events";

export const Home = () => {
  const [handle, setHandle] = useState<string | undefined>();
  const [profileId, setProfileId] = useState<number | undefined>();
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [uri, setURI] = useState<string>("");
  const [initializeText, setInitializeText] = useState<string>("");

  const { data: walletClient } = useWalletClient();

  const { execute: executeLogin, data: loginData } = useLogin();
  //const { execute: executePost } = useCreatePost();

  const { address } = useAccount();
  const { data: profiles } = useProfiles({
    where: {
      ownedBy: [address as string],
    },
  });

  const createPost = async () => {
    // Via API, requires module address to be explicitly approved
    /*       const response = await executePost({
        metadata: uri,
        actions: [
          {
            type: OpenActionType.UNKNOWN_OPEN_ACTION,
            address: openActionContractAddress,
            data: encodedActionData as Data,
          },
        ],
      });
      console.log(response); */

    const contract = new ethers.Contract(
      lensHubProxyAddress,
      abi,
      new ethers.VoidSigner(lensHubProxyAddress)
    );

    const encodedInitData = ethers.utils.defaultAbiCoder.encode(
      ["string"],
      [initializeText]
    );

    // Post parameters
    const params = {
      profileId,
      contentURI: uri,
      actionModules: [openActionContractAddress],
      actionModulesInitDatas: [encodedInitData],
      referenceModule: "0x0000000000000000000000000000000000000000",
      referenceModuleInitData: ethers.utils.arrayify("0x01"),
    };

    const calldata = contract.interface.encodeFunctionData("post", [params]);
    setCreateState("PENDING IN WALLET");
    try {
      const hash = await walletClient!.sendTransaction({
        to: lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
      });
      setCreateState("PENDING IN MEMPOOL");
      setTxHash(hash);
      const result = await publicClient({
        chainId: 80001,
      }).waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        setCreateState("SUCCESS");
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  useEffect(() => {
    if (loginData) {
      setHandle(loginData!.handle!.localName);
      setProfileId(parseInt(loginData!.id, 16));

      localStorage.setItem("handle", loginData!.handle!.localName);
      localStorage.setItem("profileId", loginData!.id);
    }
  }, [loginData]);

  useEffect(() => {
    const storedHandle = localStorage.getItem("handle");
    const storedProfileId = localStorage.getItem("profileId");

    if (storedHandle) {
      setHandle(storedHandle);
    }

    if (storedProfileId) {
      setProfileId(parseInt(storedProfileId, 16));
    }
  }, []);

  const showNoLensProfiles =
    address && !handle && profiles && profiles.length === 0;
  const showSignInWithLens =
    address && !handle && profiles && profiles.length > 0;

  return (
    <div className="container">
      <h1>Lens Hello World Open Action</h1>
      {!address && <ConnectKitButton />}
      {showNoLensProfiles && <p>No Lens Profiles found for this address</p>}
      {showSignInWithLens &&
        profiles.map((profile, index) => (
          <button
            key={index}
            className="profile-button"
            onClick={() => executeLogin({ address, profileId: profile.id })}
          >
            Sign in with {profile.handle?.localName}.lens
          </button>
        ))}
      {handle && (
        <>
          <p className="logged-in-text">Logged in as {handle}.lens</p>
          <button
            className="disconnect-button"
            onClick={() => {
              setHandle(undefined);
              disconnect();
            }}
          >
            Disconnect
          </button>
        </>
      )}
      {handle && (
        <>
          <h3 className="headerTop">Create Smart Post</h3>
          <div className="box">
            <label htmlFor="initializeTextId">
              Content URI (link to content for the post)
            </label>
            <input
              id="uriId"
              className="inputBox"
              type="text"
              value={uri}
              onChange={(e) => setURI(e.target.value)}
            />
            <label htmlFor="initializeTextId">
              Initialize message (will be emitted in HelloWorld event)
            </label>
            <input
              id="initializeTextId"
              className="inputBox"
              type="text"
              value={initializeText}
              onChange={(e) => setInitializeText(e.target.value)}
            />
            <button className="button create-button" onClick={createPost}>
              Create
            </button>
            {createState && <p className="create-state-text">{createState}</p>}
            {txHash && (
              <a
                href={`${blockExplorerLink}${txHash}`}
                className="block-explorer-link"
              >
                Block Explorer Link
              </a>
            )}
            <button
              className="clear-button"
              onClick={() => {
                setTxHash(undefined);
                setInitializeText("");
                setURI("");
              }}
            >
              Clear
            </button>
          </div>
          <h3 className="headerTop">Hello World Open Action Posts</h3>
          <Actions />
          <h3 className="headerTop">Hello World Events</h3>
          <Events />
        </>
      )}
    </div>
  );
};

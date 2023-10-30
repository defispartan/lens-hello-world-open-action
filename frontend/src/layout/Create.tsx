import { useState } from "react";
import { useLensHelloWorld } from "../context/LensHellowWorldContext";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import {
  blockExplorerLink,
  lensHubProxyAddress,
  openActionContractAddress,
} from "../utils/constants";
import { lensHubAbi } from "../utils/lensHubAbi";
import { useWalletClient } from "wagmi";
import { publicClient } from "../main";

export const Create = () => {
  const { address, profileId, refresh } = useLensHelloWorld();
  const { data: walletClient } = useWalletClient();
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [uri, setURI] = useState<string>("");
  const [initializeText, setInitializeText] = useState<string>("");

  const createPost = async () => {
    const encodedInitData = encodeAbiParameters(
      [{ type: "string" }],
      [initializeText]
    );

    // Post parameters
    const args = {
      profileId: BigInt(profileId!),
      contentURI: uri,
      actionModules: [openActionContractAddress as `0x${string}`],
      actionModulesInitDatas: [encodedInitData],
      referenceModule:
        "0x0000000000000000000000000000000000000000" as `0x${string}`,
      referenceModuleInitData: "0x01" as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: "post",
      args: [args],
    });

    setCreateState("PENDING IN WALLET");
    try {
      const hash = await walletClient!.sendTransaction({
        to: lensHubProxyAddress,
        account: address,
        data: calldata,
      });
      setCreateState("PENDING IN MEMPOOL");
      setTxHash(hash);
      const result = await publicClient({
        chainId: 80001,
      }).waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        setCreateState("SUCCESS");
        refresh();
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <>
      <h3 className="headerTop">Create Hello World Smart Post</h3>
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
    </>
  );
};

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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
      <div className="pb-4">
        {
          address && profileId && (
            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col">
                <p className="my-2">
                  Content URI (link to content for the post)
                </p>
                <Input
                  type="text"
                  value={uri}
                  placeholder="URI"
                  onChange={(e) => setURI(e.target.value)}
                />
                <p className="my-2">
                  Initialize message (will be emitted in HelloWorld event)
                </p>
                <Input
                  placeholder="Message"
                  type="text"
                  value={initializeText}
                  onChange={(e) => setInitializeText(e.target.value)}
                />
                <Button
                  className="mt-3"
                  onClick={createPost}
                >
                  Create
                </Button>
              </div>
              {createState && <p className="create-state-text">{createState}</p>}
              {txHash && (
                <a
                  href={`${blockExplorerLink}${txHash}`}
                  className="block-explorer-link"
                >
                  Block Explorer Link
                </a>
              )}
              <Button
                variant={'outline'}
                className="my-3"
                onClick={() => {
                  setTxHash(undefined);
                  setInitializeText("");
                  setURI("");
                }}
              >
                Clear
              </Button>
            </div>
          )
        }
      </div>
    </>
  );
};

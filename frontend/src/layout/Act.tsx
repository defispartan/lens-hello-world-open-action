import { useState } from "react";
import { publicClient } from "../main";
import {
  lensHubProxyAddress,
  openActionContractAddress,
  blockExplorerLink,
} from "../utils/constants";
import { lensHubAbi } from "../utils/lensHubAbi";
import { useWalletClient } from "wagmi";
import { PostCreatedEventFormatted } from "../utils/types";
import { fetchInitMessage } from "../utils/fetchInitMessage";
import { useLensHelloWorld } from "../context/LensHellowWorldContext";
import { encodeAbiParameters, encodeFunctionData } from "viem";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ActionBox = ({
  post,
  address,
  profileId,
  refresh,
}: {
  post: PostCreatedEventFormatted;
  address?: `0x${string}`;
  profileId?: number;
  refresh: () => void;
}) => {
  const [actionText, setActionText] = useState<string>("");
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const { data: walletClient } = useWalletClient();

  const execute = async (
    post: PostCreatedEventFormatted,
    actionText: string
  ) => {
    const encodedActionData = encodeAbiParameters(
      [{ type: "string" }],
      [actionText]
    );

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId || 0),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: openActionContractAddress as `0x${string}`,
      actionModuleData: encodedActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: "act",
      args: [args],
    });

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
        refresh();
      } else {
        setCreateState("CREATE TXN REVERTED");
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="flex flex-col border rounded-xl px-5 py-3 mb-3 justify-center">
      <div className="flex flex-col justify-center items-center">
        <p>ProfileID: {post.args.postParams.profileId}</p>
        <p>PublicationID: {post.args.pubId}</p>
        <p>
          Initialize Message: {fetchInitMessage(post)}
        </p>
        <img
          className="my-3 rounded-2xl"
          src={post.args.postParams.contentURI}
          alt="Post"
        />
        <Button asChild variant='link'>
          <a
            href={`${blockExplorerLink}${post.transactionHash}`}
            target="_blank"
          >
            Txn Link
          </a>
        </Button>
        
      </div>
      <div >
        <p className="mb-3">
          Action message (will be emitted in HelloWorld event)
        </p>
        <Input
          id={`initializeTextId-${post.args.pubId}`}
          type="text"
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
          disabled={!profileId}
        />
      </div>
      {profileId && (
        <Button
          className="mt-3"
          onClick={() => execute(post, actionText)}
        >
          Post Message
        </Button>
      )}
      {createState && <p className="mt-2 text-primary">{createState}</p>}
      {txHash && (
        <a
          href={`${blockExplorerLink}${txHash}`}
        >
          Block Explorer Link
        </a>
      )}
    </div>
  );
};

export const Actions = () => {
  const [filterOwnPosts, setFilterOwnPosts] = useState(false);
  const { address, profileId, posts, refresh, loading } = useLensHelloWorld();

  let filteredPosts = filterOwnPosts
    ? posts.filter(
        (post) => post.args.postParams.profileId === profileId?.toString()
      )
    : posts;

  filteredPosts = filteredPosts.sort((a, b) => {
    const blockNumberA = parseInt(a.blockNumber, 10);
    const blockNumberB = parseInt(b.blockNumber, 10);
    return blockNumberB - blockNumberA;
  });

  return (
    <>
      {
        address && profileId && (
          <div className="my-3">
            <input
              type="checkbox"
              id="filterCheckbox"
              className="mr-3"
              checked={filterOwnPosts}
              onChange={(e) => setFilterOwnPosts(e.target.checked)}
            />
            <label htmlFor="filterCheckbox">
              Filter only posts from my profile
            </label>
          </div>
        )
      }
      {loading && <div className="spinner" />}
      {filteredPosts.length === 0 ? (
        <p>None</p>
      ) : (
        filteredPosts.map((post, index) => (
          <ActionBox
            key={index}
            post={post}
            address={address}
            profileId={profileId}
            refresh={refresh}
          />
        ))
      )}
    </>
  );
};

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
    <div className="box post-box">
      <div className="centered-box">
        <div className="field">ProfileID: {post.args.postParams.profileId}</div>
        <div className="field">PublicationID: {post.args.pubId}</div>
        <div className="header-text">
          Initialize Message: {fetchInitMessage(post)}
        </div>
        <div className="field">
          <img
            src={post.args.postParams.contentURI}
            className="uri"
            alt="Post"
          />
        </div>
        <div className="field">
          <a
            href={`${blockExplorerLink}${post.transactionHash}`}
            target="_blank"
          >
            Txn Link
          </a>
        </div>
      </div>
      <div className="inline-content">
        <label htmlFor={`initializeTextId-${post.args.pubId}`}>
          Action message (will be emitted in HelloWorld event)
        </label>
        <input
          id={`initializeTextId-${post.args.pubId}`}
          className="inputBox"
          type="text"
          value={actionText}
          onChange={(e) => setActionText(e.target.value)}
        />
        <button
          className="clear-button"
          onClick={() => {
            setTxHash(undefined);
            setActionText("");
          }}
        >
          Clear
        </button>
      </div>
      <button
        className="button create-button active"
        onClick={() => execute(post, actionText)}
      >
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
      <h3 className="headerTop">Posts w/ Hello World Open Action</h3>
      {!address ? (
        <div className="box post-box">
          <div>Connect wallet to execute action</div>
        </div>
      ) : !profileId ? (
        <div className="box post-box">
          <div>Sign in with Lens profile to execute action</div>
        </div>
      ) : (
        <>
          <div>
            <input
              type="checkbox"
              id="filterCheckbox"
              className="filter-label"
              checked={filterOwnPosts}
              onChange={(e) => setFilterOwnPosts(e.target.checked)}
            />
            <label htmlFor="filterCheckbox" className="filter-label">
              Filter only posts from my profile
            </label>
          </div>
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
      )}
    </>
  );
};

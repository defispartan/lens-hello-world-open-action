import { useEffect } from "react";
//import { publicClient } from "./main";
//import { lensHubProxyAddress } from "./constants";
//import { abi } from "../../lensHubAbi";

export const Actions = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      /*     const events = await publicClient({ chainId: 1 }).getContractEvents({
        address: lensHubProxyAddress,
        abi,
        eventName: "Post"
      }); */
    };

    fetchEvents();
  }, []);

  const posts: string[] = [];
  return (
    <>
      {posts.length === 0 ? (
        <p>None</p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="box">
            {post}
          </div>
        ))
      )}
    </>
  );
};

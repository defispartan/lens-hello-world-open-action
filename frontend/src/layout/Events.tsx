import { useState } from "react";
import { useLensHelloWorld } from "../context/LensHellowWorldContext";
import { blockExplorerLink } from "../utils/constants";

export const Events = () => {
  const [filterOwnEvents, setFilterOwnEvents] = useState(false);
  const { greetings, loading, address } = useLensHelloWorld();

  let filteredEvents = filterOwnEvents
    ? greetings.filter((greet) => greet.args.actor === address)
    : greetings;

  filteredEvents = filteredEvents.sort((a, b) => {
    const blockNumberA = parseInt(a.blockNumber, 10);
    const blockNumberB = parseInt(b.blockNumber, 10);
    return blockNumberB - blockNumberA;
  });

  return (
    <>
      {address && <div className="my-3">
        <input
          type="checkbox"
          className="mr-3"
          id="filterCheckbox"
          checked={filterOwnEvents}
          onChange={(e) => setFilterOwnEvents(e.target.checked)}
        />
        <label htmlFor="filterCheckbox" >
          Filter only events from my address
        </label>
      </div>}
      {loading && <div className="spinner" />}
      {filteredEvents.length === 0 ? (
        <p>None</p>
      ) : (
        filteredEvents.map((event, index) => (
          <div key={index} className="border p-3 rounded-xl mt-3 w-[500px]">
            <p className="font-geist-medium">{event.args.message}</p>
            <div className="inline-content">from</div>
            <div className="inline-content">{event.args.actor}</div>
            <div className="header-text">
              <a href={`${blockExplorerLink}${event.transactionHash}`}>Link</a>
            </div>
          </div>
        ))
      )}
    </>
  );
};

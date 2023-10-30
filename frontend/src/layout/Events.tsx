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
      <h3 className="headerTop">Hello World Events</h3>
      {address && <div>
        <input
          type="checkbox"
          id="filterCheckbox"
          className="filter-label"
          checked={filterOwnEvents}
          onChange={(e) => setFilterOwnEvents(e.target.checked)}
        />
        <label htmlFor="filterCheckbox" className="filter-label">
          Filter only events from my address
        </label>
      </div>}
      {loading && <div className="spinner" />}
      {filteredEvents.length === 0 ? (
        <p>None</p>
      ) : (
        filteredEvents.map((event, index) => (
          <div key={index} className="box post-box">
            <div className="inline-content">{event.args.message}</div>
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

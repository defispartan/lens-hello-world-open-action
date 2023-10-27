export const Events = () => {
  const events: string[] = [];
  return (
    <>
      {events.length === 0 ? (
        <p>None</p>
      ) : (
        events.map((event, index) => (
          <div key={index} className="box">
            {event}
          </div>
        ))
      )}
    </>
  );
};

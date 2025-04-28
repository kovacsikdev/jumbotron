import { useState } from "react";
import { Link } from "react-router-dom";
import { JumboTron } from "../components/JumboTron";
import { useSearchParams } from "react-router-dom";

export const Audience = () => {
  const [goToRoom, setGoToRoom] = useState<string>("");
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");

  const handleGoToRoom = () => {
    if (goToRoom.length > 0) {
      window.location.href = `/jumbotron/audience?roomId=${goToRoom}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Audience</h1>
      <p>What the audience sees on the Jumbotron</p>
      <Link to="/jumbotron" className="px-4 py-2">
        Back to main
      </Link>
      {roomId ? (
        <JumboTron roomId={roomId} />
      ) : (
        <>
          <div className="text-lg m-2">Please enter a room ID to join:{" "}
            <input
              className="border rounded px-2 py-1"
              onChange={(e) => {
                setGoToRoom(e.target.value);
              }}
              type="text"
              placeholder="example: 1RO4Z6"
            />
          </div>
          <div className="m-2">
            <button disabled={goToRoom.length === 0} onClick={handleGoToRoom}>Go to room</button>
          </div>
        </>
      )}
    </div>
  );
};

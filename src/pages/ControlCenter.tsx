import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Link } from "react-router-dom";
import { JumboTron } from "../components/JumboTron";
import { Counter } from "../components/Counter";
import { VideoStreams } from "../components/VideoStreams";
import { validateScore, validateTimeouts, validateQuarter, validateYards } from "../helpers/validations";
import { GameStatsType } from "../helpers/types";
import { getEndpoint } from "../helpers/endpoints";

export const ControlCenter = () => {
  const INITIAL_GAME_TIME = "15:00"; // 15 minutes in MM:SS format
  const networkDebounceRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const newSocketRef = useRef<Socket | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeouts1, setTimeouts1] = useState(3);
  const [timeouts2, setTimeouts2] = useState(3);
  const [down, setDown] = useState(1);
  const [yardsToGo, setYardsToGo] = useState(10);
  const [quarter, setQuarter] = useState(1);
  const [ballOn, setBallOn] = useState(50);
  const [possession, setPossession] = useState("home"); // or "away"
  const [gameTime, setGameTime] = useState(INITIAL_GAME_TIME);

  const togglePossession = () => {
    setPossession((prev) => (prev === "home" ? "away" : "home"));
  };

  const startGameTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setGameTime((prevTime) => {
          const [minutes, seconds] = prevTime.split(":").map(Number);
          if (minutes === 0 && seconds === 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return "00:00";
          }
          const totalSeconds = minutes * 60 + seconds - 1;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;
          return `${String(newMinutes).padStart(2, "0")}:${String(
            newSeconds
          ).padStart(2, "0")}`;
        });
      }, 1000);
    }
  };

  const pauseGameTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetGameTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameTime(INITIAL_GAME_TIME);
  };

  useEffect(() => {
    // Debounce the network state update to avoid too many calls
    const timeoutId = setTimeout(() => {
      if (newSocketRef.current) {
        newSocketRef.current.emit("updateGameStats", {
          score1,
          score2,
          timeouts1,
          timeouts2,
          down,
          yardsToGo,
          quarter,
          ballOn,
          possession,
          gameTime,
        } as GameStatsType);
      }
    }, 1000); // 1 second debounce

    clearTimeout(networkDebounceRef.current);
    networkDebounceRef.current = timeoutId;
  }, [
    score1,
    score2,
    timeouts1,
    timeouts2,
    down,
    yardsToGo,
    quarter,
    ballOn,
    possession,
  ]);

  useEffect(() => {
    // Update the game time on the server when it changes
    if (newSocketRef.current) {
      newSocketRef.current.emit("updateGameTime", gameTime);
    }
  }, [gameTime]);

  useEffect(() => {
    newSocketRef.current = io(getEndpoint());

    newSocketRef.current.on("roomCreated", (roomId: string) => {
      setRoomId(roomId);
    });

    newSocketRef.current.emit("createRoom");

    return () => {
      if (newSocketRef.current) newSocketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Football Game Control Center</h1>
      <Link to="/jumbotron" className="px-4 py-2">
        Back to main
      </Link>
      <h2 className="m-2">{`${
        roomId ? `Room: ${roomId} (send to audience to view jumbotron live)` : "creating room..."
      }`}</h2>

      <div className="mb-8 flex justify-evenly items-center mt-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Preview of what the jumbotron looks like to viewers
          </h2>
          <JumboTron roomId={roomId} />
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="flex justify-around items-center mb-4 w-full">
            <div id="game-time" className="flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">Game Time</h2>
              <div className="text-6xl font-bold mb-4">{gameTime}</div>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded focus:outline-none"
                  onClick={startGameTimer}
                >
                  Start
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded focus:outline-none"
                  onClick={pauseGameTimer}
                >
                  Pause
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded focus:outline-none"
                  onClick={resetGameTimer}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              <h2 className="text-xl font-semibold mb-2">Possesion</h2>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" onChange={togglePossession} />
                  <span className="m-3">
                    Home
                  </span>
                  <div className="relative w-21 h-11 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-10 after:w-10 after:transition-all dark:border-gray-600 peer-checked:bg-gray-500"></div>
                  <span className="m-3">
                    Away
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="m-4">
              <div>Quarter:</div>
              <Counter
                value={quarter}
                setValue={(value: number) => setQuarter(validateQuarter(value))}
              />
            </div>
            <div className="m-4">
              <div>Ball On:</div>
              <Counter
                value={ballOn}
                setValue={(value: number) => setBallOn(validateYards(value))}
                extraIncrementAmount={5}
                extraIncrementCount={true}
              />
            </div>
            <div className="m-4">
              <div>Down:</div>
              <Counter
                value={down}
                setValue={(value: number) => setDown(validateQuarter(value))}
              />
            </div>
            <div className="m-4">
              <div>Yards To Go:</div>
              <Counter
                value={yardsToGo}
                setValue={(value: number) => setYardsToGo(validateYards(value))}
                extraIncrementAmount={5}
                extraIncrementCount={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-evenly items-center mt-4">
        <VideoStreams />
        {/* Home Team Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Home Team</h2>
          <div className="p-4">
            <p>
              Team Name: <strong>Home Team</strong>
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center justify-between ml-2 mr-8">
                <div>Score</div>
                <Counter
                  value={score1}
                  setValue={(value: number) => setScore1(validateScore(value))}
                  extraIncrementCount={true}
                  extraIncrementAmount={3}
                />
              </div>
              <div className="flex flex-col items-center justify-between ml-8 mr-2">
                <div>T.O</div>
                <Counter
                  value={timeouts1}
                  setValue={(value: number) =>
                    setTimeouts1(validateTimeouts(value))
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* Away Team Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Away Team</h2>
          <div className="p-4">
            <p>
              Team Name: <strong>Away Team</strong>
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center justify-between ml-2 mr-8">
                <div>Score</div>
                <Counter
                  value={score2}
                  setValue={(value: number) => setScore2(validateScore(value))}
                  extraIncrementCount={true}
                  extraIncrementAmount={3}
                />
              </div>
              <div className="flex flex-col items-center justify-between ml-8 mr-2">
                <div>T.O</div>
                <Counter
                  value={timeouts2}
                  setValue={(value: number) =>
                    setTimeouts2(validateTimeouts(value))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

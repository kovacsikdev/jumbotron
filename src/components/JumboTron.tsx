import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getEndpoint } from "../helpers/endpoints";

type JumboTronProps = {
  roomId: string;
};

export const JumboTron = (props: JumboTronProps) => {
  const videoRef = useRef<any>("");
  const INITIAL_GAME_TIME = "15:00"; // 15 minutes in MM:SS format
  const { roomId } = props;
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeouts1, setTimeouts1] = useState(3);
  const [timeouts2, setTimeouts2] = useState(3);
  const [down, setDown] = useState(1);
  const [toGo, setToGo] = useState(10);
  const [quarter, setQuarter] = useState(1);
  const [ballOn, setBallOn] = useState(50);
  const [possession, setPossession] = useState("home"); // or "away"
  const [gameTime, setGameTime] = useState(INITIAL_GAME_TIME);

  useEffect(() => {
    console.log("JumboTron mounted with roomId:", roomId);
    if (!roomId) return;

    const endpoint = getEndpoint();
    const newSocket = io(endpoint);

    newSocket.emit("joinRoom", { roomCode: roomId });

    newSocket.on("gameStatsUpdated", (data) => {
      console.log("Received game stats:", data);
      setScore1(data.score1);
      setScore2(data.score2);
      setTimeouts1(data.timeouts1);
      setTimeouts2(data.timeouts2);
      setDown(data.down);
      setToGo(data.yardsToGo);
      setQuarter(data.quarter);
      setPossession(data.possession);
      setBallOn(data.ballOn);
    });

    newSocket.on("videoIdUpdated", (data) => {
      if (data.videoId) {
        const { videoId, videoStartTime } = data;
        videoRef.current.src = `${endpoint}/videoPlayer?videoId=${videoId}`;
        videoRef.current.currentTime = videoStartTime;
      } else {
        videoRef.current.src = `passive.mp4`;
      }
      videoRef.current.load();
    });

    newSocket.on("gameTimeUpdated", (time) => {
      setGameTime(time);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="relative">
      <div className="border rounded-lg p-2 w-[864px] h-120">
        <video
          ref={videoRef}
          controls={false}
          className="w-full"
          autoPlay
          playsInline
          loop
          muted
        >
          <source src={"passive.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute bottom-[10px] w-[844px] flex flex-wrap justify-between items-center p-4 bg-gray-800 h-[120px] rounded-b-lg">
          <div className="relative flex items-center justify-center h-16">
            <div>Home</div>
            {possession === "home" && (
              <div className="absolute bottom-0">^</div>
            )}
          </div>
          <div className="border rounded-lg flex items-center justify-center">
            <div className="p-2 text-3xl">{score1}</div>
            <div className="p-2 flex flex-col">
              <div>{timeouts1}</div>
              <div className="text-sm">T.O.</div>
            </div>
          </div>
          <div className="border rounded-lg flex items-center justify-center">
            <div className="p-2 flex flex-col">
              <div>{down}</div>
              <div className="text-sm">Down</div>
            </div>
            <div className="p-2 flex flex-col">
              <div>{toGo}</div>
              <div className="text-sm">To Go</div>
            </div>
          </div>
          <div className="p-2 text-5xl border rounded-lg">{gameTime}</div>
          <div className="border rounded-lg flex items-center justify-center">
            <div className="p-2 flex flex-col">
              <div>{quarter}</div>
              <div className="text-sm">QTR</div>
            </div>
            <div className="p-2 flex flex-col">
              <div>{ballOn}</div>
              <div>Ball On</div>
            </div>
          </div>
          <div className="border rounded-lg flex items-center justify-center">
            <div className="p-2 flex flex-col">
              <div>{timeouts2}</div>
              <div className="text-sm">T.O.</div>
            </div>
            <div className="p-2 text-3xl">{score2}</div>
          </div>
          <div className="relative flex items-center justify-center h-16">
            <div>Away</div>
            {possession === "away" && (
              <div className="absolute bottom-0">^</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

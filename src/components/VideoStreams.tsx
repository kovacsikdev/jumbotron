import { useState } from "react";
import { getEndpoint } from "../helpers/endpoints";

type VideoStreamsProps = {
  updateVideoId: (videoId: string, videoStartTime: number) => void;
};

export const VideoStreams = (props: VideoStreamsProps) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { updateVideoId } = props;
  const videoEndpoint = getEndpoint();

  const handleVideoClickedEvent = (e: any, id: string) => {
    console.log(e.target.currentTime);
    updateVideoId(id, e.target.currentTime);
    setSelectedVideoId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-[864px]">
      <p className="text-lg mb-2">Update jumbotron video stream:</p>
      <div className="flex flex-col space-x-4">
        <div className="border rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-around h-full">
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "game1" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Camera 1</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "game1")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=game1&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "game2" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Camera 2</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "game2")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=game2&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "game3" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Camera 3</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "game3")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=game3&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "game4" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Camera 4</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "game4")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=game4&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "referee" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Referee</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "referee")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=referee&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              className={`relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out ${
                selectedVideoId === "crowd" ? "border-4 border-blue-500 rounded-lg" : ""
              }`}
            >
              <p>Crowd</p>
              <video
                onClick={(e) => handleVideoClickedEvent(e, "crowd")}
                controls={false}
                className="w-full h-full hover:outline hover:outline-blue-500"
                autoPlay
                playsInline
                loop
                muted
              >
                <source
                  src={`${videoEndpoint}/videoPlayer?videoId=crowd&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

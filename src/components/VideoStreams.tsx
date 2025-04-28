import { useRef } from "react";
import { getEndpoint } from "../helpers/endpoints";

type VideoStreamsProps = {
  updateVideoId: (videoId: string) => void;
};

export const VideoStreams = (props: VideoStreamsProps) => {
  const { updateVideoId } = props;
  const videoEndpointRef = useRef<any>(getEndpoint());

  const handleVideoClickedEvent = (e: any, id:string) => {
    console.log(e.target.currentTime);
    updateVideoId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-lg mb-2">Update jumbotron video stream:</p>
      <div className="flex flex-col space-x-4">
        <div className="border rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-around h-full">
            <div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=game1&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=game2&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=game3&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=game4&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div><div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=referee&videoPlaybackTime=0`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div><div className="relative w-[30%] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
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
                  src={`${videoEndpointRef.current}/videoPlayer?videoId=crowd&videoPlaybackTime=0`}
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

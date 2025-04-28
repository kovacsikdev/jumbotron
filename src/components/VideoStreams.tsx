export const VideoStreams = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Video Streams</h1>
      <p className="text-lg mb-2">Update jubmotron video stream:</p>
      <div className="flex space-x-4">
        <div className="border rounded-lg p-4 w-64 h-64">
          <p>Static</p>
          <div className="flex flex-col items-center justify-center h-full">
            Coming soon...
          </div>
        </div>
        <div className="border rounded-lg p-4 w-64 h-64">
          <p>Live</p>
          <div className="flex flex-col items-center justify-center h-full">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

import express from "express";
import http from "http";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from 'body-parser';
import { Server } from "socket.io";
import { RoomType, GameStatsType } from "./types";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store chat rooms and their messages
const chatRooms: Record<string, RoomType> = {};

const videoIdMapping: Record<string, string> = {
  "game1": "./src/assets/game1.mp4",
  "game2": "./src/assets/game2.mp4",
  "game3": "./src/assets/game3.mp4",
  "game4": "./src/assets/game4.mp4",
  "referee": "./src/assets/referee.mp4",
  "crowd": "./src/assets/crowd.mp4",
}

// Generate a random 6-character room code
function generateRoomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result as string;
}

app.get('/videoplayer', (req, res) => {
  const query = req.query;
  const videoId = query.videoId as string;
  const videoPlaybackTime = query.videoPlaybackTime as string;

  if (!videoId) {
    res.status(400).json({ error: "videoId is required" });
    return;
  }
  if (!videoPlaybackTime) {
    res.status(400).json({ error: "videoPlaybackTime is required" });
    return;
  }

  const range = req.headers.range
  const videoPath = videoIdMapping[videoId];
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 1 * 1e6; // 1MB chunks
  const start = Number(range?.replace(/\D/g, ""))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }
  res.writeHead(206, headers)
  const stream = fs.createReadStream(videoPath, {
    start,
    end
  })
  stream.pipe(res)
});

io.on("connection", (socket) => {
  let currentRoom: string = "";

  // Create a new chat room
  socket.on("createRoom", () => {
    const roomCode = generateRoomCode();

    // Create new room with empty messages array
    chatRooms[roomCode] = {
      roomCode,
      host: socket.id,
      data: {} as GameStatsType,
    };

    // Join the socket to the room
    socket.join(roomCode);
    currentRoom = roomCode;

    // Send room info back to the creator
    io.to(socket.id).emit("roomCreated", roomCode);

    console.log(`Room created: ${roomCode} at ${new Date().toISOString()}`);
  });

  socket.on("updateVideoStream", (videoId: string) => {
    // Send updated videoId to all users in the room
    if (currentRoom && chatRooms[currentRoom]) {
      // Update the room data with the new videoId
      chatRooms[currentRoom].data.videoId = videoId;
    }
    io.to(currentRoom).emit("videoIdUpdated", videoId);
  });

  socket.on("updateGameStats", (data: GameStatsType) => {
    if (currentRoom && chatRooms[currentRoom]) {
      // Update the room data with the new game stats
      chatRooms[currentRoom].data = data;

      // Notify all users in the room about the updated stats
      io.to(currentRoom).emit("gameStatsUpdated", data);

      console.log(
        `Game stats updated for room: ${currentRoom} at ${new Date().toISOString()}`
      );
    }
  });

  socket.on("updateGameTime", (time: string) => {
    if (currentRoom && chatRooms[currentRoom]) {
      // Update the game time in the room data
      chatRooms[currentRoom].data.gameTime = time;

      // Notify all users in the room about the updated game time
      io.to(currentRoom).emit("gameTimeUpdated", time);
    }
  });

  // Join an existing chat room
  socket.on("joinRoom", ({ roomCode }) => {
    // Check if room exists
    if (!chatRooms[roomCode]) {
      io.to(socket.id).emit("error", { message: "Room not found" });
      return;
    }

    // Join the socket to the room
    socket.join(roomCode);
    currentRoom = roomCode;

    // Notify all users in the room about the updated stats
    io.to(currentRoom).emit("gameStatsUpdated", chatRooms[roomCode].data);
    
    // Notify all users in the room about latest videoId
    io.to(currentRoom).emit("videoIdUpdated", chatRooms[roomCode].data.videoId);

    console.log(`User joined room: ${roomCode} at ${new Date().toISOString()}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // If user was in a room, handle leaving
    if (currentRoom && chatRooms[currentRoom]) {
      const room = chatRooms[currentRoom];

      // Check if user was the host
      if (room.host === socket.id) {
        // Notify all users that the host has left and they're being kicked
        io.to(currentRoom).emit("hostLeft", {
          message:
            "The host has left the room. Everyone is being disconnected.",
        });

        // Remove the room
        delete chatRooms[currentRoom];

        console.log(
          `Host left room: ${currentRoom}, room deleted at ${new Date().toISOString()}`
        );
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} at ${new Date().toISOString()}`);
});

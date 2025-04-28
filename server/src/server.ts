import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { RoomType, GameStatsType } from "./types";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Store chat rooms and their messages
const chatRooms: Record<string, RoomType> = {};

// Generate a random 6-character room code
function generateRoomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result as string;
}

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

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
const dotenv = require("dotenv");
const port = process.env.PORT || 4000;
const cors = require("cors");
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

// Lobby management
const rooms = {
  easy: {},
  medium: {},
  hard: {},
};

const maxPlayersPerRoom = 4;

setInterval(() => {
  for (let difficulty in rooms) {
    for (let room in rooms[difficulty]) {
      if (
        !rooms[difficulty][room].gameInProgress &&
        rooms[difficulty][room].players.length >= 2 &&
        rooms[difficulty][room].players.every((player) => player.ready)
      ) {
        rooms[difficulty][room].gameInProgress = true;
        io.to(room).emit("startGame");
      }

      if (
        rooms[difficulty][room].gameInProgress &&
        rooms[difficulty][room].players.length < 2
      ) {
        rooms[difficulty][room].gameInProgress = false;
        io.to(room).emit("stopGame");
      }
    }
  }
}, 1000);

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);

  socket.on("joinRoom", ({ name, room, difficulty }) => {
    console.log(difficulty);
    socket.join(room);
    if (!rooms[difficulty][room]) {
      rooms[difficulty][room] = {
        players: [],
        gameInProgress: false,
      };
    }

    if (rooms[difficulty][room].players.length >= maxPlayersPerRoom) {
      socket.emit("roomFull");
      return;
    }
    if (!rooms[difficulty][room].gameInProgress) {
      rooms[difficulty][room].players.forEach((player) => (player.ready = false));
  }
  

    rooms[difficulty][room].players.push({
      id: socket.id,
      name,
      ready: false,
      typingSpeed: 0,
      accuracy: 0,
      progress: 0,
    });

    io.to(room).emit("updatePlayers", rooms[difficulty][room].players);
  });

  socket.on("readyToStart", ({ name, room, difficulty }) => {
    let player = rooms[difficulty][room].players.find(
      (p) => p.id === socket.id
    );
    if (player) {
      player.ready = true;
    }

    // Check if all players are ready
    let allPlayersReady = rooms[difficulty][room].players.every((p) => p.ready);

    if (
      allPlayersReady &&
      rooms[difficulty][room].players.length >= 2 &&
      !rooms[difficulty][room].gameInProgress
    ) {
      rooms[difficulty][room].gameInProgress = true;
      io.to(room).emit("startGame");
    }
  });

  socket.on(
    "progressUpdate",
    ({ progress, room, difficulty, typingSpeed, accuracy, name }) => {
      let player = rooms[difficulty][room].players.find(
        (p) => p.id === socket.id
      );
      if (player) {
        player.typingSpeed = typingSpeed;
        player.accuracy = accuracy;
        player.progress = progress;
        player.name=name
        // player.lastUpdated = new Date();
        // io.to(room).emit("updatePlayers", rooms[difficulty][room].players);
        socket.emit('progressUpdate', { name, typingSpeed, accuracy, progress });
        io.to(room).emit(
          "updatePlayers",
          rooms[difficulty][room].players.map((player) => ({
            id: player.id,
            name: player.name,
            typingSpeed: player.typingSpeed,
            accuracy: player.accuracy,
            progress: player.progress,
          }))
        );

        // Check if the player has won the game
        if (progress >= 100) {
          // Send a game over event to all players in the room
          io.to(room).emit("gameOver", { winner: player.name });
          rooms[difficulty][room].gameInProgress = false;
          rooms[difficulty][room].players = [];
        }
      }
    }
  );

  socket.on("disconnect", () => {
    for (let difficulty in rooms) {
      for (let room in rooms[difficulty]) {
        let playerIndex = rooms[difficulty][room].players.findIndex(
          (p) => p.id === socket.id
        );
        if (playerIndex !== -1) {
          rooms[difficulty][room].players.splice(playerIndex, 1);
          io.to(room).emit("updatePlayers", rooms[difficulty][room].players);

          if (rooms[difficulty][room].players.length < 2) {
            // Stop the game if there are less than 2 players
            rooms[difficulty][room].gameInProgress = false;
            io.to(room).emit("stopGame");
          }
          break;
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

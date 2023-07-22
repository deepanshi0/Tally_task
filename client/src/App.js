import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import Home from "./pages/home";
import Game from "./pages/game";
import Multiplayer from "./components/multiplayer";

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [name, setName] = useState("false");
  const [mode, setMode] = useState("solo");
  const [time, setTime] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              name={name}
              setName={setName}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              mode={mode}
              setMode={setMode}
              time={time}
              setTime={setTime}
              setRoom={setRoom}
              socket={socket}
              />
            }
            />
        <Route
          path="/game"
          element={
            <Game
            socket={socket}
            name={name}
            selectedDifficulty={selectedDifficulty}
            mode={mode}
            time={time}
            room={room}
            players={players}
            setPlayers={setPlayers}
            />
          }
        />
        <Route
          path="/multiplayer"
          element={
            <Multiplayer
              socket={socket}
              name={name}
              selectedDifficulty={selectedDifficulty}
              players={players}
              setPlayers={setPlayers}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import Solo from "../components/solo";
import Multiplayer from "../components/multiplayer";
import Room from "../components/room";

function Game({
  name,
  selectedDifficulty,
  mode,
  time,
  room,
  socket,
  players,
  setPlayers,
}) {
  return (
    <div className="mainpage fade-in" style={{ position: "relative" }}>
      {mode === "solo" && (
        <Solo
          name={name}
          selectedDifficulty={selectedDifficulty}
          mode={mode}
          time={time}
        />
      )}
      {mode === "multiplayer" && (
        <Room
          socket={socket}
          name={name}
          selectedDifficulty={selectedDifficulty}
          room={room}
          players={players}
          setPlayers={setPlayers}
        />
      )}
    </div>
  );
}

export default Game;

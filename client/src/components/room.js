import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Room({ name, room, selectedDifficulty, socket, players, setPlayers }) {
  const [response, setResponse] = useState("");
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });

    socket.on("startGame", () => {
      navigate("/multiplayer");
    });

    return () => socket.disconnect();
    // eslint-disable-next-line
  }, [name, room, selectedDifficulty]);

  const handleReady = () => {
    setIsReady(true);
    socket.emit("readyToStart", { name, room, difficulty: selectedDifficulty });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height:'100%',
        color:'white',
        backgroundColor:'black'
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        //   justifyContent: "center",
        //   width: "30%",
          height: "90%",
          border: "2px solid white",
          borderRadius:'10px',
          backgroundColor:'#35292994',
          padding:'10px'
        }}
      >
        <h1>Room</h1>
        <div style={{fontSize:'25px', display:'flex',flexDirection:'column', alignItems:'center'}}>

        <p>Let other players Join. You can begin when at least 2 people are in room. Game starts when everyone is ready.</p>
        {players.map((player) => (
            <div key={player.id} style={{fontWeight:'900', fontSize:'35px'}}>
            <p>
              {player.name} 
            </p>
          </div>
        ))}
        <button className="btn2" onClick={handleReady} disabled={isReady} style={{marginTop:'-10px'}}>
          {isReady ? "Waiting for other players..." : "Ready"}
        </button>
        </div>
      </div>
    </div>
  );
}

export default Room;

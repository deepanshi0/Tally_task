import React from "react";
import { useState, useEffect } from "react";
import Welcome from "../components/welcome";
import Details from "../components/details";

function Home({
  name,
  setName,
  selectedDifficulty,
  setSelectedDifficulty,
  mode,
  setMode,
  time,
  setTime,
  setRoom,
  socket
}) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [fadeOutWelcome, setFadeOutWelcome] = useState(false);
  useEffect(() => {
    if (fadeOutWelcome) {
      setTimeout(() => {
        setShowWelcome(false);
        setShowDetails(true);
      }, 800);
    }
  }, [fadeOutWelcome]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {showWelcome && (
        <Welcome
          name={name}
          setName={setName}
          setShowWelcome={setShowWelcome}
          shouldFadeOut={fadeOutWelcome}
          setFadeOutWelcome={setFadeOutWelcome}
        />
      )}
      {showDetails && (
        <Details
          shouldFadeIn={showDetails}
          name={name}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          mode={mode}
          setMode={setMode}
          time={time}
          setTime={setTime}
          setRoom={setRoom}
          socket={socket}
        />
      )}
    </div>
  );
}

export default Home;

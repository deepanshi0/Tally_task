import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Details({
  name,
  selectedDifficulty,
  setSelectedDifficulty,
  mode,
  setMode,
  time,
  setTime,
  setRoom,
  socket
}) {
  const navigate = useNavigate();

  const difficulty = ["easy", "medium", "hard"];
  useEffect(() => {
    // When the mode changes to "multiplayer", set the time to 0
    if (mode === "multiplayer") {
      setTime(0);
    }
  }, [mode]);
  const handleDifficultySelect = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleEnter = (e) => {
    e.preventDefault();
    //backend call
    // console.log(time)
    // navigate("/game");
    // const randomNum = 1 + Math.floor(Math.random() * (100 - 1 + 1));

    if (mode === "multiplayer") {
      const room = `room-${selectedDifficulty}`; // Use the difficulty in the room name
      setRoom(room)
      socket.emit("joinRoom", { name, room, difficulty: selectedDifficulty });
      socket.on("roomFull", () => {
        // Handle the case where the room is full
        alert("The room is already full. Please try again later.");
        return; // Add a return statement to exit the function
      });
      navigate("/game");
    } else {
      if (time === 0) {
        alert("Time must be greater than 0!");
        return;
      } else {
        // Handle solo mode logic and navigate to the game page
        navigate("/game");
      }
    }
  };
  return (
    <div
      className="details fade-in "
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        className="card"
        style={{
          width: "60%",
          color: "white",
          border: "2px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: "2px solid green",
            borderTop: "none",
            marginTop: "-15px",
            padding: "5px 10px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h1>
            Welcome <span style={{ color: "#ff713d" }}> {name}</span>
          </h1>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            textAlign: "left",
          }}
        >
          <label className="label2" htmlFor="difficulty">
            Choose difficulty
          </label>
          <div
            style={{
              display: "flex",
              width: "80%",
              justifyContent: "center",
            }}
          >
            <select
              className="input"
              id="difficulty"
              style={{ width: "90%", textAlign: "center" }}
              value={selectedDifficulty}
              onChange={handleDifficultySelect}
            >
              {difficulty.map((item, index) => {
                return <option key={index}>{item}</option>;
              })}
            </select>
          </div>
          <div
            className="modes"
            style={{
              width: "75%",
              textAlign: "center",
              // border: "2px solid blue",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label className="label2" htmlFor="mode">
              Choose a Mode
            </label>
            <div
              style={{
                display: "flex",
                width: "100%",
                // border: "2px solid yellow",
                alignItems: "center",
                justifyContent: "center",
                margin: "15px",
              }}
            >
              <div
                className="modess mode1"
                style={{
                  border: mode === "solo" ? "2px solid red" : "2px solid white",
                }}
                onClick={(e) => {
                  setMode("solo");
                }}
              >
                <span
                  style={{ zIndex: "5", fontWeight: "800", fontSize: "35px" }}
                >
                  Solo
                </span>
              </div>
              <div
                className="modess mode2"
                style={{
                  border:
                    mode === "multiplayer"
                      ? "2px solid red"
                      : "2px solid white",
                }}
                onClick={(e) => {
                  setMode("multiplayer");
                }}
              >
                <span
                  style={{ zIndex: "5", fontWeight: "800", fontSize: "35px" }}
                >
                  Multiplayer
                </span>
              </div>
            </div>
          </div>
          <label className="label2" htmlFor="time">
            Enter the time duration in seconds (for solo mode only)
          </label>
          <input
            className="input"
            type="number"
            name="time"
            id="time"
            disabled={mode !== "solo"}
            value={time}
            style={{ width: "70%" }}
            onChange={(e) => {
              const valueWithoutLeadingZeros = e.target.value.replace(
                /^0+/,
                ""
              );
              if (
                valueWithoutLeadingZeros !== "" &&
                valueWithoutLeadingZeros >= 0
              ) {
                setTime(parseInt(valueWithoutLeadingZeros, 10));
              } else {
                setTime(0);
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.key >= "0" && e.key <= "9") ||
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
              ) {
                return;
              } else {
                e.preventDefault();
              }
            }}
          />
          <button
            style={{
              padding: "10px 5px",
              width: "100px",
              fontWeight: "500",
              marginTop: "15px",
              border: "none",
              backgroundColor: "#ff713d",
            }}
            className="btn"
            onClick={handleEnter}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Details;

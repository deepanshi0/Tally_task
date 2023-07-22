import React, { useState, useEffect } from "react";
import sentences from "./sentences";
import { useNavigate } from "react-router-dom";
import sliderImage from "./icon1.png";
import congratulationsGIF from "./hurrah.gif"; 
import failGIF from "./oopas1.gif"; 
function Solo({ name, selectedDifficulty, mode, time }) {
  const [currentSentence, setCurrentSentence] = useState("");
  const [timer, setTimer] = useState(time);
  const [intervalId, setIntervalId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [firstIncorrectIndex, setFirstIncorrectIndex] = useState(null);
  const navigate = useNavigate();
  const handleStartTimer = () => {
    clearInterval(intervalId);

    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setIntervalId(newIntervalId);
  };
  useEffect(() => {
    // Check for time-out and show the card if time has run out and user hasn't completed the sentence
    if (timer <= 0 && !completed && started) {
      clearInterval(intervalId);
          setStarted(false);
          setIsButtonDisabled(false);
      setShowModal(true);
    }
  }, [timer, completed, started]);
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const getRandomSentence = () => {
    const randomIndex = Math.floor(
      Math.random() * sentences[selectedDifficulty].length
    );
    return sentences[selectedDifficulty][randomIndex];
  };

  const startGame = () => {
    setIsButtonDisabled(true);
    handleStartTimer();
    setStarted(true);
  };
  const handleInputChange = (e) => {
    const typedText = e.target.value;
    setUserInput(typedText);

    let newFirstIncorrectIndex = null;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== currentSentence[i]) {
          newFirstIncorrectIndex = i;
          break;
        }
      }
      setFirstIncorrectIndex(newFirstIncorrectIndex);
      
      if (newFirstIncorrectIndex === null) {
        setMessage("Correct!");
        if (typedText === currentSentence) {
          clearInterval(intervalId);
          setCompleted(true);
          setFinalResult(timer);
          setShowModal(true);
        }
      } else {
        setMessage("Incorrect");

      }
      const correctChars = currentSentence.slice(0, userInput.length);
      const numCorrectChars = correctChars.split("").filter((char, index) => char === userInput[index]).length;
      const currentAccuracy = (numCorrectChars / currentSentence.length) * 100;
      setAccuracy(currentAccuracy);
      setProgress(currentAccuracy);
      const timeTaken = time - timer;
      const speed = (userInput.length / 5) / (timeTaken / 60);
      setTypingSpeed(speed);
  };

  const resetGame = () => {
    setCurrentSentence(getRandomSentence());
    setUserInput("");
    setCompleted(false);
    setStarted(false);
    setIsButtonDisabled(false);
    setTimer(time);
    setFinalResult("");
    setTypingSpeed(0);
    setProgress(0);
    setAccuracy(100);
  };

  useEffect(() => {
    setUserInput("");
    setMessage("");
    setCompleted(false);
    setCurrentSentence(getRandomSentence(selectedDifficulty));
    // eslint-disable-next-line
  }, [selectedDifficulty]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (userInput === currentSentence) {
        setMessage("Correct!");
        setCompleted(true);
      } else {
        setMessage("Incorrect. Try again.");
      }
    }
  };
  const sliderContainerStyle = {
    width: "40%",
    height: "15px",
    backgroundColor: "#f5ceb6",
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const sliderProgressStyle = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: "#4caf50",
    position: "absolute",
    top: "0",
    left: "0",
    borderRadius: "10px",
    transition: "width 0.2s ease-in-out",
  };

  const sliderImageStyle = {
    position: "absolute",
    top: "50%",
    left: `${progress}%`,
    transform: "translate(-50%, -50%)",
    height: "20px",
    width: "20px",
    backgroundImage: `url(${sliderImage})`,
    backgroundSize: "cover",
    borderRadius: "50%",
    transition: "left 0.2s ease-in-out",
  };

  const cardStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px", // Increase padding to add more space inside the card
    borderRadius: "8px",
    width: "800px", // Set the desired width of the card
    height: "400px",
    backgroundImage: completed?`url(${congratulationsGIF})`:`url(${failGIF})`, // Set the GIF as background image
    backgroundSize: "cover",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  };
  const overlayStyles = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black color for the overlay
    backdropFilter: showModal ? "blur(5px)" : "none", // Apply blur effect when showModal is true
    zIndex: showModal ? "1" : "-1", // Bring the overlay to front when showModal is true
    pointerEvents: showModal ? "auto" : "none", // Enable pointer events on the overlay when showModal is true
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <div
    className="solo fade-in "
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="nav">
        <div style={{ fontSize: "50px", position: "absolute", left: "80px",top:"15px",fontFamily:"Ubuntu",
            color:"#61d965",fontWeight: "800",}}>
          {mode}
        </div>
        <div
          style={{
            fontWeight: "800",
            fontSize: "50px",
            position: "absolute",
            right: "100px",
            top:"15px",
            fontFamily:"Ubuntu",
            color:"#61d965"
          }}
        >
          {name}
        </div>
      </div>
      <div className="nav" style={{ marginTop: "90px" }}>
        <div style={{ fontSize: "33px", position: "absolute",fontWeight: "100", fontFamily:"Audiowide",left: "80px" }}>
          Accuracy : {accuracy.toFixed(2)}%
        </div>
        <div style={{ fontSize: "33px", fontWeight: "300",position: "absolute" ,fontFamily:"Audiowide"}}>
        Typing Speed: {typingSpeed.toFixed(2)} WPM
        </div>
        <div style={{ fontSize: "33px", position: "absolute",fontWeight: "100", right: "100px",fontFamily:"Audiowide" }}>
          {formatTime(timer)}
        </div>
      </div>
     
      
      <div className="gamebody">
        <div
          style={{
            // border: "1px solid black",
            padding: "10px",
            marginBottom: "30px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>
            {currentSentence.split("").map((char, index) => {
             let color;
             if (index < userInput.length) {
               if (index < firstIncorrectIndex || firstIncorrectIndex === null) {
                 color = "rgb(138 205 159)"; // Correct letters are colored green
               } else {
                 color = "red"; // Incorrect letters are colored red
               }
             } else {
               color = "white";// Untried letters remain white
             }
              return (
                <span
                  key={index}
                  style={{ color: color, fontFamily: "Ubuntu",}}
                >
                  {char}
                </span>
              );
            })}
          </p>
          <input
            type="text"
            className="input"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            disabled={!started || completed}
            style={{ width: "70%" }}
          />
          {message && (
            <p style={{ color: message === "Correct!" ? "white" : "red" }}>
              {message}
            </p>
          )}
          <button
            className="btn2"
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "20px",
              width: "140px",
              backgroundColor: isButtonDisabled ? "grey" : "#4caf50",
              cursor: isButtonDisabled ? "initial" : "pointer",
            }}
            disabled={isButtonDisabled}
            onClick={() => {
 
              startGame();
            }}
          >
            Start
          </button>
        </div>
        
      </div>
      <div style={sliderContainerStyle}>
        <div style={sliderProgressStyle}></div>
        <div style={sliderImageStyle}></div>
      </div>
      {showModal && (
        <div style={overlayStyles}>
          <div style={cardStyles}>
            <h1 style={{color:"white",marginTop:"100px"}}>{completed ? "Congratulations" : "Oops, Time's Up!"}</h1>
            <button className="btn2" onClick={() => navigate("/")}>Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solo;

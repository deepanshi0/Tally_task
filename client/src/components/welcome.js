import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Welcome({name,setName, setShowWelcome, shouldFadeOut, setFadeOutWelcome}) {
    const [buttonStyle, setButtonStyle] = useState({});
    const [showCard, setShowCard] = useState(false);
    useEffect(() => {
      // Generate a unique guest name using a random number suffix
      const randomNum = Math.floor(Math.random() * 1000);
      const guestName = `Guest${randomNum}`;
      setName(guestName);
    }, [setName]);
    const handleButtonClick = () => {
        setButtonStyle({ opacity: "0", transition: "opacity 500ms" });
    
        setTimeout(() => {
          setShowCard(true);
        }, 500);
      };
    
      const cardVariants = {
        hidden: { y: "-100vh" },
        visible: { y: 0, transition: { duration: 0.6 } },
      };
      const className=`bg ${shouldFadeOut ? 'fade-out' : 'fade-in'}`;
  return (
    <div
      className={className}
      style={{
        backgroundColor: "transparent",
        color: "white",
        height: "100%",
        width: "100%",
        display: "flex",
        overflowY: "hidden",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "80%",
            fontSize: "105px",
            alignItems: "center",
            fontWeight: "900",
            margin: "5px",
            marginLeft: "120px",
            padding: "5px 0 5px 20px",
          }}
        >
          <div
            style={{
              width: "60%",
              fontFamily: "Risque",
            }}
          >
            Welcome To <br></br>
            <span style={{ color: "#00ff00" }}>NFS</span> Words
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "80%",
            alignItems: "center",
            justifyContent: "center",
            margin: "5px",
            marginRight: "10px",
          }}
        >
          {!showCard && (
            <div>
              <button
                style={{
                  ...buttonStyle,
                  display: "flex",
                  alignItems: "center",
                  width: "240px",
                }}
                className="btn"
                onClick={handleButtonClick}
              >
                <span style={{ fontSize: "35px", fontFamily: "Gluten" }}>
                  Let's begin
                </span>
              </button>
            </div>
          )}
          {showCard && (
            <motion.div
              className="card"
              variants={cardVariants}
              initial="hidden"
              animate={"visible"}
            >
              <label className='label1' htmlFor="name"> Enter your name</label>
              <input
                type="text"
                name="name"
                className="input"
                id="name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />

              <button
                style={{
                  padding: "10px 5px",
                  width: "100px",
                  fontWeight: "500",
                  marginTop: "15px",
                  border: "none",
                }}
                className="btn"
                onClick={()=>{
                    setFadeOutWelcome(true);
                   
                }}
              >
                Enter
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Welcome
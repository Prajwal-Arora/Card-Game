import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
const MobileView = () => {
  const handleRedirect = () => {
    window.open(
      "https://opensea.io/collection/vempire-the-founding-soldiers",
      "_blank"
    );
  };

  return (
    <div style={{ textAlign: "center", width: "100%" }} className="mobile-text">
      <div
        className="center "
        style={{
          top: "40%",
          backgroundImage: `url("/images/mobileView.png")`,
          fontSize: "45px",
          color: "	#DAA520",
        }}
      >
        PLAY NOW ON DESKTOP BROWSER
      </div>{" "}
      <div
        className="center-lwr"
        style={{
          top: "80%",
          backgroundImage: `url("/images/mobileView.png")`,
          fontSize: "25px",
          color: "	#DAA520",
        }}
        onClick={handleRedirect}
      >
        BUYS THE NFTS ON OPENSEA
      </div>
    </div>
  );
};

export default MobileView;

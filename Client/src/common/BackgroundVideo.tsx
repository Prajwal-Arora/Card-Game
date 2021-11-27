import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const BackgroundVideo = () => {
  const path = useLocation();
  // const location = path.pathname.split("?")[1];
  const onGamePlay=path.pathname.includes("game-play")
  const [isRemus, setIsRemus] = useState<any>(false);
  const [isRomulus, setIsRomulus] = useState<any>(false);

console.log(path.pathname.includes("game-play"),"Ava")

  useEffect(() => {
    if (path.search === "?Romulus" && onGamePlay===false) {
      setIsRemus(true);
      setIsRomulus(false);
    }
    if (path.search === "?Remus" && onGamePlay===false) {
      setIsRomulus(true);
      setIsRemus(false);
    }
    if((path.search === "?Remus"|| path.search === "?Romulus") && onGamePlay===true){
      setIsRomulus(false);
      setIsRemus(false);
    }
    if (path.search !== "?Remus" && path.search !== "?Romulus" ) {
      setIsRomulus(false);
      setIsRemus(false);
    }
  }, [ path.search,onGamePlay]);

  return (
    <>

      {isRemus ? (
        <img id="video" src="/images/Romulus.jpg" alt="" />
      ) : (
        <>
          {isRomulus ? (
            <img id="video" src="/images/Remus.jpg" alt="" />
          ) : (
            <>
            {
              onGamePlay?(
                <img id="video" src="/images/GamePlay.jpg" alt="" />
              ): (
              <video autoPlay loop muted id="video">
              <source src="./video/galaxy.mp4" type="video/mp4" />
            </video>
              )}
            </>
          )}
        </>
      )}
    </>
    // <>

    // </>
  );
};

export default BackgroundVideo;

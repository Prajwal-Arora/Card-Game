import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSound from "use-sound";
import { useAppSelector, useAppDispatch } from "../store/store";

// react icons
import { IoMdMusicalNotes } from "react-icons/io"
import { AiFillSound } from "react-icons/ai"
import { setBackgroundMusic, setVolume } from "../store/reducer/soundReducer";
import { Form } from "react-bootstrap";
import "./backgroundVideo.css"

const battleMusic = require("../assets/Sounds/battles-musics.mp3");
const MenuMusic = require("../assets/Sounds/menu-musics.mp3");

// const MenuMusic1 = require("../assets/Sounds/2016-08-23_-_News_Opening_4_-_David_Fesliyan copy.mp3");
// const MenuMusic2 = require("../assets/Sounds/2016-08-23_-_News_Opening_5_-_David_Fesliyan.mp3");

const BackgroundVideo = () => {
  const { backgroundMusic , volume } = useAppSelector((state) => state.sounds);

  const [playMenuMusic, { pause: pauseMenuMusic }] = useSound(MenuMusic.default, { loop: true, volume: volume })
  const [playBattleMusic, { pause: pauseBattleMusic }] = useSound(battleMusic.default, { loop: true, volume: volume });

  const path = useLocation();
  // const location = path.pathname.split("?")[0];

  const dispatch = useAppDispatch()
  const volumeChange = (event: any) => {
    dispatch(setVolume(event.target.valueAsNumber))
  }

  const onGamePlay = path.pathname.includes("game-play");
  const onVictoryScreen= path.pathname.includes("game-winner")
  const [isRemus, setIsRemus] = useState<any>(false);
  const [isRomulus, setIsRomulus] = useState<any>(false);
  const [isRomulusVictory, setIsRomulusVictory] = useState<any>(false);
  const [isRemusVictory, setIsRemusVictory] = useState<any>(false);


  useEffect(() => {
    if (path.search === "?Romulus" && onGamePlay === false) {
      pauseMenuMusic();
      pauseBattleMusic();
      backgroundMusic ? playBattleMusic() : pauseBattleMusic()
      setIsRemus(true);
      setIsRomulus(false);
      setIsRomulusVictory(false)
      setIsRemusVictory(false)
    }
    if (path.search === "?Remus" && onGamePlay === false) {
      pauseMenuMusic();
      pauseBattleMusic()
      backgroundMusic ? playBattleMusic() : pauseBattleMusic()
      setIsRomulus(true);
      setIsRemus(false);
      setIsRomulusVictory(false)
      setIsRemusVictory(false)
    }
    if (
      (path.search === "?Remus" || path.search === "?Romulus") &&
      onGamePlay === true
    ) {
      pauseMenuMusic();
      pauseBattleMusic()
      backgroundMusic ? playBattleMusic() : pauseBattleMusic()
      setIsRomulus(false);
      setIsRemus(false); 
      setIsRomulusVictory(false)
      setIsRemusVictory(false)
    }
    if (path.search !== "?Remus" && path.search !== "?Romulus") {
      pauseBattleMusic();
      pauseMenuMusic();
      backgroundMusic ? playMenuMusic() : pauseMenuMusic();
      setIsRomulus(false);
      setIsRemus(false);
      setIsRomulusVictory(false)
      setIsRemusVictory(false)
    }
    if( path.search === "?Remus" && onVictoryScreen === true){
      setIsRomulus(false);
      setIsRemus(false);
      setIsRomulusVictory(false)
      setIsRemusVictory(true)
    }
    if( path.search === "?Romulus" && onVictoryScreen === true){
      setIsRomulus(false);
      setIsRemus(false);
      setIsRomulusVictory(true)
      setIsRemusVictory(false)
    }
  }, [path.search, onGamePlay, playMenuMusic,backgroundMusic, pauseMenuMusic, pauseBattleMusic, playBattleMusic, onVictoryScreen]);

  const playBackgroundMusic = () => {
    dispatch(setBackgroundMusic(!backgroundMusic));
    backgroundMusic ? dispatch(setVolume(0)) : dispatch(setVolume(0.5))
  }

  return (
    <>
      <div style={{ top: 0, right: 0 }} className="sounds-container d-flex position-absolute">
        <button className="music-btn" onClick={playBackgroundMusic}>
          <IoMdMusicalNotes />
          <div className={`${backgroundMusic ? "d-none" : "d-block"} close`}></div>
        </button>
        <div className="range-container align-self-stretch justify-content-end d-flex align-items-center">
          <input type="range" min="0" max="1" step="0.1" onChange={volumeChange} value={volume} className={`slider ${backgroundMusic ? "volume-range" : "d-none"}`} id="myRange" />
        </div>
      </div>
      {isRemus ? (
        <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/Romulus.png" alt="" />
      ) : (
        <>
          {isRomulus ? (
            <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/Remus.png" alt="" />
          ) : (
            <>
              {onGamePlay ? (
                <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/GamePlay.png" alt="" />
              ) : (
                <>
                  {
                    isRemusVictory? (
                      <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/Victory_Remus.png" alt="" />
                    ):(
                      <>
                        {
                           isRomulusVictory ? (
                            <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/Victory_Romulus.png" alt="" />
                          ):(
                            <img id="background-img" src="https://playassets.s3.eu-west-1.amazonaws.com/Main_Menu.png" alt="" /> 
                          )
                        }
                      </>
                    )
                  }
                </>
                
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default BackgroundVideo;

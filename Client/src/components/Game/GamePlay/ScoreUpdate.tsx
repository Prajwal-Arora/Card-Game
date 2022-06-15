import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useBattleDetail } from "../../../store/hooks";
import {
  setBattleArray,
  setEndClick,
  setScoreRound1,
  setScoreRound2,
  setScoreRound3,
} from "../../../store/reducer/userReducer";
import { useAppSelector } from "../../../store/store";
import { handleRedirect } from "../../../utils/CommonUsedFunction";
import { inactiveMessage } from "../../../utils/config/constant/notificationText";
import { handleGameVictoryScreen, handleRoundEnd } from "../../../utils/SocketCommon";

const ScoreUpdate = ({
  isDraw,
  currentSelectedCard,
  turn,
  round,
  ownerAccount,
  socket,
  account,
  p1Score,
  p2Score,
}: any) => {
  const [playerBtnColorChange1, setPlayerBtnColorChange1] = useState(false);
  const [playerBtnColorChange2, setPlayerBtnColorChange2] = useState(false);
  const endClicked: any = useAppSelector((state) => state?.userDetail.endClick);
  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [currentRound2, setCurrentRound2] = useState(false);
  const [currentRound3, setCurrentRound3] = useState(false);
  const dispatch = useDispatch();
  let history = useHistory();
  const battleArray = useBattleDetail();

  const storeRoundScores = () => {
    if (battleArray.roundP1 === 1 || battleArray.roundP2 === 1) {
      dispatch(
        setScoreRound1({
          p1: battleArray.score1,
          p2: battleArray.score2,
        })
      );
    }
    if (battleArray.roundP1 === 2 || battleArray.roundP2 === 2) {
      if (currentRound2) {
        dispatch(
          setScoreRound2({
            p1: battleArray.score1,
            p2: battleArray.score2,
          })
        );
      }

    }
    if (battleArray.roundP1 === 3 || battleArray.roundP2 === 3) {
      if (currentRound3) {
        dispatch(
          setScoreRound3({
            p1: battleArray.score1,
            p2: battleArray.score2,
          })
        );
      }
    }
  };

  useEffect(() => {
    // if(battleArray.p1Score ===0 && battleArray.p2Score===0 && !isDraw &&round.roundP1 ===round.roundP2) {
    if (socket) {
      socket.on("inactiveWinner", (obj: any) => {
        const battleObj = JSON.parse(obj);
        dispatch(setBattleArray(battleObj));
        if (battleObj.winner_g) {
          handleGameVictoryScreen(
            battleObj.winner_g,
            battleObj.player1,
            battleObj.team1,
            inactiveMessage,
            handleRedirect,
            history
          );
        }
      });
    }
    // }
  }, [battleArray.score1, battleArray.score2, isDraw, ownerAccount, socket])

  useEffect(() => {
    if (
      round.roundP1 === round.roundP2 &&
      round.roundP1 !== 1 &&
      round.roundP2 !== 1
    ) {
      dispatch(setEndClick(false));
      setPlayerBtnColorChange1(false);
      setPlayerBtnColorChange2(false);
    }
    if (round.roundP1 > round.roundP2) {
      setPlayerBtnColorChange1(true);
    }
    if (round.roundP1 < round.roundP2) {
      setPlayerBtnColorChange2(true);
    }
  }, [account, ownerAccount, round.P1, round.P2, round.roundP1, round.roundP2]);

  useEffect(() => {
    if (battleArray.roundP1 === battleArray.roundP2 && battleArray.roundP1 === 2) {
      setCurrentRound2(true)
    }
    if (battleArray.roundP1 === battleArray.roundP2 && battleArray.roundP1 === 3) {
      setCurrentRound3(true)
    }
    storeRoundScores();

  }, [battleArray.roundP1, battleArray.roundP2, battleArray.score1, battleArray.score2]);

  const handleEnd = () => {
    handleRoundEnd(currentSelectedCard, ownerAccount, account, turn, socket);
    dispatch(setEndClick(true));
  };

  useEffect(() => {
    if (ownerAccount === account) {
      if (battleArray?.cardsP1?.length === 0 && !flag1) {
        const array = [ownerAccount, battleArray.player1];
        socket.emit("endClick", JSON.stringify(array));
        dispatch(setEndClick(true));
        setFlag1(true);
      }
    } else {
      if (battleArray?.cardsP2?.length === 0 && !flag2) {
        const array = [ownerAccount, battleArray.player2];
        socket.emit("endClick", JSON.stringify(array));
        dispatch(setEndClick(true));
        setFlag2(true);
      }
    }
  }, [battleArray?.cardsP1, battleArray?.cardsP2]);

  return (
    <div className="score-sec">
      <button
        style={{ width: "50px", height: "40px" }}
        className=" mt-3 ply-scr zero-margin custom-btn-score d-flex "
      >
        <img
          style={{ right: "25px" }}
          className="position-relative"
          width="35px"
          src={`/images/${(
              account === ownerAccount
                ? playerBtnColorChange2
                : playerBtnColorChange1
            )
              ? "red-circle.png"
              : "green-circle.png"
            }`}
          alt="green-circle"
        />
        <div style={{ marginRight: "35px" }}>{p2Score}</div>
      </button>
      <button
        disabled={endClicked || battleArray.score1 === battleArray.score2}
        onClick={handleEnd}
        style={{ marginLeft: "25px" }}
        className={` ${battleArray.score1 === battleArray.score2 && "cursor-not-allowed"
          } mt-3 custom-btn d-flex `}
      >
        <div>END</div>
      </button>
      <hr className="solid" />

      {/* <div className="score"> SCORE</div> */}
      <button
        style={{ width: "50px", height: "40px" }}
        className=" mt-3 ply-scr custom-btn-score d-flex position-relative"
      >
        <img
          style={{ right: "25px" }}
          className="position-relative"
          width="35px"
          src={`/images/${(
              account === ownerAccount
                ? playerBtnColorChange1
                : playerBtnColorChange2
            )
              ? "red-circle.png"
              : "green-circle.png"
            }`}
          alt="red-circle"
        />
        <div style={{ marginRight: "35px" }}>{p1Score}</div>
      </button>
    </div>
  );
};

export default ScoreUpdate;

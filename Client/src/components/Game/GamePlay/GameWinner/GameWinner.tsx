import React, { useEffect, useState } from "react";
import "../index.css";
import { useHistory, useLocation } from "react-router-dom";
import {
  useBattleDetail,
  useSocketDetail,
  useWalletDetail,
} from "../../../../store/hooks";
import { useAppSelector } from "../../../../store/store";
import RoundModal from "../GamePlayModal/RoundModal";
import RemusWinner from "./RemusWinner";
import RomulusWinner from "./RomulusWinner";
import WinnerByInactivity from "./WinnerByInactivity";
import { apiHandler } from "../../../../services/apiService/axios";
import { addUserDetail, putLosses, putWins } from "../../../../services/apiService/userServices";
import { useDispatch } from "react-redux";
import { setScoreRound1, setScoreRound2, setScoreRound3 } from "../../../../store/reducer/userReducer";

const GameWinner = () => {
  const path = useLocation();
  const walletState: any = useWalletDetail();
  const dispatch = useDispatch();
  let history = useHistory();
  const [isRemus, setIsRemus] = useState<any>(false);
  const [winnerRound, setWinnerRound] = useState({ p1: "", p2: "" });
  const [playerName, setPlayerName] = useState("");
  let socket: any = useSocketDetail();
  const battleArray = useBattleDetail();
  const Round1Score: any = useAppSelector(
    (state) => state?.userDetail.scoreRound1
  );
  const Round2Score: any = useAppSelector(
    (state) => state?.userDetail.scoreRound2
  );
  const Round3Score: any = useAppSelector(
    (state) => state?.userDetail.scoreRound3
  );

  useEffect(() => {
    if (path.search === "?Romulus") {
      setIsRemus(true);
      setPlayerName("Romulus");
    }
    if (path.search === "?Remus") {
      setIsRemus(false);
      setPlayerName("Remus");
    }
  }, [path.search]);

  useEffect(() => {
    apiHandler(
      () =>
      addUserDetail(battleArray?.player1,battleArray?.player2,battleArray?.xVempLocked,battleArray?.winner_g)
    );
    apiHandler(
      () =>
        battleArray?.winner_g === walletState.accounts[0]
          ? putWins(walletState.accounts[0])
          : putLosses(walletState.accounts[0])
    );
  }, []);

  const handleWinner = () => {
    const array = [battleArray["player1"], walletState.accounts[0]];
    dispatch( setScoreRound1({}));
    dispatch( setScoreRound2({}));
    dispatch( setScoreRound3({}));
    socket.emit("clean", JSON.stringify(array));
    history.push("/");
  };
  useEffect(() => {
    setWinnerRound({
      p1: battleArray.winner_r1,
      p2: battleArray.winner_r2,
    });
  }, [battleArray]);

  return (
    <>
      {battleArray.score1 === 0 && battleArray.score2 === 0 ? (
        <WinnerByInactivity
          playerName={playerName}
          Round1Score={Round1Score}
          Round2Score={Round2Score}
          Round3Score={Round3Score}
        />
      ) : isRemus ? (
        <RemusWinner
          playerName={playerName}
          Round1Score={Round1Score}
          Round2Score={Round2Score}
          Round3Score={Round3Score}
        />
      ) : (
        <RomulusWinner
          playerName={playerName}
          Round1Score={Round1Score}
          Round2Score={Round2Score}
          Round3Score={Round3Score}
        />
      )}
      <button
        onClick={handleWinner}
        className=" mx-auto mt-4 custom-btn d-flex align-items-center"
      >
        <div className=" d-flex align-items-center position-relative">
          <div>Exit</div>
        </div>
      </button>
      <RoundModal
        roundModalDraw={false}
        isDraw={false}
        winnerRound={winnerRound}
        round={{ roundP1: 2, roundP2: 2 }}
        gameWinner={battleArray.winner_g}
        account={walletState.accounts[0]}
      />
    </>
  );
};

export default GameWinner;

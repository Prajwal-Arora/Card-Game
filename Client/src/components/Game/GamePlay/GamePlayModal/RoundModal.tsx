import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useBattleDetail, useWalletDetail } from "../../../../store/hooks";
import PoolTimer from "../../../common/PoolTimer";

// import { setScoreRound1, setScoreRound2, setScoreRound3 } from '../../../../store/reducer/userReducer';

interface RoundProps {
  roundModalDraw?: any;
  isDraw?: any;
  socket?: any;
  account?: any;
  round?: any;
  winnerRound?: any;
  roundShow?:any;
  setRoundShow?:any;
}

const RoundModal: React.FC<RoundProps> = ({
  roundModalDraw,
  setRoundShow,
  roundShow,
  round,
  winnerRound,
}) => {
  const battleArray = useBattleDetail();
  const walletState: any = useWalletDetail();
  const [currentRound, setCurrentRound] = useState(1);
  const [sudisPresentP1, setSudisPresentP1] = useState(false)
  const [sudisPresentP2, setSudisPresentP2] = useState(false)
  const [roundWinTeam, setRoundWinTeam] = useState("");
  // const dispatch = useDispatch();

  const handleNextRound = () => {
    setRoundShow(false);
  };

  const checkRound = () => {
    if (round.roundP1 === round.roundP2) {
      const round_val = round.roundP1;
      setCurrentRound(round_val - 1);
    }
  };


  const checkSudisTurn = () => {
    if (battleArray.sudisFlag1 === 1) {
      setSudisPresentP1(true)
    }
    if (battleArray.sudisFlag2 === 1) {
      setSudisPresentP2(true)
    }
    if (battleArray.player1 === walletState?.userName) {
      if (battleArray.sudisFlag1 === 0 && sudisPresentP1) {
        toast("card was discarded by sudis")
        setSudisPresentP1(false)
      }
      if (battleArray.sudisFlag2 === 0 && sudisPresentP2) {
        toast("Sudis discard opponent's card")
        setSudisPresentP2(false)
      }
    }
    if (battleArray.player2 === walletState.userName) {

      if (battleArray.sudisFlag2 === 0 && sudisPresentP2) {
        toast("card was discarded by sudis")
        setSudisPresentP2(false)
      }
      if (battleArray.sudisFlag1 === 0 && sudisPresentP1) {
        toast("Sudis discard opponent card")
        setSudisPresentP1(false)
      }
    }
  }

  useEffect(() => {
    checkSudisTurn()
  }, [walletState, battleArray.sudisFlag2, battleArray.sudisFlag1, sudisPresentP1, sudisPresentP2, setSudisPresentP1, setSudisPresentP2])

  useEffect(() => {
    if (
      battleArray.roundP1 === battleArray.roundP2 &&
      battleArray.roundP1 === 2
    ) {
      if (battleArray.winner_r1 === battleArray.player1) {
        setRoundWinTeam(battleArray.team1);
      } else {
        if (battleArray.team1 === "Remus") {
          setRoundWinTeam("Romulus");
        } else {
          setRoundWinTeam("Remus");
        }
      }
    }
    if (
      battleArray.roundP1 === battleArray.roundP2 &&
      battleArray.roundP1 === 3
    ) {
      if (battleArray.winner_r2 === battleArray.player1) {
        setRoundWinTeam(battleArray.team1);
      } else {
        if (battleArray.team1 === "Remus") {
          setRoundWinTeam("Romulus");
        } else {
          setRoundWinTeam("Remus");
        }
      }
    }
  }, [
    battleArray.player1,
    battleArray.roundP1,
    battleArray.roundP2,
    battleArray.score1,
    battleArray.score2,
    battleArray.team1,
    battleArray.winner_r1,
    battleArray.winner_r2,
  ]);

  useEffect(() => {
    checkRound();
   
  }, [round.roundP1, round.roundP2]);

  return (
    <div className="waiting-opponent">
      <Modal onHide={handleNextRound} show={roundShow && battleArray.winner_g === '' && roundModalDraw === false}>
        <Modal.Body className="modal-bg winner-modal">
          <div
            className="text-center"
            style={{ fontSize: "24px", color: "yellow" }}
          >
            {battleArray.winner_g === "" ? (
              <div className="d-flex justify-between">
                <p style={{ marginLeft: "120px", marginRight: "20px" }}>
                  {" Round " + currentRound + " - " + roundWinTeam + " wins "}
                </p>
                <PoolTimer time={60} response={() => handleNextRound()} />
              </div>
            ) : (
              <div>
                Thanks for playing! Please do provide feedback & any suggestions
                at{" "}
                <a href="https://t.me/vEmpireNFTGaming">
                  https://t.me/vEmpireNFTGaming
                </a>
              </div>
            )}
          </div>

          <button
            onClick={handleNextRound}
            className="mx-auto mt-4 custom-btn d-flex align-items-center"
          >
            <div className="d-flex align-items-center position-relative">
              <div>Continue</div>
            </div>
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoundModal;

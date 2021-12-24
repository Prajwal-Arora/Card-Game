import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useBattleDetail } from "../../../../store/hooks";
import PoolTimer from "../../../common/PoolTimer";

// import { setScoreRound1, setScoreRound2, setScoreRound3 } from '../../../../store/reducer/userReducer';

interface RoundProps {
  roundModalDraw?: any;
  isDraw?: any;
  socket?: any;
  account?: any;
  gameWinner?: any;
  round?: any;
  winnerRound?: any;
}

const RoundModal: React.FC<RoundProps> = ({
  roundModalDraw,
  isDraw,
  socket,
  account,
  gameWinner,
  round,
  winnerRound,
}) => {
  const battleArray = useBattleDetail();
  const [show, setShow] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundWinTeam, setRoundWinTeam] = useState("");
  // const dispatch = useDispatch();

  const handleNextRound = () => {
    setShow(false);
  };

  const checkRound = () => {
    if (round.roundP1 === round.roundP2) {
      const round_val = round.roundP1;
      setCurrentRound(round_val - 1);
    }
  };

  // const storeRoundScores=()=>{
  //     if(battleArray.roundP2===1 && battleArray.roundP2===1){
  //       dispatch(setScoreRound1({
  //         p1:battleArray.score1,
  //         p2:battleArray.score2
  //       }))
  //     }
  //     if(battleArray.roundP1===2 && battleArray.roundP2===2){
  //       dispatch(setScoreRound2({
  //         p1:battleArray.score1,
  //         p2:battleArray.score2
  //       }))
  //     }
  //     if(battleArray.roundP1===3 && battleArray.roundP2===3){
  //       dispatch(setScoreRound3({
  //         p1:battleArray.score1,
  //         p2:battleArray.score2
  //       }))
  //     }
  //   }

  // useEffect(() => {
  //     storeRoundScores()
  //    }, [battleArray.roundP1, battleArray.roundP2, battleArray.score1, battleArray.score2])

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
    if (
      round.roundP1 === round.roundP2 &&
      round.roundP1 !== 1 &&
      round.roundP2 !== 1
    ) {
      setShow(true);
    }
  }, [round.roundP1, round.roundP2]);

  return (
    <div className="waiting-opponent">
      <Modal onHide={handleNextRound} show={show && battleArray.winner_g==='' && roundModalDraw === false}>
        <Modal.Body className="modal-bg winner-modal">
          <div
            className="text-center"
            style={{ fontSize: "24px", color: "yellow" }}
          >
            {gameWinner === "" ? (
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
              {/* <div className="position-absolute right-arrow-position">
                            <img src="/images/right-arrow.png" alt="" className="w-50" />
                        </div> */}
            </div>
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoundModal;

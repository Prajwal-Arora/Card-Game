import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  setBattleArray,
  setEndClick,
} from "../../store/reducer/userReducer";
import { useDispatch } from "react-redux";
import "./index.css";
import {
  useSocketDetail,
  useWalletDetail,
  useBattleDetail,
} from "../../store/hooks";
import { useHistory, useLocation } from "react-router-dom";
import useSound from "use-sound";
import PoolTimer from "../common/PoolTimer";
import { toast } from "react-toastify";
import { roomDelete } from "../../utils/SocketCommon";

const JoinedRoomAudio = require("../../assets/Sounds/Room Joined v2.mp3");

const RiskFactor = () => {
  let location: any = useLocation();
  const [joinedRoomAudio] = useSound(JoinedRoomAudio.default);
  let history = useHistory();
  const walletState: any = useWalletDetail();
  const [requiredArray, setRequiredArray] = useState({
    player1: location.state,
    player2: "",
  });

  const battleArray = useBattleDetail();
  const [disable, setDisable] = useState(false);
  const socket: any = useSocketDetail();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const handleBack: any = () => {
    roomDelete(socket, location.state, walletState.userName);
    history.goBack();
  };

  window.onload = function (e) {
    handleBack();
  };

  window.onpopstate = function (event) {
    roomDelete(socket, location.state, walletState.userName);
  };


  const handleTransaction = async (reqTeam:any) => {
    dispatch(setEndClick(false));
    stopLoading();
    let selectedTeam = "";
    if (requiredArray.player1 !== walletState?.userName) {
      if (reqTeam === "Romulus") {
        selectedTeam = "Remus";
      } else if (reqTeam === "Remus") {
        selectedTeam = "Romulus";
      }
    } else {
      selectedTeam = reqTeam;
    }
    history.push({
      pathname: `/cards-selection/${location.state}`,
      search: selectedTeam,
      state: {
        team: selectedTeam,
        owner: location.state,
      },
    });
    setShow(false);
  };

  useEffect(() => {
    if (socket) {
      socket?.on("cleanedArray", (obj: any) => {
        const requiredObj = JSON.parse(obj);
        dispatch(setBattleArray(requiredObj));
        setRequiredArray((prev) => ({
          ...prev,
          player1: requiredObj.player1,
          player2: requiredObj.player2,
          risk1: "",
          risk2: "",
        }));
      });

      socket?.on("riskFactorChange", (obj: any) => {
        const riskObj = JSON.parse(obj);
        setRequiredArray((prev) => ({
          ...prev,
          player1: riskObj.player1,
          player2: riskObj.player2,
          risk1: riskObj.risk1,
          risk2: riskObj.risk2,
        }));
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket?.on("p2Obj", (obj: any) => {
        joinedRoomAudio();
        const requiredObj = JSON.parse(obj);
        setRequiredArray({
          player1: requiredObj.player1,
          player2: requiredObj.player2
        });
        dispatch(setBattleArray(requiredObj));
        handleTransaction(requiredObj.team1)
      });
    }
  }, [history, joinedRoomAudio, socket]);

  useEffect(() => {
    if (requiredArray.player1 === "" && battleArray?.winner_r1 === "") {
      toast("Room deleted");
      history.push("/");
    }
  }, [battleArray, history, requiredArray.player1]);


  return (
    <div>
      <div className="w-75 m-auto pt-5 setMiddle">
        <div className="position-relative d-flex z-0">
          <img
            style={{ width: "30%" }}
            className="m-auto "
            src="/images/Rectangle 4.png"
            alt=""
          />
          <div
            style={{
              fontSize: "24px",
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: " translate(-50%, -50%)",
              color: "white",
            }}
          >
            Ready
          </div>
        </div>
        <div className="d-flex w-75 m-auto">
          <div className="mt-4 mx-4 risk-bg w-50">
            <Card>
              <Card.Body>
                <Card.Title className="gradient-text">
                  {" "}
                  {requiredArray.player1}
                </Card.Title>
                <Card.Text>
                  <div className="d-flex align-items-center mt-4">
                    <div className="gradient-text text-Shadow ">
                      Start Game
                    </div>
                    <div className="mx-4">
                      <button className="factor-label">
                        {(requiredArray?.player1 === "" || requiredArray?.player1 === undefined) ? "?" : 'Joined'}
                      </button>
                    </div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="mt-4 risk-bg w-50">
            <Card className="h-100">
              <Card.Body>
                {!requiredArray.player2 ? (
                  <div className="align-items-center justify-content-center h-100 d-flex gradient-text text-Shadow">
                    <div
                      className="align-items-center justify-content-between d-flex h-100 gradient-text text-Shadow"
                      style={{ marginRight: "30px" }}
                    >
                      Waiting For Opponent
                    </div>
                    <PoolTimer time={300} response={() => handleBack()} />
                  </div>
                ) : (
                  <div>
                    <Card.Title className="gradient-text">
                      {requiredArray.player2}
                    </Card.Title>
                    <div className="d-flex align-items-center mt-4">
                      <div className="gradient-text text-Shadow ">
                        Start Game
                      </div>
                      <div className="mx-4">
                        <button disabled={disable} className="factor-label">
                          {(requiredArray?.player2 === "" || requiredArray?.player2 === undefined) ? "?" : 'Ready'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="end-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskFactor;

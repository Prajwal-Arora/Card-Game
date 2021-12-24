import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { setBattleArray, setEndClick, setRiskFactor } from "../../store/reducer/userReducer";
import { useDispatch } from "react-redux";
import "./index.css";
import { useSocketDetail, useWalletDetail } from "../../store/hooks";
import { useHistory, useLocation } from "react-router-dom";
import { addressSubstring } from "../../utils/CommonUsedFunction";
import useSound from "use-sound";
import PoolTimer from "../common/PoolTimer";
//const JoinedRoomAudio = require("../../assets/Sounds/Room Joined v2.mp3");
const JoinedRoomAudio = require("../../assets/Sounds/Room Joined v2.mp3");

const RiskFactor = () => {
  let location: any = useLocation();
  const [joinedRoomAudio] = useSound(JoinedRoomAudio.default);
  let history = useHistory();
  const walletState: any = useWalletDetail();
  const [team, setTeam] = useState("");
  const [requiredArray, setRequiredArray] = useState({
    player1: location.state,
    player2: "",
    risk1: "",
    risk2: "",
  });
  const socket: any = useSocketDetail();
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(true);

  const handleBack = () => {
    const array = [location.state, walletState.accounts[0]];
    socket?.emit("clean", JSON.stringify(array));
    socket?.on("cleanedArray", (array: any) => {
      const battleArray = JSON.parse(array);
      dispatch(setBattleArray(battleArray));
    });
    history.goBack();
  };

  window.onload = function () {
    history.goBack();
  };

  window.onpopstate = function (event) {
    const array = [location.state, walletState.accounts[0]];
    socket?.emit("clean", JSON.stringify(array));
    socket?.on("cleanedArray", (array: any) => {
      const battleArray = JSON.parse(array);
      dispatch(setBattleArray(battleArray));
    });
  };

  useEffect(() => {
    dispatch(setEndClick(false));
    if (
      requiredArray.risk1 === requiredArray.risk2 &&
      requiredArray.risk1 !== "" &&
      requiredArray.risk2 !== ""
    ) {
      let selectedTeam = "";
      if (requiredArray.player1 !== walletState?.accounts[0]) {
        if (team === "Romulus") {
          selectedTeam = "Remus";
        } else if (team === "Remus") {
          selectedTeam = "Romulus";
        }
      } else {
        selectedTeam = team;
      }
      history.push({
        pathname: `/cards-selection/${location.state}`,
        search: selectedTeam,
        state: {
          team: selectedTeam,
          owner: location.state,
        },
      });
    }
  }, [
    history,
    location.state,
    requiredArray.player1,
    requiredArray.risk1,
    requiredArray.risk2,
    team,
    walletState?.accounts,
  ]);

  useEffect(() => {
    socket?.on("p2Obj", (obj: any) => {
      joinedRoomAudio();
      const requiredObj = JSON.parse(obj);
      setRequiredArray({
        player1: requiredObj.player1,
        player2: requiredObj.player2,
        risk1: "",
        risk2: "",
      });
    });

    socket?.on("cleanedArray", (obj: any) => {
      const requiredObj = JSON.parse(obj);
      console.log(requiredObj, "requiredObj");
      setRequiredArray({
        player1: requiredObj.player1,
        player2: requiredObj.player2,
        risk1: "",
        risk2: "",
      });
    });

    socket?.on("riskFactorChange", (obj: any) => {
      const riskObj = JSON.parse(obj);
      setRequiredArray({
        player1: riskObj.player1,
        player2: riskObj.player2,
        risk1: riskObj.risk1,
        risk2: riskObj.risk2,
      });
      setTeam(riskObj.team1);
    });
  }, [socket, location, joinedRoomAudio]);

  const predefinedValues = [
    { label: "10%", value: 10 },
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
  ];

  const handleRiskFactor = (value: number) => {
    dispatch(setRiskFactor(value.toString()));
    const client = walletState.accounts[0];
    const array = [requiredArray.player1, client, value];
    socket?.emit("riskButtonClick", JSON.stringify(array));
    setTimer(false);
    setTimeout(() => {
      setTimer(true);
    }, 1);
  };

  return (
    <div>
      <div style={{ position: "absolute", top: "10%", right: "5%" }}>
        {requiredArray.player2 !== "" && timer ? (
          <PoolTimer time={60} response={() => handleBack()} />
        ) : (
          ""
        )}
      </div>
      <div className="w-75 m-auto pt-5">
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
            Risk Factor
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-4 h5 text-uppercase">
          <div className="gradient-text"> Select Risk Factor</div>

          <div className="d-flex px-1">
            {predefinedValues.map(({ label, value: predefinedValue }) => {
              return (
                <div className="content px-2" key={predefinedValue}>
                  <button
                    disabled={requiredArray.player2 === ""}
                    onClick={() => handleRiskFactor(predefinedValue)}
                    className={
                      requiredArray.player2 ? "factor-label" : "factor-label1 "
                    }
                  >
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="d-flex w-75 m-auto">
          <div className="mt-4 mx-4 risk-bg w-50">
            <Card>
              <Card.Body>
                <Card.Title className="gradient-text">
                  {" "}
                  {addressSubstring(requiredArray.player1)}
                </Card.Title>

                <Card.Text>
                  <div className="d-flex align-items-center mt-4">
                    <div className="gradient-text text-Shadow ">
                      Risk Factor Selected
                    </div>
                    <div className="mx-4">
                      <button className="factor-label">
                        {requiredArray?.risk1}
                        {requiredArray?.risk1 === "" ? "?" : "%"}
                      </button>
                    </div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="mt-4 risk-bg w-50">
            <Card className="h-100">
              {/* <Card.Body "> */}
              <Card.Body>
                {!requiredArray.player2 ? (
                  <div className="align-items-center justify-content-center d-flex h-100 gradient-text text-Shadow">
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
                    {/* <Card.Body> */}
                    <Card.Title className="gradient-text">
                      {addressSubstring(requiredArray.player2)}
                    </Card.Title>
                    <div className="d-flex align-items-center mt-4">
                      <div className="gradient-text text-Shadow ">
                        Risk Factor Selected
                      </div>
                      <div className="mx-4">
                        <button className="factor-label">
                          {requiredArray?.risk2}
                          {requiredArray?.risk2 === "" ? "?" : "%"}
                        </button>
                      </div>
                    </div>
                    {/* </Card.Body> */}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center gradient-text mt-4">
          Please choose same risk factor to start the game.
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

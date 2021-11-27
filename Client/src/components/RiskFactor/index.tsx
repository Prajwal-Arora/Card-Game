import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { setBattleArray, setRiskFactor } from "../../store/reducer/userReducer";
import { useDispatch } from "react-redux";
import "./index.css";
import { useSocketDetail, useWalletDetail } from "../../store/hooks";
import { useHistory, useLocation } from "react-router-dom";
import { isSocketIO } from "../../utils/contractIntegration/socketIntegration";
import { addressSubstring } from "../../utils/CommonUsedFun";
//import { socketUpdatedArray } from '../../utils/contractIntegration/socketIntegration'

const RiskFactor = () => {
  let location: any = useLocation();
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

  useEffect(() => {
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
  }, [history, location.state, requiredArray.player1, requiredArray.risk1, requiredArray.risk2, team, walletState?.accounts]);

  useEffect(() => {
    socket.on("p2Obj", (obj: any) => {
      const requiredObj = JSON.parse(obj);
      setRequiredArray({
        player1: requiredObj.player1,
        player2: requiredObj.player2,
        risk1: "",
        risk2: "",
      });
    });

    socket.on("riskFactorChange", (obj: any) => {
      const riskObj = JSON.parse(obj);
      setRequiredArray({
        player1: riskObj.player1,
        player2: riskObj.player2,
        risk1: riskObj.risk1,
        risk2: riskObj.risk2,
      });
      setTeam(riskObj.team1);
    });

        // if(!location.state)
        //     if (requiredArray.player1 === walletState.accounts[0] && socket) {
        //         socket.emit("clean", walletState.accounts[0])    
        //         socket.on("cleanedArray", (array:any) => {
        //         const battleArray = JSON.parse(array)
        //         dispatch(setBattleArray(battleArray))
        //         })
        //     }
        //     if (requiredArray.player2 === walletState.accounts[0]) {
        //         //remove player 2 from socket room 
        //         //remove p2 from battle object
        //     }
  }, [socket,location]);

  const predefinedValues = [
    { label: "10%", value: 10 },
    { label: "25%", value: 25 },
    { label: "50%", value: 50 },
  ];

  const handleRiskFactor = (value: number) => {
    dispatch(setRiskFactor(value.toString()));
    const client = walletState.accounts[0];
    const array = [requiredArray.player1, client, value];
    socket.emit("riskButtonClick", JSON.stringify(array));
  };

  return (
    <div className="w-75 m-auto pt-5">
      <div className="position-relative d-flex z-0">
        <img
          style={{ width: "30%" }}
          className="m-auto "
          src="/images/Rectangle 4.png"
          alt=""
        />
        <div
          style={{ top: "5px", fontSize: "24px" }}
          className="gradient-text position-absolute w-100 text-white text-center"
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
                disabled={requiredArray.player2===''}
                  onClick={() => handleRiskFactor(predefinedValue)}
                  className={requiredArray.player2?"factor-label":"factor-label1 "}
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
                  Waiting For Opponent
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
    </div>
  );
};

export default RiskFactor;

import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useHistory } from "react-router";
import {
  apiHandler,
  apiHandlerStatus,
} from "../../../services/apiService/axios";
import { getUser } from "../../../services/apiService/userServices";
import { useWalletDetail } from "../../../store/hooks";
import CustomTable from "../../common/CustomTable";
import "../index.css";

const GameHistory = () => {
  const walletState: any = useWalletDetail();
  const [userData, setUserData] = useState<any>();
  let history = useHistory();

  const handleBack = () => {
    history.push("/");
  };

  
  useEffect(() => {
    apiHandler(() => getUser(walletState.userName), {
      onSuccess: (response: any) => {
        if (response) {
          if(response.length===0){
            setUserData({
              wins:0,
              losses:0,
              played:0
            })
          }
          else{
            setUserData(response[0]);
          }
         
        }
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    });
    
  }, []);


  return (
    <div className="w-75 m-auto mb-0 setMiddle">
      <div className="position-relative d-flex z-0 mb-3">
        <img
          style={{ width: "30%" }}
          className="m-auto "
          src="/images/Rectangle 4.png"
          alt=""
        />
        <div
          style={{ fontSize: "2.2vw" }}
          className="gradient-text position-absolute w-100 text-white text-center"
        >
          My Stats
        </div>
      </div>
      <div className="d-flex mt-3 w-50 m-auto mb-0 justify-content-between">
        <div
          style={{ alignItems: "center" }}
          className="d-flex justify-content-between"
        >
          <p
            style={{ marginRight: "10px", fontSize: "24px" }}
            className="custom-heading"
          >
            Wins <span>:</span>
          </p>
          <div
            style={{ width: "50px", height: "38px" }}
            className="custom-btn-score "
          >
            {userData?.wins}
          </div>
        </div>
        <div
          style={{ alignItems: "center" }}
          className="d-flex   justify-content-between"
        >
          <p
            style={{ marginRight: "10px", fontSize: "24px" }}
            className="custom-heading"
          >
            losses <span>:</span>
          </p>
          <div
            style={{ width: "50px", height: "38px" }}
            className="custom-btn-score "
          >
            {userData?.losses}
          </div>
        </div>
        <div
          style={{ alignItems: "center" }}
          className="d-flex   justify-content-between"
        >
          <p
            style={{ marginRight: "10px", fontSize: "24px" }}
            className="custom-heading"
          >
            Ratio <span>:</span>
          </p>
          <div
            style={{ width: "50px", height: "38px" }}
            className="custom-btn-score "
          >
            {userData?.wins === 0
              ? userData?.wins
              : (userData?.wins / userData?.played).toFixed(2)}
          </div>
        </div>
      </div>
      <div
        className="text-center gradient-text my-3"
        style={{ fontSize: "20px" }}
      >
      </div>
      <div className="d-flex justify-content-center">
        <button onClick={handleBack} className="end-btn">
          Back
        </button>
      </div>
    </div>
  );
};

export default GameHistory;

import { findIndex } from "lodash";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { apiHandler } from "../../../services/apiService/axios";
import { getLeaderBoard, getUser } from "../../../services/apiService/userServices";
import { useWalletDetail } from "../../../store/hooks";
import { addressSubstring, copyToClipboard } from "../../../utils/CommonUsedFunction";
import CustomTable from "../../common/CustomTable";
import "../index.css";

const LeaderBoard = () => {
  const walletState: any = useWalletDetail();
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [tableStructure, setTableStructure] = React.useState<any>({
    columns: [],
    rows: [],
  });

  const handleBack = () => {
    history.push("/");
  };

  const handleUserName=(address:string)=>{
    copyToClipboard(address)
  }

  const [userData, setUserData] = useState<any>();

  
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

  useEffect(() => {
    apiHandler(() => getLeaderBoard(), {
      onSuccess: (response: any) => {
        if (response) {
          setIsLoading(false);
          setTableStructure({
            columns: [
              {
                label: "Rank",
                key:"rank",
                render: (row: any) => {
                  return (
                    <span>
                      {response.findIndex(
                        (item: any) => item.username === row.username
                      ) + 1}
                    </span>
                  );
                },
              },
              {
                label: "User Name",
                key: "user",
                render: (row: any) => {
                  return <span onClick={()=>handleUserName(row.username)}>{row.username}</span>;
                },
              },
              {
                label: "Game Played",
                key: "played",
              },
              {
                label: "Total win",
                key: "wins",
              },
              {
                label: "Win %",
                key:'win%',
                render: (row: any) => {
                  return (
                    <span>
                      {((row?.wins / row?.played) * 100).toFixed(2)} %
                    </span>
                  );
                },
              },
            ],
            rows: response,
          });
        }
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    });
  }, [isLoading]);

  return (
    <div style={{position:'relative', top:'14vh',paddingBottom:'10px'}}>
      <div className="mb-5">
      <div className="position-relative d-flex z-0 mb-3">
        <img
          style={{ width: "30%" }}
          className="m-auto "
          src="/images/Rectangle 4.png"
          alt=""
        />
        <div
          style={{ fontSize: "2.2vw" }}
          className="gradient-text position-absolute w-100 text-white text-center mt-2"
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
            Wins:
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
            losses:
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
          className="d-flex  justify-content-between"
        >
          <p
            style={{ marginRight: "10px", fontSize: "24px" }}
            className="custom-heading"
          >
            Ratio:
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
      </div>
      <div className="position-relative d-flex z-0 mb-3" >
        <img
          style={{ width: "30%" }}
          className="m-auto "
          src="/images/Rectangle 4.png"
          alt=""
        />
        <div
          style={{
            fontSize: "2.2vw",
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: " translate(-50%, -50%)",
            color: "white",
          }}
        >
          Leaderboard
        </div>
      </div>

      <div className="leaderboard-table-wrapper header-table leader-header">
        <Table responsive striped hover variant="dark" {...tableStructure}>
          <thead>
            <thead>
              <tr>
                <th>{"Rank"}</th>
                <th>{"User Name"}</th>
                <th>{""}</th>
                <th>{""}</th>
                <th>{""}</th>
                <th>{""}</th>
                <th>{""}</th>
                <th>{""}</th>
                <div>
                  <th>{"Played"}</th>
                  <th>{""}</th>
                  <th>{"Wins"}</th>
                  <th>{""}</th>
                  <th>{"Win %"}</th>
                </div>
              </tr>
            </thead>
          </thead>
          <tbody>
            {isLoading ? (
              <div>
                <Spinner
                  animation="border"
                  style={{
                    display: "block",
                    margin: "50px auto",
                    position: "unset",
                  }}
                />
              </div>
            ) : (
              <div className="mt-4 v-scrolling-leaderboard ">
                <CustomTable {...tableStructure} />
              </div>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mb-4">
          <button onClick={handleBack} className="end-btn">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

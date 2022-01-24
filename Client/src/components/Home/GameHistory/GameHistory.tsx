import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { apiHandler } from "../../../services/apiService/axios";
import { getBattleHistory, getUser } from "../../../services/apiService/userServices";
import { useWalletDetail } from "../../../store/hooks";
import CustomTable from "../../common/CustomTable";
import "../index.css";

const GameHistory = () => {
  const walletState: any = useWalletDetail();
  const [userData, setUserData] = useState<any>();
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(true)
  const [tableStructure, setTableStructure] = React.useState<any>({
    columns: [],
    rows: []
});
  // const [tableStructure, setTableStructure] = React.useState({
  //   columns: [
  //     {
  //       label: "Game ID",
  //       key: "gameId",
  //     },
  //     {
  //       label: "xVemp",
  //       key: "xVemp",
  //     },
  //     {
  //       label: "Win/loss",
  //       key: "status",
  //       render: (row: any) => {
  //         return <span>{row?.status} </span>;
  //       },
  //     },
  //     {
  //       label: "Claim",
  //       key: "claim",
  //       render: () => {
  //         return (
  //           <div className="custom-btn p-0 text-center text-dark">Claim </div>
  //         );
  //       },
  //     },
  //   ],
  //   rows: [
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 10,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //     {
  //       gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
  //       status: "Win",
  //       xVemp: 14,
  //     },
  //   ],
  //   totalItems: 20,
  // });

  const handleBack = () => {
    history.push("/");
  };

  useEffect(() => {
    apiHandler(() => getUser(walletState.accounts[0]), {
      onSuccess: (response: any) => {
        if (response) {
          setUserData(response[0]);
        }
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    });

    apiHandler(() => getBattleHistory(walletState.accounts[0]), {
      onSuccess: (response: any) => {
        console.log(response,"responseValue")
        if (response) {
          setIsLoading(false)
          setTableStructure({
            columns: [
              {
                label: "Game ID",
                key: "gameId",
              },
              {
                label: "xVemp",
                key: "xVemp",
              },
              {
                label: "Win/loss",
                key: "status",
                render: (row: any) => {
                  return <span>{row?.status} </span>;
                },
              },
              {
                label: "Claim",
                key: "claim",
                render: () => {
                  return (
                    <div className="custom-btn p-0 text-center text-dark">Claim </div>
                  );
                },
              },
            ],
            rows: response.records
        })
        }
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    });

    
  }, []);

  return (
    <div className="w-75 m-auto mb-0 ">
      <div className="position-relative d-flex z-0">
        <img
          style={{ width: "30%" }}
          className="m-auto "
          src="/images/Rectangle 4.png"
          alt=""
        />
        <div
          style={{  fontSize: "24px" }}
          className="gradient-text position-absolute w-100 text-white text-center"
        >
          Game History
        </div>
      </div>
      <div className="d-flex mt-3 w-50 m-auto mb-0 justify-content-between">
        <div
          style={{ alignItems: "center" }}
          className="d-flex  justify-content-between"
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
      <div className="mt-4 history-table-wrapper header-table">
        <Table responsive striped hover variant="dark" {...tableStructure}>
          <thead>
            <tr>
              {/* {columns.map(({ key, label }) => {
              return <th key={key}>{label}</th>;
            })} */}
              <th>Game ID</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th>
              <th>{""}</th> <th>{""}</th>
              <th>{""}</th>
              <div>
                <th>xVemp</th>
                <th>{""}</th>
                <th>Win/loss</th>
                <th>{""}</th>
                <th>Claim</th>
              </div>
            </tr>
          </thead>
        </Table>
      </div>
      <div className="mt-4 history-table-wrapper v-scrolling">
        <CustomTable {...tableStructure} />
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

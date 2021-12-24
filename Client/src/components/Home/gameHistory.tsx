import React from "react";
import { Table } from "react-bootstrap";
import { useHistory } from "react-router";
import { useWalletDetail } from "../../store/hooks";
import CustomTable from "../common/CustomTable";
import "./index.css";

const GameHistory = () => {
  const walletState: any = useWalletDetail();
  let history = useHistory();
  const [tableStructure, setTableStructure] = React.useState({
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
    rows: [
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 10,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
      {
        gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352",
        status: "Win",
        xVemp: 14,
      },
    ],
    totalItems: 20,
  });

  const handleBack = () => {
    history.push("/");
  };

  return (
    <div className="w-75 m-auto mb-5">
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
          Game History
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

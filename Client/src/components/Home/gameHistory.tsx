import React from "react";
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
        key: "xVemp"
      },
      {
        label: "Win/loss",
        key: "status",
        render: (row: any) => {
          return <span>{row?.status} </span>;
        },
      },

    ],
    rows: [
      { gameId: '0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352', status: "Win", xVemp: 10 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
      { gameId: "0xA0d1BFe603e328162eCFF4d95CBdae7434dB2352", status: "Win", xVemp: 14 },
    ],
    totalItems: 20,
  });

  const handleBack=()=>{
    history.push("/create-room");
  }

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
      <div className="mt-4 history-table-wrapper">
        <CustomTable {...tableStructure} />
      </div>
      <div className="d-flex justify-content-center">
        <button onClick={handleBack} className="end-btn">Back</button>
      </div>

    </div>
  );
};

export default GameHistory;

import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  useBattleDetail,
  useSocketDetail,
  useWalletDetail,
} from "../../store/hooks";
import { useAppDispatch } from "../../store/store";
import { addressSubstring, copyToClipboard } from "../../utils/CommonUsedFun";
import { socketJoinIntegration } from "../../utils/contractIntegration/socketIntegration";
import "./index.css";

const JoinRoom = () => {
  const dispatch = useAppDispatch();
  let history = useHistory();
  const battleArray = useBattleDetail();
  const walletState: any = useWalletDetail();
  let socket: any = useSocketDetail();

  // let location = useLocation();
  // const [roomData,] = useState<any>(location.state)

  useEffect(() => {
    socketJoinIntegration(dispatch, {
      account: walletState.accounts[0],
    });
  }, []);

  function handleBack() {
    history.push("/create-room");
  }

  const handleJoin = (value: any) => {
    const payload = {
      roomOwner: value,
      client: walletState.accounts[0],
    };
    socket.emit("joinCreatedRooms", JSON.stringify(payload));

    history.push({
      pathname: "/risk-factor",
      search: value,
      state: value,
    });
  };

  return (
    <div>
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
            Join Room
          </div>
        </div>
        <div className="mt-2">
          {battleArray.length !== 0 ? (
            battleArray?.map((item: any) => (
              <div
                className="d-flex justify-content-center align-items-center my-3"
                key={item.player1}
              >
                <div
                  className="gradient-text"
                  onClick={() => copyToClipboard(item.player1)}
                >
                  {addressSubstring(item.player1)}
                </div>
                <div className="mx-3 xVempTxt d-flex">
                  <div className="w-50 ">{item.xVempLocked} xVemp </div>
                  <div className="w-50 text-end"> {item.team1}</div>
                </div>
                <div>
                  <button
                    onClick={() => handleJoin(item.player1)}
                    className="custom-btn px-5"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white">No Rooms Available</div>
          )}
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

export default JoinRoom;

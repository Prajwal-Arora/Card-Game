import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import {
  useBattleDetail,
  useSocketDetail,
  useTokenBalance,
  useWalletDetail,
} from "../../../store/hooks";
import { useAppDispatch } from "../../../store/store";
import {
  addressSubstring,
  copyToClipboard,
} from "../../../utils/CommonUsedFunction";
import { socketJoinIntegration } from "../../../utils/contractIntegration/socketIntegration";
import "../index.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast, ToastContainer } from "react-toastify";
const JoinRoom = () => {
  const dispatch = useAppDispatch();
  const balance = useTokenBalance()
  let history = useHistory();
  const battleArrayData = useBattleDetail();
  const [battleArray, setBattleArray] = useState<any>([]);
  const walletState: any = useWalletDetail();
  let socket: any = useSocketDetail();

  useEffect(() => {
    if (battleArrayData.length > 0) {
      setBattleArray(battleArrayData);
    }
  }, [battleArrayData]);


  useEffect(() => {
    const joinedRoom = () => {
      socketJoinIntegration(dispatch, {
        account: walletState.accounts[0],
        roomFilled: handleRedirect,
      });
    };
    joinedRoom();
    // const join=setInterval(joinedRoom,500)
    // return()=>{
    //   clearInterval(join)
    // }
  }, []);

  const handleRedirect = useCallback(() => {
    history.push({
      pathname: "/join-room",
    });
  }, [history]);

  function handleBack() {
    history.push("/");
  }

  const handleJoin = (value: any,amountLocked:any) => {
    // if(amountLocked<=balance){
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
    // }
    // else{
    //   toast("Dont have that much balance to Join room ")
    // }
   
  };

  return (
    <>
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
          <div
            className={`${
              battleArray.length <= 10 ? "" : "infinite-scroll-style"
            }scrollableDiv `}
          >
            <InfiniteScroll
              dataLength={battleArray?.length}
              next={battleArray}
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              inverse={true}
              hasMore={true}
              loader={""}
              scrollableTarget="scrollableDiv"
            >
              {battleArray?.length !== 0 ? (
                battleArray &&
                battleArray?.map((item: any) => (
                  <div
                    className="d-flex justify-content-center align-items-center my-3 font-style"
                    key={item.player1}
                  >
                    {/* react-infinite-scroll-component */}
                    <div
                      className="gradient-text"
                      onClick={() => copyToClipboard(item.player1)}
                    >
                      {addressSubstring(item.player1)}
                    </div>
                    <div className="mx-3 xVempTxt d-flex">
                      <div className="w-50 font-style">
                        {item.xVempLocked} xVemp{" "}
                      </div>
                      <div className="w-50 text-end"> {item.team1}</div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleJoin(item.player1,item.xVempLocked)}
                        className="custom-btn px-5 font-style"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white">No Rooms Available</div>
              )}{" "}
            </InfiniteScroll>
          </div>
        </div>
        <div
          className="text-center gradient-text mt-4"
          style={{ fontSize: "20px" }}
        >
          Refresh page to get updated battle rooms
        </div>
        <div className="text-center mt-4">
          <button className="end-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
     {/* <ToastContainer toastClassName="toastr" progressClassName="toastProgress"/> */}
    </>
  );
};

export default JoinRoom;

import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  useBattleDetail,
  useSocketDetail,
  useWalletDetail,
} from "../../../store/hooks";
import { useAppDispatch } from "../../../store/store";
import { socketJoinIntegration } from "../../../utils/contractIntegration/socketIntegration";
import "../index.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
const JoinRoom = () => {
  const dispatch = useAppDispatch();
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
        roomFilled: handleRedirect,
        socket: socket
      });
    };
    joinedRoom();

  }, [dispatch, socket]);


  const handleRedirect = useCallback(() => {
    history.push({
      pathname: "/join-room",
    });
  }, [history]);

  function handleBack() {
    history.goBack();
  }

  const handleJoin = (value: any) => {
    if(value!==walletState.userName){
      const payload = {
        roomOwner: value,
        client: walletState.userName,
      };
      socket.emit("joinCreatedRooms", JSON.stringify(payload));
      history.push({
        pathname: "/ready",
        search: value,
        state: value,
      });
    }
    else{
      toast("Cannot join room with same user name")
    }

  };

  return (
    <>
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
              style={{ fontSize: "2vw" }}
              className="gradient-text position-absolute w-100 text-white text-center"
            >
              Join Room
            </div>
          </div>
          <div className="mt-2">
            <div
              className={`${battleArray.length <= 10 ? "" : "infinite-scroll-style"
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
                        style={{fontSize:'24px'}}
                      >
                        {item.player1}
                      </div>
                      <div className="mx-3 xVempTxt d-flex">
                        <div className="w-50 text-end text-uppercase">{item.team1} </div>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            handleJoin(item.player1)
                          }
                          className="custom-btn px-5 font-style"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white">
                    No Rooms Available
                  </div>
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
          <div className="text-center mt-4 mb-2">
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

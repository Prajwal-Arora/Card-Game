import { useEffect, useRef, useState } from "react";
import { useWalletDetail } from "../../../store/hooks";
import CreateRoomModal from "./CreateRoomModal";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import { Link, useHistory } from "react-router-dom";
import MobileView from "../MobileView";
import { apiHandler } from "../../../services/apiService/axios";
import { clearLocalStore } from "../../../common/localStorage";
import { toast } from "react-toastify";
import { getUser } from "../../../services/apiService/userServices";
import { setBattleArray } from "../../../store/reducer/userReducer";
import { useAppDispatch } from "../../../store/store";

const CreateRoom = () => {
  const walletState: any = useWalletDetail();
  const dispatch = useAppDispatch();
  let history = useHistory();
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  window.onoffline = function () {
    toast("Your Internet is disconnected")
    return true;
  };

  useEffect(() => {
    apiHandler(() => getUser(walletState.userName), {
      onSuccess: (response: any) => {
        if(response.length===0){
          clearLocalStore('userName')
          toast("User not exist")
          history.push('/')
        }
        
      },
      onError: (error: any) => {
        console.log("error", error);
      },
    });

    dispatch(setBattleArray([]))

    clearLocalStore('battleArray')
  }, [walletState.userName]);



  return (
    <>
      <div
        className="desktop-text w-75 m-auto position-relative d-grid justify-content-center "
        // style={{ height: "85vh" }}
      >
        <div className="d-flex position-relative"  style={{ top: "30%" }}>
          <img className="w-50 m-auto" src="/images/Logo-golden 2.png" alt="" />
        </div>
        <div style={{ bottom: "20px" }} className="position-relative z-0">
          <img
            style={{ width: "55%" }}
            className="m-auto d-flex"
            src="/images/Logo-golden2 1.png"
            alt=""
          />
          <div
            style={{ top: "150px" }}
            className="position-absolute w-100 d-flex z-0"
          >
            <img
              style={{ width: "60%" }}
              className="m-auto "
              src="/images/Rectangle 4.png"
              alt=""
            />
            <div
              style={{ fontSize: "30px" }}
              className="gradient-text position-absolute w-100 text-white text-center"
            >
              THE BEGINNING
            </div>
          </div>
          <div className="text-center z-10">
            <div className="d-grid m-auto w-50">
              <button
                onClick={() => handleShow()}
                className="custom-btn bg-green-500 px-8 py-2  "
                id="modal"
              >
                Create Room
              </button>
              <Link
                className="text-decoration-none"
                to={{
                  pathname: "/join-room",
                }}
              >
                <button className="custom-btn mt-2 focus:outline-none w-100">
                  Join Room
                </button>
              </Link>
              <Link
                className="text-decoration-none"
                to={{
                  pathname: "/leaderboard",
                }}
              >
                <button className="custom-btn mt-2 focus:outline-none w-100">
                  Leaderboard
                </button>
              </Link>
              <a
                className="text-decoration-none"
                target="blank"
                href="https://www.youtube.com/watch?v=VK3QvFFGV78&t=1s"
              >
                <button style={{background: 'linear-gradient(224.89deg,#CC6600 30%,#ff8000 50%,#ff8000 90%)'}} className="custom-btn mt-2 focus:outline-none w-100">
                  How To Play
                </button>
              </a>
              <a
                className="text-decoration-none"
                target="blank"
                href="https://v-empire.io/wp-content/uploads/2022/03/NFT-Handbook-Feb-22.pdf"
              >
                <button style={{background: 'linear-gradient(224.89deg,#CC6600 30%,#ff8000 50%,#ff8000 90%)'}} className="custom-btn mt-2 focus:outline-none w-100">
                  Game Manual
                </button>
              </a>
              <CreateRoomModal
                account={walletState?.userName}
                elementRef={ref}
                show={show}
                handleClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
      <MobileView />
    </>
  );
};

export default CreateRoom;

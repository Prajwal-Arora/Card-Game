import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './index.css'
import { clearLocalStore } from "../../../common/localStorage";
import { useWalletDetail } from "../../../store/hooks";
import MobileView from "../MobileView";

const Welcome = () => {
  const walletState: any = useWalletDetail();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const handlePlayForVemp=()=>{
    window.open(
      'https://play.v-empire.io/create-room',
      '_blank' // <- This is what makes it open in a new window.
    );
  }


  window.onoffline = function () {
    toast("Your Internet is disconnected")
    return true;
  };

  useEffect(() => {
    clearLocalStore('battleArray')
  }, [walletState.userName]);


  return (
    <>
      <div
        className="desktop-text w-75 m-auto position-relative d-grid justify-content-center overflow-hidden"
        style={{ top: '100px' }}
      >
        <div className="d-flex">
          <img className="w-50 m-auto" src="/images/Logo-golden 2.png" alt="" />
        </div>
        <div style={{ bottom: "85px" }} className="position-relative z-0">
          <img
            style={{ width: "60%" }}
            className="m-auto d-flex"
            src="/images/Logo-golden2 1.png"
            alt=""
          />
          <div
            style={{ top: "160px" }}
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
              <Link
                className="text-decoration-none"
                to={{
                  pathname: "/login",
                }}
              >
                <button
                  onClick={() => handleShow()}
                  className="login-btn bg-green-500  "
                  id="modal"
                >
                  Login
                </button>
              </Link>
              <Link
                className="text-decoration-none"
                to={{
                  pathname: "/signup",
                }}
              >
                <button className="login-btn mt-2 focus:outline-none ">
                  Signup
                </button>
              </Link>
              <button onClick={handlePlayForVemp} className="login-btn  mt-2">
                Play for $VEMP
              </button>
            </div>
          </div>
        </div>
      </div>
      <MobileView />
    </>
  );
};

export default Welcome;
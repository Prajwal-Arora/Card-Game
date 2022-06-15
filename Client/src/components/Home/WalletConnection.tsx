import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { clearLocalStore, getLocalStore } from "../../common/localStorage";
import { useWalletDetail } from "../../store/hooks";
import { setUserName } from "../../store/reducer/walletReducer";
import { useAppDispatch } from "../../store/store";
import "./index.css";

const WalletConnection = () => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const path = useLocation();
  const location = path.pathname.split("/")[1];
  const walletState: any = useWalletDetail()

  const handleLogout = () => {
    clearLocalStore('userName')
    dispatch(setUserName(''))
    history.push('/')
  }

  const handlePlayForVemp=()=>{
    window.open(
      'https://play.v-empire.io/create-room',
      '_blank' // <- This is what makes it open in a new window.
    );
  }


  return (
    <>
      {(location !== "game-play" && (location !== "" || getLocalStore('userName').length !== 0)) && (
        // <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex p-4 w-100 position-absolute" style={{zIndex:10}}>
            <div>
              {walletState.userName.length !== 0 && <div className="text-yellow text-xl flex items-center">
                USERNAME
                <span className="mx-2">
                  <img
                    src="/images/down-arrow.png"
                    alt="vector"
                    className="w-2/3"
                  />
                </span>
              </div>}
              <div
                className="text-white text-lg userAddress"
              >
                {walletState.userName}
              </div>
            </div>
            <div className="d-flex justify-content-end" style={{ width: '84%' }}>
              {walletState.userName.length !== 0 && (location === 'create-room' || location === 'join-room' ) && 
              <>
              <button onClick={handlePlayForVemp} className="logout-btn">
                Play for $VEMP
              </button>
              <div className="d-flex justify-content-end mx-4" >
              <button onClick={handleLogout} className="logout-btn">
              logout
            </button>
            </div>
            </>
            }

            </div>
          </div>
        // </div>
      )}
    </>
  );
};

export default WalletConnection;

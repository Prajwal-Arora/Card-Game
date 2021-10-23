import React from 'react'
import { useHistory } from "react-router-dom";

const JoinRoom = () => {
    let history = useHistory();
    function handleBack() {
        history.push("/create-room");
      }

    return (
        <div>
            <div className="w-75 m-auto pt-5">
                <div className="position-relative d-flex z-0">
                    <img style={{ width: '30%' }} className="m-auto " src="/images/Rectangle 4.png" alt="" />
                    <div style={{ top: '5px', fontSize: '24px' }} className="gradient-text position-absolute w-100 text-white text-center">
                        Join Room
                    </div>

                </div>
                <div className="text-center mt-4"> 
                    <button className="end-btn" onClick={handleBack}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JoinRoom

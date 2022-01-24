import React from 'react'

const WinnerByInactivity = ({playerName,Round1Score,Round2Score,Round3Score}:any) => {
    return (
        <div className="inactivity-player text-uppercase">{
            playerName} WINS ,<br/>opponent is inactive
        </div>
    )
}

export default WinnerByInactivity

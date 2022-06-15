import React from 'react'

const WinnerByInactivity = ({ state, playerName }: any) => {
    return (
        <>
            {state === 'inactive' ?
                (<div className="inactivity-player text-uppercase">
                    {playerName} WINS ,<br />opponent is inactive
                </div>):
            (<div className="inactivity-player text-uppercase">
                {playerName} WINS, <br/>Opponent has left the game
            </div>)
                
                }
        </>
    )
}

export default WinnerByInactivity

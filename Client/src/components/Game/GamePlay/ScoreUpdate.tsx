import React, { useEffect, useState } from 'react'

const ScoreUpdate = ({ currentSelectedCard, turn, round, ownerAccount, socket, account, p1Score, p2Score }: any) => {

    const [endClick, setEndClick] = useState(false)
    const [playerBtnColorChange1, setPlayerBtnColorChange1] = useState(false)
    const [playerBtnColorChange2, setPlayerBtnColorChange2] = useState(false)


    useEffect(() => {
        if (round.roundP1 === round.roundP2 && round.roundP1 !== 1 && round.roundP2 !== 1) {
            setEndClick(false)
            setPlayerBtnColorChange1(false)
            setPlayerBtnColorChange2(false)
        }
            if (round.roundP1 > round.roundP2) {
                console.log("owner")
                setPlayerBtnColorChange1(true)
            }
            if (round.roundP1 < round.roundP2) {
                console.log("not owner")
                setPlayerBtnColorChange2(true)
            }

    }, [account, ownerAccount, round.P1, round.P2, round.roundP1, round.roundP2])


    const handleEnd = () => {
        
        const arr = [currentSelectedCard, ownerAccount, account, {}];
        const array = [ownerAccount, account];
        
        if (turn === account) {
            socket.emit("changeTurn", JSON.stringify(arr));
        }
        socket.emit("endClick", JSON.stringify(array));
        setEndClick(true)

    }

    return (
        <div className="score-sec">
            <button className=" mt-3 ply-scr zero-margin custom-btn-score d-flex ">
                <div className="d-flex position-relative">
                    <div className="position-absolute" style={{ right: '35px', top: '-5px' }}>
                        <img width='35px' src={`/images/${(account === ownerAccount ? playerBtnColorChange2 : playerBtnColorChange1) ? 'red-circle.png' : 'green-circle.png'}`} alt="green-circle" />
                    </div>
                    <div>{p2Score}</div>
                </div>
            </button>
            <button disabled={endClick === true} onClick={handleEnd} className="mt-3 custom-btn d-flex ">
                <div>END</div>
            </button>
            <hr className="solid" />

            {/* <div className="score"> SCORE</div> */}
            <button className=" mt-3 ply-scr custom-btn-score d-flex ">
                <div className="d-flex position-relative">
                    <div className="position-absolute" style={{ right: '35px', top: '-5px' }}>
                        <img width='35px' src={`/images/${(account === ownerAccount ? playerBtnColorChange1 : playerBtnColorChange2) ? 'red-circle.png' : 'green-circle.png'}`} alt="red-circle" />
                    </div>
                    <div>{p1Score}</div>
                </div>
            </button>
        </div>
    )
}

export default ScoreUpdate

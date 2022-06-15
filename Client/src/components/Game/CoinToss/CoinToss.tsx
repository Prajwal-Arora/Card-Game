import React, { useEffect, useState } from 'react'
import { Card, Modal, Spinner } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useBattleDetail, useSocketDetail } from '../../../store/hooks'
import { setBattleArray } from '../../../store/reducer/userReducer'
import './index.css'

const CoinToss = ({ account, setOpenCoinTossModal, openCoinTossModal, redirectToGamePlay }: any) => {
    const [isTossed, setIsTossed] = useState('')
    const dispatch = useDispatch();
    const [winnerDetail, setWinnerDetail] = useState('')
    const [isTossDone, setIsTossDone] = useState(false)
    const battleArray: any = useBattleDetail();
    let socket: any = useSocketDetail();

    useEffect(() => {
        handleCoin()
    }, [isTossed])

    useEffect(() => {
        socket.on("turnIsSet", (obj: any) => {
            let winner:any
            setIsTossDone(true)
            const winnerDetails = JSON.parse(obj);
            dispatch(setBattleArray(winnerDetails));
            if (winnerDetails.turn === battleArray.player1) {
                winner = battleArray.team1
            }
            else {
                if (battleArray.team1 === "Remus") {
                    winner = 'Romulus'
                }
                else {
                    winner = 'Remus'
                }
            }
            setIsTossed('flip' + winner)
            setTimeout(() => setWinnerDetail(winner), 10000)
        })
        if (winnerDetail !== '') {
            setTimeout(() => {
                setOpenCoinTossModal(false)
                redirectToGamePlay() 
            }, 5000)
        }

    }, [winnerDetail])

    const handleCoin = () => {
        if (battleArray.player1 === account) {
            const flipResult = Math.random();
            if (flipResult < 0.5) {
                socket.emit("setTurn", JSON.stringify([battleArray.player1, battleArray.player1]));

            }
            else {
                socket.emit("setTurn", JSON.stringify([battleArray.player1, battleArray.player2]));

            }
        }


    }
    return (
        <Modal show={openCoinTossModal && isTossDone}>

            <div className="coin-modal-border text-center text-uppercase "  >
                <div className='pb-3 h3 text-decoration-underline text-white'>
                    Coin Toss
                </div>
                <div id="coin" className={`${isTossed}`}  >
                    <div className='side head'></div>
                    <div className='side tail'></div>
                </div>
                {winnerDetail !== '' ?
                    (<div className='text-yellow py-3 px-3'>
                         {winnerDetail} won
                    </div>) :
                    (<div className=' pt-4'>
                        <Spinner className='position-static' animation="border" />
                    </div>)
                }
            </div>
        </Modal>
    )
}

export default CoinToss

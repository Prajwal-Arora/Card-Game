import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';

const RoundModal = ({ socket, account, gameWinner, round, winnerRound }: any) => {
    const [show, setShow] = useState(false);
    const [currentRound, setCurrentRound] = useState(1)

    const handleNextRound=()=>{
        setShow(false)
    }

    const checkRound = () => {
        if (round.roundP1 === round.roundP2) {
            const round_val = round.roundP1
            setCurrentRound(round_val - 1)
        }
    }

    useEffect(() => {
        checkRound()
        if((round.roundP1 === round.roundP2) && round.roundP1!==1 && round.roundP2!==1 && gameWinner === '' ){
            setShow(true)
            
        }
        

    }, [round.roundP1, round.roundP2])


    return (
        <div className="waiting-opponent">
            <Modal onHide={handleNextRound} show={show}>
                <Modal.Body className="modal-bg winner-modal">
                   <div className="text-center" style={{fontSize:'24px', color:'yellow' }}> Round {currentRound} completed</div>
                    <button
                    onClick={handleNextRound}
                    className="mx-auto mt-4 custom-btn d-flex align-items-center"
                >
                    <div className="d-flex align-items-center position-relative">
                        <div>Continue</div>
                        {/* <div className="position-absolute right-arrow-position">
                            <img src="/images/right-arrow.png" alt="" className="w-50" />
                        </div> */}
                    </div>
                </button>
                </Modal.Body>
                
            </Modal>
        </div>
    )
}

export default RoundModal

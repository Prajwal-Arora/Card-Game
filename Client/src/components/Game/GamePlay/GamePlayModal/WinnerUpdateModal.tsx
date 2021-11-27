import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';

const WinnerUpdateModal = ({ socket,account, gameWinner,round }: any) => {
    let history = useHistory();
    const modalText = () => {
            if (gameWinner === account) {
                return ' Congratulations you won the game'
            }
            else {
                return 'Better luck  next time';
            }
        }

        const handleWinner=()=>{
            history.push("/create-room");
            window.location.reload();
        }
    

    useEffect(() => {
        modalText()
    }, [account, gameWinner,round.roundP1,round.roundP2])
    return (
        <div className="waiting-opponent">
            <Modal show={gameWinner !== '' }>
                <Modal.Body className="modal-bg winner-modal">
                    <div className="text-center" style={{fontSize:'24px', color:'yellow' }}>{modalText()}</div>
                    <button
                    onClick={handleWinner}
                    className=" mx-auto mt-4 custom-btn d-flex align-items-center"
                >
                    <div className=" d-flex align-items-center position-relative">
                        <div >Exit</div>
                    </div>
                </button>
                </Modal.Body>
                
            </Modal>
        </div>
    )
}

export default WinnerUpdateModal

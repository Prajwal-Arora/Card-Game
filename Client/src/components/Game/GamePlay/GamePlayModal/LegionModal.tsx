import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useBattleDetail } from '../../../../store/hooks';
import './index.css'

const LegionModal = ({ ownerAccount, account }: any) => {
    const battleArray = useBattleDetail();
    const [discardedPile, setDiscardedPile] = useState<any>([])
    
    const [handleShow, setHandleShow] = useState(true)

    const handleCancel=()=>{
        setHandleShow(false)
    }

    const handleDiscardedPile = (items: any) => {
        setHandleShow(false)
    }

    useEffect(() => {
        if (ownerAccount === account) {
            setDiscardedPile(battleArray.legion1)
        }
        else {
            setDiscardedPile(battleArray.legion2)
        }

    }, [account,battleArray.legion1, battleArray.legion2, ownerAccount])

    return (
        <div className="discarded-pile">
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                 show={handleShow}>
                <Modal.Body className="modal-bg discarded-pile-modal">
                    <div className="text-center" style={{ fontSize: '24px', color: 'yellow' }}>Discarded Pile</div>
                    <div className="row ">
                        {discardedPile.map((items: any) => {
                            return (
                                <>
                                    <div
                                        className="card card-row relative"
                                        key={items.id}
                                    >
                                        <img
                                            width="100%"
                                            onClick={() => handleDiscardedPile(items)}
                                            className={items?.active ? "active discarded-legion-radius font-weight-bold" : ""}
                                            src={items.battleCard}
                                            alt="battle-cards"
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            onClick={handleCancel}
                            className="mx-3 mt-4 cancel-btn  d-flex align-items-center"
                        >
                            <div className=" d-flex align-items-center position-relative">
                                <div >Cancel</div>
                            </div>
                        </button>

                        <button className=" mt-4 custom-btn d-flex align-items-center">
                            <div className=" d-flex align-items-center position-relative">
                                <div >Use</div>
                            </div>
                        </button>

                    </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default LegionModal

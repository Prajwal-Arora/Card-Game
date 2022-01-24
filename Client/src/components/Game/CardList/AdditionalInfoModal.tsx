import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './index.css'

const AdditionalInfoModal = ({ setShowInfoModal, showInfoModal }: any) => {


    const handleContinue = () => {
        setShowInfoModal(false)
    }
    return (
        <div className='additional-info'>
            <Modal
                show={showInfoModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="bg-image px-5">
                    <div
                        className=" position-relative d-flex z-0 text-center mx-auto mb-4 mt-3"
                        style={{ width: "300px" }}
                    >
                        <img
                            style={{ width: "100%" }}
                            className="m-auto "
                            src="/images/Rectangle 4.png"
                            alt=""
                        />
                        <div
                            style={{
                                width: "100%",
                                fontSize: "28px",
                                position: "absolute",
                                top: "46%",
                                left: "50%",
                                transform: " translate(-50%, -50%)",
                                color: "yellow",
                            }}
                        >
                           SELECT CARDS
                        </div>
                    </div>
                    <ol>
                        <li className='pb-4'>Select 25 cards to make up your legion</li>
                        <li className='pb-4'>You will then be randomly assigned 15 of these to make your hand</li>
                        <li>The other 10 card will make up your battle deck.Some abilities allow you to access these during the game!</li>
                    </ol>
                    <button
                        className="mx-auto mt-4 mb-2 continue-info-modal d-flex align-items-center"
                        onClick={handleContinue}
                    >
                        <div className="d-flex align-items-center position-relative m-auto">
                            <div>Continue</div>
                            <div className="position-absolute right-arrow-position">
                                <img src="/images/right-arrow.png" alt="right-arrow" className="w-50" />
                            </div>
                        </div>
                    </button>
                </Modal.Body>
            </Modal>
        </div>
    )
};

export default AdditionalInfoModal;

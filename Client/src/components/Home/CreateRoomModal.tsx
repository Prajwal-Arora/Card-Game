import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { io } from 'socket.io-client';

const CreateRoomModal = ({account, socket, show, handleClose, elementRef }: any) => {

    const handleCreateRoom = () => {
        console.log(account, "Account");
        socket.emit("join room", account)
    }

    return (

        <Modal show={show} onHide={handleClose}>
            <Modal.Body className="modal-bg ">
                <div >
                    <h3 className="text-lg text-white gradient-text">
                        xVemp Amount
                    </h3>
                    <div className="relative  flex-auto">
                            <input
                                type="text"
                                placeholder="Enter amount"
                                className={`w-100 px-2 py-2 input-bg text-primary`}
                                id="input"
                            />
                           
                            <button className="mx-auto mt-4 custom-btn d-flex align-items-center">
                                <div className="d-flex align-items-center position-relative">
                                    <div onClick={handleCreateRoom}>Create Room</div>
                                    <div className="position-absolute right-arrow-position">
                                        <img src="/images/right-arrow.png" alt="" className="w-50" />
                                    </div>
                                </div>
                            </button>
                        </div>
                    {/* <div className="d-flex justify-content-center">
                        <button
                            className="p-1 w-75 custom-btn ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        >
                            Create Room
                        </button>
                    </div> */}
                </div>

            </Modal.Body>
            {/* <div ref={elementRef} aria-labelledby="modal-title" role="dialog" aria-modal="true"
                className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className=" relative w-auto my-6 mx-auto w-1/3">
                    <div className=" modal-bg p-5 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                   
                        <div className="flex  items-start justify-between  border-blueGray-200 rounded-t">
                            <h3 className="text-lg text-white font-semibold gradient-text">
                                xVemp Amount
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                            </button>
                        </div>
                        <div className="relative  flex-auto">
                            <input
                                type="text"
                                placeholder="Enter amount"
                                className={`w-full px-2 pb-1.5 input-bg text-primary outline-none text-base font-light rounded-md`}
                                id="input"
                            />
                           
                            <button className="mx-auto mt-4 custom-btn flex items-center">
                                <div className="flex items-center relative">
                                    <div>Create Room</div>
                                    <div className="absolute right-arrow-position">
                                        <img src="/images/right-arrow.png" alt="" className="w-2/3" />
                                    </div>
                                </div>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
        </Modal>


    )
}

export default CreateRoomModal

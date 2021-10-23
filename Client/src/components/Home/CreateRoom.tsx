import React, { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import  io  from "socket.io-client";
import Web3 from 'web3';
import { useUserDetail, useWalletDetail } from '../../store/hooks';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getConnection, openMetamask } from '../../utils/contractIntegration/walletIntegration';
import CreateRoomModal from './CreateRoomModal';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import { Link } from 'react-router-dom';
import { End_point } from '../../utils/constant/Address';
import { setSocket } from '../../store/reducer/userReducer';



declare global {
    interface Window {
        ethereum: any;
        web3: Web3;
    }
}

let socket:any

const CreateRoom = () => {
    const dispatch = useAppDispatch();
    const walletState: any = useWalletDetail()
    const userDetail: any = useUserDetail()
    const [show, setShow] = useState(false);
    const ref = useRef(null);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);


    useEffect(()=>{
        const account =walletState?.accounts[0]
        const connectionOptions =  {
            "forceNew" : true,
            "reconnectionAttempts": Infinity, 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        }
       

        socket = io( End_point , connectionOptions);
        socket.on("connect",()=>{
            console.log(`you are connected with ${socket.id}` )
        })
        dispatch(setSocket(socket))
        socket.emit('join', account)


    },[])

    // useEffect(() => {
    //     const connectionOptions =  {
    //         "forceNew" : true,
    //         "reconnectionAttempts": Infinity, 
    //         "timeout" : 10000,                  
    //         "transports" : ["websocket"]
    //     }
    //     const account=walletState?.accounts[0]

    //     socket = io( End_point , connectionOptions);
    //     socket.on("connect",()=>{
    //         console.log(`you are connected with ${socket.id}` )
    //     })
    //     console.log(socket,"socket")
    //     socket.emit('join', account)
        
    //     // return function cleanup() {
    //     //     socket.emit('disconnect')
    //     //     //shut down connnection instance
    //     //     socket.off()
    //     // }
    // }, []);

    return (

        <div className="w-75 m-auto position-relative d-grid justify-content-center overflow-hidden">
            <div className="d-flex">
                <img style={{ width: '55%' }} className=" m-auto" src="/images/Logo-golden 2.png" alt="" />
            </div>
            <div style={{ bottom: '85px' }} className="position-relative z-0">
                <img style={{ width: '65%' }} className="m-auto d-flex" src="/images/Logo-golden2 1.png" alt="" />
                <div style={{ top: '180px' }} className="position-absolute w-100 d-flex z-0">
                    <img style={{ width: '60%' }} className="m-auto " src="/images/Rectangle 4.png" alt="" />
                    <div style={{ top: '5px', fontSize: '30px' }} className="gradient-text position-absolute w-100 text-white text-center">
                        THE CARD GAME
                    </div>
                </div>
                <div className="text-center mt-2 z-10">
                    {!walletState?.accounts[0] ? (
                        <button onClick={() => getConnection(dispatch)} className="custom-btn">Connect Wallet</button>
                    ) : (
                        <div className="d-grid m-auto w-50">
                            <button onClick={() => handleShow()} className="custom-btn bg-green-500 px-8 py-2  " id="modal">Create Room</button>
                            <Link to="/join-room" className="text-decoration-none">
                                <button className="custom-btn mt-2 focus:outline-none w-100">Join Room</button>
                            </Link>
                            <CreateRoomModal account={walletState?.accounts[0]} elementRef={ref} show={show} handleClose={handleClose} />
                        </div>
                    )}

                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CreateRoom

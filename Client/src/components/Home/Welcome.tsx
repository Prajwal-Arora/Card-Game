import React from 'react'
import { useUserDetail, useWalletDetail } from '../../store/hooks'
import { useHistory } from "react-router-dom";
import './index.css'
import { useAppDispatch } from '../../store/store';
import { getConnection } from '../../utils/contractIntegration/walletIntegration';

const Welcome = () => {
    const dispatch = useAppDispatch();
    const walletState: any = useWalletDetail()
    let history = useHistory();
    const account=walletState?.accounts[0]

    const onHandleContinue=()=>{
        history.push("/create-room");
    }

    return (
        <div style={{width:'34%'}} className="  py-4 m-auto">
            <div className="gradient-text welcome-txt text-uppercase">Welcome to vEmpire</div>
            <div className="mt-2 text-white text-uppercase">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </div>
            <div className=" d-flex justify-content-center">
               
                 { account?
                   (<button onClick={()=> onHandleContinue()} className=" mt-3 custom-btn d-flex align-items-center">
                        <div className="d-flex align-items-center position-relative">
                            <div>Continue</div>
                            <div className="position-absolute right-arrow-position">
                                <img src="/images/right-arrow.png" alt="" className="w-75" />
                            </div>
                        </div>
                    </button>):
                    (
                        <button className=" mt-3 custom-btn d-flex align-items-center" onClick={() => getConnection(dispatch)}>
                            
                            Connect Wallet
                        </button>
                    )
                }

            </div>
        </div>
    )
}

export default Welcome

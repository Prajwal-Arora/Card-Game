import React from 'react'
import { useWalletDetail } from '../../store/hooks';
import './index.css'

const WalletConnection = () => {
    const walletState: any = useWalletDetail()
    const accountEllipsis = walletState?.accounts[0] ? `${walletState?.accounts[0].substring(0, 4)}...${walletState?.accounts[0].substring(walletState?.accounts[0].length - 4)}` : '';

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(walletState?.accounts[0]);
        alert('Address copied');
    }

    return (
        <div className=" p-4">
            <div className="text-yellow text-xl flex items-center">
                USERNAME
                <span className="ml-2">
                    <img src="/images/down-arrow.png" alt="vector" className="w-2/3" />
                </span>
            </div>
            <div onClick={() => { copyToClipboard() }} className="text-white text-lg userAddress">
                {accountEllipsis ? accountEllipsis : 'Wallet address'}
            </div>
        </div>
    )
}

export default WalletConnection

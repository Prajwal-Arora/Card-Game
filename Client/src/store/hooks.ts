import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useAppSelector } from './store'
import { State, walletDetail } from './types'



export const useWalletDetail = () => {
    const wallet = useAppSelector((state) => state?.walletConnect)

    useEffect(() => {
        window?.ethereum?.on('accountsChanged', (accounts: any) => {

        })
    }, [])
    return wallet
}

export const useUserDetail = () => {
    const detail = useAppSelector((state) => state?.userDetail)

    return detail
}

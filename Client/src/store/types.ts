import Web3 from "web3";

export interface walletDetail {
    web3?: Web3,
    accounts?: string[],
    metaMaskInstalled?: boolean,
    isConnected?: boolean
}

export interface userDetail {
    riskFactor?:''
}



export interface State {
    walletConnect: walletDetail

}
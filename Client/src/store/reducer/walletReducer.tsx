import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";
import { getLocalStore } from "../../common/localStorage";

const initialState = {
    web3: {} as Web3,
    accounts: getLocalStore('account'),
    chainId: '',
    isConnected: false
};

export const commonSlice = createSlice({
    name: "walletConnect",
    initialState,
    reducers: {
        setWeb3: (state, action: PayloadAction<Web3>) => {
            state.web3 = action.payload;
        },
        setAccounts: (state, action: PayloadAction<string[]>) => {
            state.accounts = action.payload;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setChainId: (state, action: PayloadAction<string>) => {
            state.chainId = action.payload;
        }
    }
})



export const { setWeb3, setAccounts, setConnected, setChainId } = commonSlice.actions;
export default commonSlice.reducer;
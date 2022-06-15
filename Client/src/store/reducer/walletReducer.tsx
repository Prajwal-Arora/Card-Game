import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStore } from "../../common/localStorage";

const initialState = {
    userName:getLocalStore('userName'),
    spectatorName:'',
    spectator:false,
};

export const commonSlice = createSlice({
    name: "walletConnect",
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setSpectator: (state, action: PayloadAction<boolean>) => {
            state.spectator = action.payload;
        },
        setSpectatorName: (state, action: PayloadAction<string>) => {
            state.spectatorName = action.payload;
        },
        
    }
})



export const {setUserName,setSpectator,setSpectatorName} = commonSlice.actions;
export default commonSlice.reducer;
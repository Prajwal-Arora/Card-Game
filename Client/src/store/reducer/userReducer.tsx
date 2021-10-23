import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
    riskFactor:'10',
    socket:{}
};

export const commonSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setRiskFactor: (state, action: PayloadAction<string>) => {
            state.riskFactor = action.payload;
        },
        setSocket: (state, action: PayloadAction<any>) => {
            state.socket = action.payload;
        },
    }
})



export const { setRiskFactor,setSocket} = commonSlice.actions;
export default commonSlice.reducer;